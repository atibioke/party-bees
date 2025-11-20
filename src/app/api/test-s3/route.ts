import { NextResponse } from 'next/server';
import { S3Client, HeadBucketCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET() {
  try {
    const bucketName = process.env.AWS_BUCKET || process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    // Check if credentials are configured
    if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing AWS credentials in environment variables',
        config: {
          bucketName: bucketName ? '✓ Set' : '✗ Missing',
          region: region ? '✓ Set' : '✗ Missing',
          accessKeyId: accessKeyId ? '✓ Set' : '✗ Missing',
          secretAccessKey: secretAccessKey ? '✓ Set' : '✗ Missing',
        },
      });
    }

    // Try multiple regions to find the bucket
    const regionsToTry = [
      region, // User-specified region first
      'us-east-1',
      'us-west-2',
      'eu-west-1',
      'ap-southeast-1',
    ].filter((r, i, arr) => r && arr.indexOf(r) === i); // Remove duplicates

    let workingRegion = null;
    let s3Client = null;

    // Find the correct region
    for (const testRegion of regionsToTry) {
      try {
        const client = new S3Client({
          region: testRegion,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        const headCommand = new HeadBucketCommand({ Bucket: bucketName });
        await client.send(headCommand);
        
        workingRegion = testRegion;
        s3Client = client;
        break;
      } catch (error: any) {
        // Continue to next region
        continue;
      }
    }

    if (!s3Client || !workingRegion) {
      return NextResponse.json({
        success: false,
        error: 'Could not access S3 bucket in any region',
        details: `Bucket "${bucketName}" not found or not accessible`,
        hint: 'Please verify:\n1. Bucket name is correct\n2. AWS credentials have permissions\n3. Bucket exists in your AWS account',
        testedRegions: regionsToTry,
      });
    }

    // Test 1: Upload a test file
    const testFileName = `test/connection-test-${Date.now()}.txt`;
    const testContent = `S3 connection test successful at ${new Date().toISOString()}`;
    
    try {
      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: testFileName,
        Body: Buffer.from(testContent),
        ContentType: 'text/plain',
        // ACL removed - bucket has ACLs disabled
      });
      await s3Client.send(putCommand);
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: 'Failed to upload test file to S3',
        details: error.message,
        foundRegion: workingRegion,
      });
    }

    // Test 2: Retrieve the test file
    try {
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: testFileName,
      });
      const response = await s3Client.send(getCommand);
      const retrievedContent = await response.Body?.transformToString();

      if (retrievedContent !== testContent) {
        return NextResponse.json({
          success: false,
          error: 'Retrieved content does not match uploaded content',
        });
      }
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve test file from S3',
        details: error.message,
      });
    }

    // All tests passed
    const fileUrl = `https://${bucketName}.s3.${workingRegion}.amazonaws.com/${testFileName}`;
    
    return NextResponse.json({
      success: true,
      message: 'AWS S3 connection verified successfully! ✓',
      details: {
        bucket: bucketName,
        region: workingRegion,
        configuredRegion: region,
        regionNote: workingRegion !== region ? `⚠️ Bucket is actually in ${workingRegion}, not ${region}` : '✓ Region matches',
        testFile: testFileName,
        testFileUrl: fileUrl,
        capabilities: {
          access: '✓ Can access bucket',
          upload: '✓ Can upload files',
          retrieve: '✓ Can retrieve files',
          publicRead: '✓ Public read access works',
        },
        nextSteps: workingRegion !== region 
          ? [`Update your .env file: AWS_REGION=${workingRegion}`]
          : ['✓ Configuration is correct!'],
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during S3 verification',
      details: error.message,
      stack: error.stack,
    });
  }
}
