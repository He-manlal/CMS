const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Path to your service account key file
const SERVICE_ACCOUNT_FILE = '/home/admin-user/Downloads/decisive-lambda-310021-e85c527026f5.json'; // Update this path

// Scopes for Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Create a JWT client
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: SCOPES,
});

// Function to upload an image
async function uploadImage(filePath) {
  const drive = google.drive({ version: 'v3', auth });

  // Read the file and set the metadata
  const fileMetadata = {
    name: path.basename(filePath),
    parents: ['18fp238c55Ie_t8eqrd8hoBE5mE7n6P9G'], // Your folder ID
  };
  
  const media = {
    mimeType: 'image/jpeg', // Change this based on your image type
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log('File ID:', response.data.id);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// Example usage
const imagePath = '/home/admin-user/Pictures/Screenshots/1.jpg'; // Update this path
uploadImage(imagePath);



