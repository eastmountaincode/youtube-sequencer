import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { GET_PRESIGNED_URL, CREATE_PATTERN } from '../../graphql/mutations';
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const AWS_REGION = process.env.REACT_APP_AWS_REGION;

const UploadPattern = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [getPresignedUrl] = useMutation(GET_PRESIGNED_URL);
    const [createPattern] = useMutation(CREATE_PATTERN);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        try {
            // Get pre-signed URL
            setUploadStatus('Getting upload URL...');
            const { data } = await getPresignedUrl({
                variables: { filename: file.name }
            });
            //console.log('Pre-signed URL:', data.getPresignedUrl.url);
            console.log('key', data.getPresignedUrl.key);

            // Upload to S3
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
                        description: "My awesome pattern",
                        s3_url: s3BaseUrl,
                        creator_id: "user123" // Will come from auth context later
                      }
                    }
                  });

                setUploadStatus('Upload successful!');
            }

        } catch (error) {
            console.error('Error:', error);
            setUploadStatus('Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card bg-dark text-light border-secondary p-4 mb-4">
            <h3 className="mb-3">Upload Pattern</h3>
            <form onSubmit={handleSubmit}>
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
