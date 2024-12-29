import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { GET_PRESIGNED_URL, CREATE_PATTERN } from '../../graphql/mutations';
import { GET_PATTERNS } from '../../graphql/queries';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link } from 'react-router-dom';
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const AWS_REGION = process.env.REACT_APP_AWS_REGION;

const UploadPattern = () => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [getPresignedUrl] = useMutation(GET_PRESIGNED_URL);
    const user = useSelector((state: RootState) => state.auth.user)
    const [createPattern] = useMutation(CREATE_PATTERN, {
        refetchQueries: [
            {
                query: GET_PATTERNS,
                variables: {
                    limit: 10,
                    offset: 0,
                    orderBy: "created_at DESC",
                    userId: user?.uid || null
                }
            }
        ]
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        try {
            // Get pre-signed URL
            // If we don't use a pre-signed URL< the AWS access key is part of URL, not good
            setUploadStatus('Getting upload URL...');
            const { data } = await getPresignedUrl({
                variables: { filename: file.name }
            });
            //console.log('Pre-signed URL:', data.getPresignedUrl.url);
            console.log('key', data.getPresignedUrl.key);

            // Upload to S3 using pre-signed URL (data.getPresignedUrl.url)
            setUploadStatus('Uploading to server...');
            const response = await fetch(data.getPresignedUrl.url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            if (response.ok) {
                const s3BaseUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${data.getPresignedUrl.key}`;

                await createPattern({
                    variables: {
                        input: {
                            name: file.name,
                            description: description,
                            s3_url: s3BaseUrl,
                            creator_id: user?.uid || "anonymous"
                        }
                    },
                    onError: (error) => {
                        console.error('Create pattern error:', error);
                        setUploadStatus('Upload failed: ' + error.message);
                    },
                    onCompleted: () => {
                        setUploadStatus('Upload successful!');
                    }
                });
            }

        } catch (error) {
            console.error('Error:', error);
            setUploadStatus('Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="card bg-dark text-light border-secondary p-4 mb-4">
                <h3 className="mb-3">Upload Pattern</h3>
                <div className="text-center">
                    <Link to="/login" className="btn btn-outline-light">
                        Sign in to upload patterns
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-dark text-light border-secondary p-4 mb-4">
            <h3 className="mb-3">Upload Pattern</h3>
            <form onSubmit={handleSubmit}>
                {/* FILE INPUT */}
                <div className="mb-3">
                    <label className="form-label">.dance File</label>
                    <input
                        type="file"
                        className="form-control"
                        accept=".dance"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                        disabled={isLoading}
                    />
                </div>
                {/* DESCRIPTION */}
                <div className="mb-3 position-relative">
                    <label className="form-label">Description</label>
                    <div className="input-group">
                        <textarea
                            className="form-control"
                            style={{ maxHeight: '100px' }}
                            placeholder="Enter a short pattern description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={1}
                            disabled={isLoading}
                        />
                        {description && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setDescription('')}
                                disabled={isLoading}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-cloud-upload me-2" />
                            Upload
                        </>
                    )}
                </button>
                {uploadStatus && (
                    <div className="mt-3">
                        <small className="text-light">{uploadStatus}</small>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UploadPattern;
