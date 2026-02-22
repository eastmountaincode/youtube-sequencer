import React, { useState } from 'react';
import * as patternService from '../../services/patternService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link } from 'react-router-dom';

interface UploadPatternProps {
    onUploadComplete?: () => void;
}

const UploadPattern = ({ onUploadComplete }: UploadPatternProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        try {
            // Get pre-signed URL from R2 via edge function
            setUploadStatus('Getting upload URL...');
            const { url, key } = await patternService.getUploadUrl(
                file.name,
                process.env.NODE_ENV === 'test' ? 'test_patterns' : 'patterns'
            );
            console.log('key', key);

            // Upload to R2 using pre-signed URL
            setUploadStatus('Uploading to server...');
            const response = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            if (response.ok) {
                await patternService.createPattern({
                    name: file.name,
                    description: description,
                    storage_key: key,
                    creator_id: user?.uid || "anonymous",
                    creator_display_name: user?.displayName || "Anonymous"
                });
                setUploadStatus('Upload successful!');
                onUploadComplete?.();
            }

        } catch (error: any) {
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
                    <label htmlFor="dance-file" className="form-label">.dance File</label>
                    <input
                        id="dance-file"
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
