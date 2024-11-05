// /utils/upload.js

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
async function uploadImage(file) {
  const drive = google.drive({ version: 'v3', auth });

  // Read the file metadata and create the upload stream
  const fileMetadata = {
    name: file.name, // Use the uploaded file's name
    parents: ['18fp238c55Ie_t8eqrd8hoBE5mE7n6P9G'], // Your folder ID
  };

  const media = {
    mimeType: file.mimetype, // Get MIME type from the file object
    body: file.buffer, // Assuming the file is in buffer format
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webContentLink', // Return the file ID and link
    });
    return response.data; // Return response data
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Propagate the error
  }
}

module.exports = uploadImage;

