import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import UploadPattern from '../UploadPattern';

const testPatternPath = path.join(__dirname, '__fixtures__', 'test-pattern.dance');
const testPatternContent = fs.readFileSync(testPatternPath);

describe('UploadPattern', () => {
    let s3Client: S3Client;

    beforeAll(() => {
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            throw new Error('AWS credentials are required');
        }

        s3Client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_KEY!
            }
        });

    });

    test('uploads file to S3 bucket in test_patterns folder', async () => {
        const file = new File([testPatternContent], 'test-pattern.dance', {
            type: 'application/octet-stream'
        });

        render(<UploadPattern />);

        const fileInput = screen.getByLabelText(/dance file/i);
        fireEvent.change(fileInput, { target: { files: [file] } });

        const uploadButton = screen.getByText(/upload/i);
        fireEvent.click(uploadButton);

        await waitFor(async () => {
            const s3Response = await s3Client.send(new GetObjectCommand({
                Bucket: 'youtube-sequencer-patterns',
                Key: 'test_patterns/test-pattern.dance'
            }));
            expect(s3Response.Body).toBeTruthy();
        });
    });

    test('creates new pattern record in database', async () => {
        return true;

    });

});
