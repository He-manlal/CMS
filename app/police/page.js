"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import  Input  from "@/components/ui/input";
import  Label  from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';

export default function PolicePage() {
  const [officer, setOfficer] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [fileStates, setFileStates] = useState({});
  const [statusStates, setStatusStates] = useState({});
  const [error, setError] = useState(null);
  const [notesStates, setNotesStates] = useState({});
  const [evidencetypeStates, setEvidencetypeStates] = useState({});
  const [actionInputs, setActionInputs] = useState({});
  const router = useRouter();

  const [newCriminal, setNewCriminal] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    phoneNumber: '',
    email: '',
  });

  const [chargesheet, setChargesheet] = useState({
    investigationId: '',
    criminalSearch: '',
  });

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

  const handleAddNote = async (investigation_id, complaintId) => {
    const note = notesStates[complaintId];
    if (!note) {
      alert("Please enter a note.");
      return;
    }
    try {
      const response = await fetch('/api/police', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investigation_id, note }),
      });
  
      if (!response.ok) throw new Error(`Failed to add note: ${response.statusText}`);
  
      alert('Note added successfully');
      setNotesStates(prev => ({ ...prev, [complaintId]: '' }));
    } catch (error) {
      console.error("Error adding note:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleStatusChange = (event, complaintId) => {
    const status = event.target.value;
    setStatusStates(prev => ({
      ...prev,
      [complaintId]: status
    }));
  };

  const handleUpdateStatus = async (investigation_id, complaintId) => {
    const newStatus = statusStates[complaintId];
    if (!newStatus) {
      alert("Please select a status.");
      return;
    }

    try {
      const response = await fetch('/api/police', {
        method: 'PUT',
        body: JSON.stringify({ investigation_id, newStatus }),
      });

      if (!response.ok) throw new Error(`Failed to update status: ${response.statusText}`);

      alert('Status updated successfully');
      fetchOfficerDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEvidenceChange = (event, complaintId) => {
    const evidenceType = event.target.value;
    setEvidencetypeStates(prev => ({
      ...prev,
      [complaintId]: evidenceType
    }));
  };
   
  const handleUpdateEvidence = async (investigation_id, complaintId) => {
    const newEvidenceType = evidencetypeStates[complaintId];
    const additionalData = actionInputs[complaintId];
  
    if (!newEvidenceType || !additionalData) {
      alert("Please select an evidence type and enter additional data.");
      return;
    }
  
    try {
      const response = await fetch('/api/police/evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investigation_id, newEvidenceType, additionalData }),
      });
  
      if (!response.ok) throw new Error(`Failed to update evidence: ${response.statusText}`);
  
      alert('Evidence updated successfully');
    } catch (error) {
      console.error("Error updating evidence:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogOut = () => {
    router.push('/login');
  };

  const handleCriminalInputChange = (e) => {
    const { name, value } = e.target;
    setNewCriminal(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCriminal = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/criminals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCriminal),
      });

      if (!response.ok) throw new Error(`Failed to add criminal: ${response.statusText}`);

      alert('Criminal added successfully');
      setNewCriminal({
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        phoneNumber: '',
        email: '',
      });
    } catch (error) {
      console.error("Error adding criminal:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleChargesheetInputChange = (e) => {
    const { name, value } = e.target;
    setChargesheet(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChargesheet = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/chargesheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chargesheet),
      });

      if (!response.ok) throw new Error(`Failed to file chargesheet: ${response.statusText}`);

      alert('Chargesheet filed successfully');
      setChargesheet({
        investigationId: '',
        criminalSearch: '',
      });
    } catch (error) {
      console.error("Error filing chargesheet:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="police-page">
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogOut} className="bg-red-500 hover:bg-red-700 text-white">
          LogOut
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Police Officer Dashboard</h1>

      {error && <p className="error">{error}</p>}

      {officer && (
        <div className="officer-info">
          <h2 className="text-2xl font-semibold mb-4">Officer Information</h2>
          <div className="officer-details">
            <p><strong>First Name:</strong> {officer.Fname}</p>
            <p><strong>Last Name:</strong> {officer.Lname}</p>
            <p><strong>DOB:</strong> {officer.DOB}</p>
            <p><strong>Rank:</strong> {officer.police_rank}</p>
            <p><strong>Station:</strong> {officer.station}</p>
            <p><strong>Email:</strong> {officer.official_email}</p>
          </div>

          <h2 className="text-2xl font-semibold my-6">Complaints</h2>
          <div className="complaints-table-container">
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
                  <th>Update Status</th>
                  <th>Notes</th>
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
                      <select value={evidencetypeStates[complaint.complaint_id] || ''} onChange={(e) => handleEvidenceChange(e, complaint.complaint_id)}>
                        <option value="">Select Evidence Type</option>
                        <option value="Document">Document</option>
                        <option value="Image">Image</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Enter additional data"
                        value={actionInputs[complaint.complaint_id] || ''}
                        onChange={(e) =>
                          setActionInputs(prev => ({
                            ...prev,
                            [complaint.complaint_id]: e.target.value
                          }))
                        }
                      />
                      <button onClick={() => handleUpdateEvidence(complaint.investigation_id, complaint.complaint_id)}>
                        Update Evidence
                      </button>
                    </td>
                    <td>
                      <select value={statusStates[complaint.complaint_id] || ''} onChange={(e) => handleStatusChange(e, complaint.complaint_id)}>
                        <option value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <button onClick={() => handleUpdateStatus(complaint.investigation_id, complaint.complaint_id)}>
                        Update Status
                      </button>
                    </td>
                    <td>
                      <textarea
                        placeholder="Add a note..."
                        value={notesStates[complaint.complaint_id] || ''}
                        onChange={(e) => {
                          setNotesStates(prev => ({
                            ...prev,
                            [complaint.complaint_id]: e.target.value
                          }));
                        }}
                      />
                      <button onClick={() => handleAddNote(complaint.investigation_id, complaint.complaint_id)}>
                        Add Note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className='crim-form'>
      <AddCriminalForm />
      </div>
      <div className='crim-form'>
      <FileChargesheetForm />
      </div>

      <style jsx>{`
        .police-page {
          background-color: rgba(0, 0, 0, 0);
          color: #333;
          padding: 30px;
          border-radius: 10px;
          font-family: Arial, sans-serif;
        }

        .officer-info {
          margin-bottom: 40px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 1);
        }
        
        .crim-form{
          box-shadow: 0 4px 8px rgba(0, 0, 0, 1);

        }

        .officer-details {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: space-between;
        }

        .officer-details p {
          width: 48%;
          font-size: 16px;
          margin: 10px 0;
          padding: 10px;
          background-color: #f3f4f6;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .officer-details p strong {
          color: #4a90e2;
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

        .complaints-table-container {
          overflow-x: auto;
          margin-top: 20px;
        }

        table {
          min-width: 800px;
        }

        .complaints-table-container::-webkit-scrollbar {
          height: 8px;
        }

        .complaints-table-container::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 4px;
        }

        .complaints-table-container::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }

        .police-page {
          font-size: 16px;
        }

        .officer-info p {
          font-size: 18px;
        }

        .officer-details p {
          font-size: 14px;
        }

        th {
          font-size: 18px;
        }

        td {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}


function AddCriminalForm() {
  const [newCriminal, setNewCriminal] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    phoneNumber: '',
    email: ''
  });

  const handleCriminalInputChange = (e) => {
    const { name, value } = e.target;
    setNewCriminal((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCriminal = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    const criminalData = {
      fname: newCriminal.firstName,
      lname: newCriminal.lastName,
      dob: newCriminal.dob,
      address: newCriminal.address,
      phone_number: newCriminal.phoneNumber,
      email: newCriminal.email
    };

    try {
      const response = await fetch('/api/admin/judges/add_crime_criminals/add_criminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(criminalData)
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully added the criminal
        alert(data.message);
        setNewCriminal({
          firstName: '',
          lastName: '',
          dob: '',
          address: '',
          phoneNumber: '',
          email: ''
        });
      } else {
        // Handle error cases (validation, existing records, etc.)
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding criminal:', error);
      alert('An error occurred while adding the criminal.');
    }
  };

  return (
    <div className="crim-form">
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Add Criminal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCriminal} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={newCriminal.firstName}
                  onChange={handleCriminalInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={newCriminal.lastName}
                  onChange={handleCriminalInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={newCriminal.dob}
                onChange={handleCriminalInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={newCriminal.address}
                onChange={handleCriminalInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={newCriminal.phoneNumber}
                onChange={handleCriminalInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newCriminal.email}
                onChange={handleCriminalInputChange}
                required
              />
            </div>
            <Button type="submit">Add Criminal</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}




function FileChargesheetForm() {
  const [chargesheet, setChargesheet] = useState({
    investigationId: '',
    criminalSearch: ''
  });
  const [criminals, setCriminals] = useState([]);
  const [selectedCriminal, setSelectedCriminal] = useState('');

  // Handle input changes
  const handleChargesheetInputChange = (e) => {
    const { name, value } = e.target;
    setChargesheet((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle the search for criminals based on input
  const handleSearchCriminals = async (searchTerm) => {
    if (searchTerm.length >= 2) { // Fetch when user types at least 2 characters
      try {
        const response = await fetch('/api/police/search_criminal?searchTerm=' + searchTerm);
        const data = await response.json();
        setCriminals(data); // Assuming response is an array of criminals
      } catch (error) {
        console.error('Error fetching criminals:', error);
      }
    } else {
      setCriminals([]); // Clear search results if input is too short
    }
  };

  // Handle form submission
  const handleFileChargesheet = async (e) => {
    e.preventDefault();

    if (!selectedCriminal) {
      alert('Please select a criminal');
      return;
    }

    try {
      // Send data to backend to file chargesheet
      const response = await fetch('/api/police/file_chargesheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investigationId: chargesheet.investigationId,
          selectedCriminal: selectedCriminal,
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Handle success (clear form, etc.)
      alert(data.message);

      // Handle success (clear form, etc.)
      setChargesheet({ investigationId: '', criminalSearch: '' });
      setSelectedCriminal('');
    } catch (error) {
      console.error('Error filing chargesheet:', error);
    }
  };

  // Handle selecting a criminal from search results
  const handleSelectCriminal = (criminal) => {
    setSelectedCriminal(criminal); // Store the selected criminal object
    setChargesheet((prev) => ({
      ...prev,
      criminalSearch: criminal.fullName // Display full name in search input
    }));
    setCriminals([]); // Clear search results
  };

  return (
    <div className="crim-form">
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>File Chargesheet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileChargesheet} className="space-y-4">
            <div>
              <Label htmlFor="investigationId">Investigation ID</Label>
              <Input
                id="investigationId"
                name="investigationId"
                value={chargesheet.investigationId}
                onChange={handleChargesheetInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="criminalSearch">Criminal Search</Label>
              <Input
                id="criminalSearch"
                name="criminalSearch"
                value={chargesheet.criminalSearch}
                onChange={(e) => {
                  handleChargesheetInputChange(e);
                  handleSearchCriminals(e.target.value); // Trigger search as user types
                }}
                required
              />
              {criminals.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                  {criminals.map((criminal) => (
                    <li
                      key={criminal.criminal_id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSelectCriminal(criminal)}
                    >
                      {`${criminal.fname} ${criminal.lname}`}
                    </li>
                  ))}

                </ul>
              )}
            </div>
            <div>
              <Label>Selected Criminal</Label>
              <Input
                value={selectedCriminal ? `${selectedCriminal.fname} ${selectedCriminal.lname}` : ''}
                readOnly
              />

            </div>
            <Button type="submit">File Chargesheet</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

