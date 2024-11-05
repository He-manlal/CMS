// app/api/police/route.js
import multer from 'multer'; // Import multer for handling file uploads
import pool from '/app/lib/db'; // Import the database connection pool
import fs from 'fs'; // Import the file system module
import path from 'path'; // Import the path module
import { google } from 'googleapis'; // Import Google APIs
import { NextResponse } from 'next/server';

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'app/uploads'); // Specify the directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename the file
  },
});


const upload = multer({ storage });
// Google Drive API configuration
const SERVICE_ACCOUNT_FILE = '/home/admin-user/Downloads/decisive-lambda-310021-e85c527026f5.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Initialize Google Drive API client
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth });













// Function to upload a file to Google Drive
async function uploadFileToDrive(filePath, mimeType, folderId) {
  const fileMetadata = {
    name: path.basename(filePath),
    parents: [folderId], // Set your Google Drive folder ID
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    return `https://drive.google.com/file/d/${response.data.id}`;


  } catch (error) {
    console.error('Error uploading file:', error);
    // throw new Error('Failed to upload file to Google Drive');
  }
}


export async function PUT(req, res) {
  const { investigation_id, newStatus } = await req.json();

  if (!investigation_id || !newStatus) {
    return NextResponse.json({ message: 'Investigation ID and new status are required' }, { status: 400 });
  }

  try {
    await pool.query(
      'UPDATE investigation SET status = ? WHERE investigation_id = ?',
      [newStatus, investigation_id]
    );

    return NextResponse.json({ message: 'Status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


 async function uploadEvidence(req, res) {
  // Use multer to handle file upload
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return NextResponse.json({ message: 'File upload error' }, { status: 400 });
    }

    const { investigation_id } = req.body; // Get investigation ID from body
    const evidence_type = "Document"; // Set evidence type
    const file = req.file; // Access the uploaded file

    // Validate required fields
    if (!investigation_id || !evidence_type || !file) {
      return NextResponse.json({ message: 'Investigation ID, evidence type, and file are required' }, { status: 400 });
    }

    const filePath = file.path; // Get the path of the uploaded file

    try {
      const folderId = '18fp238c55Ie_t8eqrd8hoBE5mE7n6P9G'; // Replace with your Google Drive folder ID
      const mimeType = evidence_type === 'Image' ? 'image/jpeg' : 'application/pdf';

      // Upload file to Google Drive
      const drivePath = await uploadFileToDrive(filePath, mimeType, folderId);

      // Insert evidence record in the database
      await pool.query(
        'INSERT INTO evidence (investigation_id, evidence_type, image_path) VALUES (?, ?, ?)',
        [investigation_id, evidence_type, drivePath]
      );

      // Optionally, delete the temporary file after uploading
      fs.unlinkSync(filePath);

      return NextResponse.json({ message: 'Evidence uploaded and recorded successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error uploading evidence:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  });
}






export async function POST(req) {
  const { investigation_id, note } = await req.json();

    if (!investigation_id || !note) {
      return NextResponse.json({ message: 'Investigation ID and note are required.' });
    }

    try {
      // Update the notes column by appending the new note
      await pool.query(
        'UPDATE investigation SET notes = CONCAT(IFNULL(notes, ""), ?) WHERE investigation_id = ?',
        [note, investigation_id]
      );

      return NextResponse.json({ message: 'Note added successfully.' });
    } catch (error) {
      console.error('Error adding note:', error);
      return NextResponse.json({ message: 'Internal server error' });
    }
}














// GET handler for fetching police officers and their complaints
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const officialEmail = searchParams.get('officialEmail');

  try {
    let result;

    if (officialEmail) {
      [result] = await pool.query('SELECT * FROM police_officials WHERE official_email = ?', [officialEmail]);

      if (result.length === 0) {
        return new Response(JSON.stringify({ message: 'No police officer found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const [complaints] = await pool.query(`
        SELECT 
          c.complaint_id, 
          c.description, 
          c.date_of_crime, 
          c.status, 
          c.nature_of_crime, 
          c.location, 
          c.filed_by, 
          c.filed_against, 
          c.date_filed,
          i.investigation_id
        FROM investigation_officer io
        JOIN investigation i ON io.investigation_id = i.investigation_id
        JOIN complaint c ON i.complaint_id = c.complaint_id
        WHERE io.police_id = ?
      `, [result[0].police_id]);

      return new Response(JSON.stringify({ officer: result[0], complaints }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      [result] = await pool.query('SELECT * FROM police_officials');
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching police officers:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
