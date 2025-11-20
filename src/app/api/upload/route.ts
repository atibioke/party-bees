import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import sharp from 'sharp';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-m4v'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 20MB limit' },
        { status: 400 }
      );
    }

    // Determine file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images (JPG, PNG, WebP) and videos (MP4, MOV) are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer) as Buffer;

    // For images, optimize using sharp
    if (isImage) {
      try {
        const optimizedBuffer = await sharp(buffer)
          .resize(1920, 1080, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85 })
          .toBuffer();
        buffer = optimizedBuffer;
      } catch (error) {
        console.error('Image optimization error:', error);
        // If optimization fails, use original buffer
      }
    }

    // Upload to S3
    const fileUrl = await uploadToS3(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        type: isImage ? 'image' : 'video',
        size: buffer.length,
        originalName: file.name,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
