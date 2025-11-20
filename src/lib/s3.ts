import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET || process.env.AWS_S3_BUCKET || '';
const REGION = process.env.AWS_BUCKET_REGION || process.env.AWS_REGION || 'us-east-1';
const BUCKET_URL = process.env.AWS_S3_BUCKET_URL || `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;

/**
 * Generate a unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop();
  return `events/${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = generateUniqueFilename(filename);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Ensure file is public
  });

  await s3Client.send(command);

  // Return the public URL
  return `${BUCKET_URL}/${key}`;
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    // Extract key from URL
    const key = fileUrl.replace(`${BUCKET_URL}/`, '');

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
}

/**
 * Get a presigned URL for temporary access
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}
