import { uploadToS3, deleteFromS3 } from '../src/lib/s3';
import fs from 'fs';
import path from 'path';
import https from 'https';

async function testS3Upload() {
  console.log('🚀 Starting S3 Upload Test...');

  // 1. Create a dummy buffer (simulating an image)
  const testContent = 'This is a test file from the party-bees test script.';
  const buffer = Buffer.from(testContent);
  const filename = 'test-upload.txt';
  const contentType = 'text/plain';

  try {
    // 2. Upload to S3
    console.log('📤 Uploading test file...');
    const url = await uploadToS3(buffer, filename, contentType);
    console.log('✅ Upload successful!');
    console.log('🔗 File URL:', url);

    // 3. Verify Public Access (Download)
    console.log('📥 Attempting to download file to verify public access...');
    
    await new Promise<void>((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            if (data === testContent) {
              console.log('✅ File retrieved successfully and content matches!');
              resolve();
            } else {
              console.error('❌ Content mismatch!');
              reject(new Error('Content mismatch'));
            }
          });
        } else {
          console.error(`❌ Failed to retrieve file. Status Code: ${res.statusCode}`);
          reject(new Error(`Status Code: ${res.statusCode}`));
        }
      }).on('error', (err) => {
        console.error('❌ Network error during retrieval:', err.message);
        reject(err);
      });
    });

    // 4. Cleanup (Optional - commented out to let user check manually if they want)
    // console.log('🗑️ Cleaning up (deleting test file)...');
    // await deleteFromS3(url);
    // console.log('✅ Test file deleted.');

  } catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
  }
}

testS3Upload();

