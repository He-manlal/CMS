// app/police/page.js
"use client"

import { useEffect, useState } from 'react';

export default function PolicePage() {
  const [officer, setOfficer] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [fileStates, setFileStates] = useState({}); // For file upload state
  const [error, setError] = useState(null);

  const fetchOfficerDetails = async () => {
    const email = localStorage.getItem('userEmail');
    const url = email ? `/api/police?officialEmail=${email}` : '/api/police';

    try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) throw new Error(`Failed to fetch police officer details: ${response.statusText}`);

      const data = await response.json();
      if (data.officer) {
        setOfficer(data.officer);
        setComplaints(data.complaints);
      } else {
        setOfficer(null);
        setComplaints([]);
      }
      setError(null);
    } catch (error) {
      setError(error.message);
      setOfficer(null);
      setComplaints([]);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOfficerDetails();
  }, []);

  const handleFileChange = (event, complaintId) => {
    const file = event.target.files[0];
    setFileStates(prev => ({
      ...prev,
      [complaintId]: { ...prev[complaintId], file }
    }));
  };

  const handleAddEvidence = async (investigation_id, complaintId) => {
    const { file } = fileStates[complaintId] || {};

    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("investigation_id", investigation_id);
    formData.append("evidence_type", "Document"); // Set to a default or manage as needed

    try {
      const response = await fetch('/api/police', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to upload evidence: ${response.statusText}`);

      alert('Evidence uploaded successfully');
      // Clear file state for this complaint after successful upload
      setFileStates(prev => ({ ...prev, [complaintId]: {} }));
    } catch (error) {
      console.error("Error uploading evidence:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="police-page">
      <h1>Police Officer Details</h1>

      {error && <p className="error">{error}</p>}

      {officer && (
        <div className="officer-info">
          <h2>Officer Information</h2>
          <div className="officer-details">
            <p><strong>First Name:</strong> {officer.Fname}</p>
            <p><strong>Last Name:</strong> {officer.Lname}</p>
            <p><strong>DOB:</strong> {officer.DOB}</p>
            <p><strong>Rank:</strong> {officer.police_rank}</p>
            <p><strong>Station:</strong> {officer.station}</p>
            <p><strong>Email:</strong> {officer.official_email}</p>
          </div>

          <h2>Complaints</h2>
          <table>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Investigation ID</th>
                <th>Description</th>
                <th>Date of Crime</th>
                <th>Status</th>
                <th>Nature of Crime</th>
                <th>Location</th>
                <th>Filed By</th>
                <th>Filed Against</th>
                <th>Date Filed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint.complaint_id}>
                  <td>{complaint.complaint_id}</td>
                  <td>{complaint.investigation_id}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.date_of_crime}</td>
                  <td>{complaint.status}</td>
                  <td>{complaint.nature_of_crime}</td>
                  <td>{complaint.location}</td>
                  <td>{complaint.filed_by}</td>
                  <td>{complaint.filed_against}</td>
                  <td>{complaint.date_filed}</td>
                  <td>
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, complaint.complaint_id)} 
                    />
                    <button onClick={() => handleAddEvidence(complaint.investigation_id, complaint.complaint_id)}>
                      Upload Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

      <style jsx>{`
        /* Lighter theme styling */
        .police-page {
          background-color: #f4f4f9;
          color: #333;
          padding: 20px;
          border-radius: 8px;
        }

        .officer-info {
          margin-bottom: 20px;
        }

        .officer-details {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
          background-color: #ffffff;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #e9e9e9;
        }

        tr:nth-child(even) {
          background-color: #f7f7f7;
        }

        tr:hover {
          background-color: #e0e0e0;
        }

        .error {
          color: #d9534f;
        }

        button {
          background-color: #5cb85c;
          color: #ffffff;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #4cae4c;
        }
      `}</style>
    </div>
  );
}
