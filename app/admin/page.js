"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Tabs, { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Button from "@/components/ui/button";
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";


const DashboardCard = ({ title, value }) => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-2xl">{value}</p>
    </Card>
  );
};
export default function AdminDashboard() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState("dashboard");
  const [officials, setOfficials] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalComplaints: 0,
    activeCases: 0,
    policeOfficers: 0,
    judges: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        setDashboardStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleTabChange = async (value) => {
    const roleMap = {
      "police": "Police Officer",
      "judges": "Judge",
      "prison-officials": "Prison Official",
    };
    const role = roleMap[value];
  
    try {
      const response = await fetch(`/api/admin/fetch_respective_officials?role=${role}`);
      if (!response.ok) throw new Error("Failed to fetch officials");
  
      const data = await response.json();
      setOfficials(data.officials);
    } catch (error) {
      console.error("Error fetching officials:", error);
    }
  };
  useEffect(() => {
    handleTabChange("police"); // Fetch police officials by default
  }, []);

  // Mock data for demonstration
  const complaints = [
    {
      id: 1,
      title: "Theft Report",
      status: "Pending",
      assignedTo: "Officer Smith",
    },
    {
      id: 2,
      title: "Assault Case",
      status: "Investigating",
      assignedTo: "Officer Johnson",
    },
  ];

  const handleLogOut = () => {
    router.push('/login');
  };



  return (
    <div className="container mx-auto p-4">
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogOut} className="bg-red-500 hover:bg-red-700 text-white">
          LogOut
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-7 h-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="officials">Manage Officials</TabsTrigger>
          <TabsTrigger value="entities">Add Entities</TabsTrigger>
          <TabsTrigger value="assign-complaints">Assign Complaints</TabsTrigger>
          <TabsTrigger value="assign-cases">Assign Cases</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Quick stats of the crime management system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard title="Total Complaints" value={dashboardStats.totalComplaints} />
                <DashboardCard title="Active Investigations" value={dashboardStats.activeCases} />
                <DashboardCard title="Court Cases" value={dashboardStats.courtCases} />
                <DashboardCard title="Police Officers" value={dashboardStats.policeOfficers} />
                <DashboardCard title="Judges" value={dashboardStats.judges} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="officials">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Manage Officials</CardTitle>
              <CardDescription>Add, remove, or update details of officials</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="police" className="w-full mb-4" onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="police">Police</TabsTrigger>
                  <TabsTrigger value="judges">Judges</TabsTrigger>
                  <TabsTrigger value="prison-officials">Prison Officials</TabsTrigger>
                </TabsList>
                <TabsContent value="police">
                  <ManageOfficialForm role="Police Officer" />
                </TabsContent>
                <TabsContent value="judges">
                  <ManageOfficialForm role="Judge" />
                </TabsContent>
                <TabsContent value="prison-officials">
                  <ManageOfficialForm role="Prison Official" />
                </TabsContent>
              </Tabs>
              <ExistingOfficialsTable officials={officials} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities">
          <Card>
            <CardHeader>
              <CardTitle>Add Entities</CardTitle>
              <CardDescription>Add new prisons, crimes, and criminals</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prisons" className="w-full">
                <TabsList>
                  <TabsTrigger value="prisons">Prisons</TabsTrigger>
                  <TabsTrigger value="crimes">Crimes</TabsTrigger>
                  <TabsTrigger value="criminals">Criminals</TabsTrigger>
                </TabsList>
                <TabsContent value="prisons">
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const prisonName = e.target.prisonName.value;
                      const prisonLocation = e.target.prisonLocation.value;
                      const prisonCapacity = e.target.prisonCapacity.value;
                      const wardenId = e.target.wardenId.value;

                      const response = await fetch('/api/admin/judges/add_prison', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          prison_name: prisonName,
                          location: prisonLocation,
                          capacity: parseInt(prisonCapacity, 10),
                          warden: parseInt(wardenId, 10), // Ensure warden is a number
                        }),
                      });

                      const result = await response.json();
                      if (response.ok) {
                        alert(result.message);
                      } else {
                        alert(`Error: ${result.message}`);
                      }
                    }}
                  >
                    <div>
                      <Label htmlFor="prisonName">Prison Name</Label>
                      <Input id="prisonName" name="prisonName" placeholder="Enter prison name" required />
                    </div>
                    <div>
                      <Label htmlFor="prisonLocation">Location</Label>
                      <Input id="prisonLocation" name="prisonLocation" placeholder="Enter prison location" required />
                    </div>
                    <div>
                      <Label htmlFor="prisonCapacity">Capacity</Label>
                      <Input
                        id="prisonCapacity"
                        name="prisonCapacity"
                        type="number"
                        placeholder="Enter prison capacity"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="wardenId">Warden (Prison Official ID)</Label>
                      <Input
                        id="wardenId"
                        name="wardenId"
                        type="number"
                        placeholder="Enter Warden ID"
                        required
                      />
                    </div>
                    <Button type="submit">Add Prison</Button>
                  </form>
                </TabsContent>
                <TabsContent value="crimes">
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={async (e) => {
                      e.preventDefault(); // Prevent the default form submission

                      // Collect form data
                      const crimeName = e.target.crimeName.value;
                      const lawApplicable = e.target.lawApplicable.value;

                      try {
                        // Send data to your API
                        const response = await fetch('/api/admin/judges/add_crime_criminals/add_crime', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            crime_name: crimeName,
                            law_applicable: lawApplicable,
                          }),
                        });

                        // Handle the API response
                        const result = await response.json();
                        if (response.ok) {
                          alert(result.message); // Show success message
                          e.target.reset(); // Reset the form fields
                        } else {
                          alert(`Error: ${result.message}`); // Show error message
                        }
                      } catch (error) {
                        console.error('Error submitting crime:', error);
                        alert('An error occurred while submitting the crime.');
                      }
                    }}
                  >
                    <div>
                      <Label htmlFor="crimeName">Crime Name</Label>
                      <Input id="crimeName" name="crimeName" placeholder="Enter crime name" required />
                    </div>
                    <div>
                      <Label htmlFor="lawApplicable">Law Applicable</Label>
                      <Input id="lawApplicable" name="lawApplicable" placeholder="Enter law applicable" required />
                    </div>
                    <Button type="submit">Add Crime</Button>
                  </form>
                </TabsContent>
                <TabsContent value="criminals">
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fname = e.target.fname.value;
                      const lname = e.target.lname.value;
                      const dob = e.target.dob.value;
                      const address = e.target.address.value;
                      const phoneNumber = e.target.phoneNumber.value;
                      const email = e.target.email.value;

                      const response = await fetch('/api/admin/judges/add_crime_criminals/add_criminal', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          fname,
                          lname,
                          dob,
                          address,
                          phone_number: phoneNumber,
                          email,
                        }),
                      });

                      const result = await response.json();
                      if (response.ok) {
                        alert(result.message);
                        e.target.reset(); // Reset form after successful submission
                      } else {
                        alert(`Error: ${result.message}`);
                      }
                    }}
                  >
                    <div>
                      <Label htmlFor="fname">First Name</Label>
                      <Input id="fname" name="fname" placeholder="Enter first name" required />
                    </div>
                    <div>
                      <Label htmlFor="lname">Last Name</Label>
                      <Input id="lname" name="lname" placeholder="Enter last name" required />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" name="dob" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" placeholder="Enter address" />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input id="phoneNumber" name="phoneNumber" type="text" placeholder="Enter phone number" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="Enter email" />
                    </div>
                    <Button type="submit">Add Criminal</Button>
                  </form>
              </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
      </TabsContent>

        <TabsContent value="assign-complaints">
          <AssignComplaintsForm />
        </TabsContent>

        <TabsContent value="assign-cases">
          <AssignCasesForm />
        </TabsContent>
        

        <TabsContent value="complaints">
          <ComplaintsTab />
        </TabsContent>
        
        <TabsContent value="cases">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Cases</CardTitle>
              <CardDescription>View all cases</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar structure to Complaints */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>{caseItem.title}</TableCell>
                      <TableCell>{caseItem.status}</TableCell>
                      <TableCell>{caseItem.assignedTo}</TableCell>
                      <TableCell>
                        <Button>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
function ManageOfficialForm({ role }) {
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [DOB, setDOB] = useState("");
  const [police_rank, setPoliceRank] = useState("");
  const [station, setStation] = useState("");
  const [court, setCourt] = useState("");
  const [official_email, setOfficialEmail] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const removePhoneNumber = (index) => {
    const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      Fname,
      Lname,
      DOB,
      police_rank: role === "Police Officer" ? police_rank : undefined,
      station: role === "Police Officer" ? station : undefined,
      court: role === "Judge" ? court : undefined,
      official_email,
      phoneNumbers: phoneNumbers.filter((number) => number !== ""), // Filter out empty numbers
    };
  
    try {
      const response = await fetch(`/api/admin/${
        role === "Police Officer"
          ? "police/add_police"
          : role === "Judge"
          ? "judges/add_judges"
          : "prison_officials/add_prison_officials"
      }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Success:', result.message);
      setFname('');
      setLname('');
      setDOB('');
      setPoliceRank('');
      setStation('');
      setCourt('');
      setOfficialEmail('');
      setPhoneNumbers(['']);
  
    } catch (error) {
      console.error('Error submitting data:', error);
      alert(`Failed to add ${role}. Please try again.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="Fname">First Name</Label>
        <Input id="Fname" value={Fname} onChange={(e) => setFname(e.target.value)} placeholder="Enter first name" />
      </div>
      <div>
        <Label htmlFor="Lname">Last Name</Label>
        <Input id="Lname" value={Lname} onChange={(e) => setLname(e.target.value)} placeholder="Enter last name" />
      </div>
      <div>
        <Label htmlFor="DOB">Date of Birth</Label>
        <Input id="DOB" type="date" value={DOB} onChange={(e) => setDOB(e.target.value)}
           />
      </div>
      
      {role === "Police Officer" && (
        <>
          <div>
            <Label htmlFor="police_rank">Rank</Label>
            <select
              id="police_rank"
              value={police_rank}
              onChange={(e) => setPoliceRank(e.target.value)}
              className="border rounded px-2 py-1 w-half"
            >
              <option value="">Select Rank</option>
              <option value="Constable">Constable</option>
              <option value="Inspector">Inspector</option>
              <option value="Superintendent">Superintendent</option>
            </select>
          </div>
          <div>
            <Label htmlFor="station">Station</Label>
            <Input id="station" value={station} onChange={(e) => setStation(e.target.value)} placeholder="Enter station" />
          </div>
        </>
      )}

      {role === "Judge" && (
        <div>
          <Label htmlFor="court">Court</Label>
          <Input id="court" value={court} onChange={(e) => setCourt(e.target.value)} placeholder="Enter court name" />
        </div>
      )}

      <div>
        <Label htmlFor="official_email">Official Email</Label>
        <Input id="official_email" value={official_email} onChange={(e) => setOfficialEmail(e.target.value)} placeholder="Enter official email" />
      </div>
      
      <div>
        <Label>Phone Numbers</Label>
        {phoneNumbers.map((number, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={number}
              onChange={(e) => handlePhoneChange(index, e.target.value)}
              placeholder="Enter phone number"
            />
            <Button type="button" onClick={() => removePhoneNumber(index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={addPhoneNumber}>Add Phone Number</Button>
      </div>

      <Button type="submit">Add {role}</Button>
    </form>
  );
}

function AssignComplaintsForm() {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState({});
  
  useEffect(() => {
    // Fetch complaints
    async function fetchPreviousComplaints() {
      try {
        const response = await fetch('/api/admin/police/get_unassigned_complaints');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    }

    // Fetch officers
    async function fetchOfficers() {
      try {
        const response = await fetch('/api/admin/police/get_officials_for_assignment');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setOfficers(data);
      } catch (error) {
        console.error('Error fetching officers:', error);
      }
    }

    fetchPreviousComplaints();
    fetchOfficers();
  }, []);

  const handleOfficerSelect = (complaintId, officerId) => {
    setSelectedOfficer((prev) => ({
      ...prev,
      [complaintId]: officerId,
    }));
  };

  const handleAssignComplaint = async (complaintId) => {
    const officerId = selectedOfficer[complaintId];
    
    if (!officerId) {
      alert('Please select an officer to assign this complaint.');
      return;
    }

    try {
      const response = await fetch('/api/admin/police/assign_complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_id: complaintId, police_id: officerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign complaint');
      }

      // Remove assigned complaint from list or show a confirmation
      setComplaints((prevComplaints) => prevComplaints.filter((c) => c.complaint_id !== complaintId));
      alert('Complaint assigned successfully.');
    } catch (error) {
      console.error('Error assigning complaint:', error);
      alert('Failed to assign complaint. Please try again.');
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Assign Complaints</CardTitle>
        <CardDescription>View previous complaints</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date Filed</TableHead>
              <TableHead>Assign To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.complaint_id}>
                <TableCell>{complaint.nature_of_crime}</TableCell>
                <TableCell>{complaint.date_filed}</TableCell>
                <TableCell>
                  <select
                    value={selectedOfficer[complaint.complaint_id] || ''}
                    onChange={(e) => handleOfficerSelect(complaint.complaint_id, e.target.value)}
                  >
                    <option value="">Select Officer</option>
                    {officers.map((officer) => (
                      <option key={officer.police_id} value={officer.police_id}>
                        {officer.Fname} {officer.Lname}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleAssignComplaint(complaint.complaint_id)}
                    style={{
                      backgroundColor: 'blue',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Assign
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ComplaintsTab() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  useEffect(() => {
    async function fetchComplaints() {
      try {
        const response = await fetch('/api/admin/complaints/fetch_all_complaints');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    }

    fetchComplaints();
  }, []);

  const handleViewComplaint = (complaintId) => {
    // Find the selected complaint from the complaints state
    const complaint = complaints.find(c => c.complaint_id === complaintId);
    if (complaint) {
      setSelectedComplaint(complaint);
    } else {
      console.error('Complaint not found');
    }
  };

  return (
    <div>
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>View all complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filed By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.complaint_id}>
                  <TableCell>{complaint.nature_of_crime}</TableCell>
                  <TableCell>{complaint.status}</TableCell>
                  <TableCell>{complaint.filed_by}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewComplaint(complaint.complaint_id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Display selected complaint details directly in the component */}
      {selectedComplaint && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2>Complaint Details</h2>
          <p><strong>Nature of Crime:</strong> {selectedComplaint.nature_of_crime}</p>
          <p><strong>Date Filed:</strong> {selectedComplaint.date_filed}</p>
          <p><strong>Status:</strong> {selectedComplaint.status}</p>
          <p><strong>Filed By:</strong> {selectedComplaint.filed_by}</p>
          
          {selectedComplaint.investigation && (
            <>
              <h3>Investigation Details</h3>
              <p><strong>Investigation ID:</strong> {selectedComplaint.investigation.investigation_id}</p>
              <p><strong>Initiated By:</strong> {selectedComplaint.investigation.initiated_by}</p>
              <p><strong>Date Initiated:</strong> {selectedComplaint.investigation.date_of_assignment}</p>
              <p><strong>Date of Completion:</strong> {selectedComplaint.investigation.date_of_completion || selectedComplaint.investigation.status}</p>
              <p><strong>Investigating Officer:</strong> {selectedComplaint.investigation.officer.fullName || 'Not Assigned'}</p>
              {/* Display any other relevant investigation data */}
            </>
          )}
        </div>
      )}
      <style jsx>{`
        /* General Styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
          margin: 0;
          padding: 0;
        }

        h2, h3 {
          margin-bottom: 10px;
          color: #2c3e50;
        }

        /* Card Styles */
        .card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          margin: 20px;
          padding: 20px;
        }

        .card-header {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .card-description {
          font-size: 0.875rem;
          color: #7f8c8d;
        }

        .card-content {
          margin-top: 20px;
        }

        /* Table Styles */
        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f8f8f8;
        }

        tr:hover {
          background-color: #f1f1f1;
        }

        button {
          background-color: #3498db;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #2980b9;
        }

        button:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }

        /* Select Dropdown */
        select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          width: 100%;
          max-width: 250px;
        }

        /* Complaint Details Section */
        .mt-4 {
          margin-top: 16px;
        }

        .p-4 {
          padding: 16px;
        }

        .border {
          border: 1px solid #ddd;
        }

        .rounded {
          border-radius: 8px;
        }

        .bg-gray-300 {
          background-color: #e2e8f0;
        }

        /* Dashboard Cards */
        .dashboard-card {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 250px;
          margin: 10px;
        }

        .dashboard-card h2 {
          font-size: 1.25rem;
          font-weight: bold;
        }

        .dashboard-card p {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-top: 8px;
        }

        /* Loading and Error States */
        .loading-spinner {
          display: inline-block;
          width: 24px;
          height: 24px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #e74c3c;
          font-weight: bold;
          margin-top: 10px;
        }

        /* Utility Classes */
        .text-center {
          text-align: center;
        }
  `
      }

      </style>
    </div>
  );
}


const ExistingOfficialsTable = ({ officials }) => {
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const handleEdit = async (police_id) => {
    console.log('Edit button clicked for police_id:', police_id);
    try {
      const response = await fetch(`/api/admin/police/edit/get_pn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ police_id }),
      });

      if (!response.ok) throw new Error('Failed to fetch phone numbers');

      const data = await response.json();
      setPhoneNumbers(data.phoneNumbers || []);
      setSelectedOfficial(police_id); // Set selected official to show phone numbers
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
    }
  };

  const handleAddPhoneNumber = async () => {
    if (!newPhoneNumber) return;

    try {
      const response = await fetch(`/api/admin/police/edit/add_pn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ police_id: selectedOfficial, phone_number: newPhoneNumber }),
      });

      if (!response.ok) throw new Error('Failed to add phone number');
      setPhoneNumbers((prev) => [...prev, newPhoneNumber]);
      setNewPhoneNumber(""); // Clear input field after successful addition
    } catch (error) {
      console.error('Error adding phone number:', error);
    }
  };

  const handleDeletePhoneNumber = async (phoneNumber) => {
    try {
      const response = await fetch(`/api/admin/police/edit/delete_pn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ police_id: selectedOfficial, phone_number: phoneNumber }),
      });

      if (!response.ok) throw new Error('Failed to delete phone number');
      setPhoneNumbers((prev) => prev.filter((pn) => pn !== phoneNumber));
    } catch (error) {
      console.error('Error deleting phone number:', error);
    }
  };

  const handleDelete = async (police_id) => {
    try {
      const response = await fetch('/api/admin/police/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ police_id }),
      });

      if (response.ok) {
        alert('Police officer deleted successfully');
        // Optionally refresh or update your UI here
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.warn('Response was not valid JSON:', jsonError);
          errorData = { message: 'Unknown error occurred' };
        }
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to delete police officer:', error);
      alert('Error deleting police officer');
    }
  };

  return (
    <>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Police Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {officials.map((official) => (
            <TableRow key={official.id}>
              <TableCell>{official.id}</TableCell>
              <TableCell>{official.name}</TableCell>
              <TableCell>{official.role}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(official.id)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(official.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOfficial && (
        <div className="phone-numbers">
          <h3>Phone Numbers for Officer {selectedOfficial}</h3>
          <ul>
            {phoneNumbers.length > 0 ? (
              phoneNumbers.map((phone, index) => (
                <li key={index}>
                  {phone}{" "}
                  <Button variant="destructive" onClick={() => handleDeletePhoneNumber(phone)}>
                    Delete
                  </Button>
                </li>
              ))
            ) : (
              <p>No phone numbers available</p>
            )}
          </ul>
          <input
            type="text"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            placeholder="Add a new phone number"
          />
          <Button onClick={handleAddPhoneNumber}>Add Phone Number</Button>
        </div>
      )}
    </>
  );
};




function AssignCasesForm() {
  const [cases, setCases] = useState([]); // List of investigation IDs
  const [judges, setJudges] = useState([]); // List of judges
  const [selectedJudge, setSelectedJudge] = useState({}); // Selected judge mapped by investigation ID

  useEffect(() => {
    async function fetchCases() {
      try {
        const response = await fetch('/api/admin/cases/fetch_for_case_assignment');
        if (!response.ok) throw new Error('Failed to fetch cases');
        const data = await response.json();
        setCases(data.investigations || []); // Assuming data is an array of investigation IDs
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    }

    fetchCases();
  }, []);

  useEffect(() => {
    async function fetchJudges() {
      try {
        const response = await fetch('/api/admin/fetch_respective_officials?role=Judge');
        if (!response.ok) throw new Error('Failed to fetch judges');
        const data = await response.json();
        setJudges(data.officials || []);
      } catch (error) {
        console.error('Error fetching judges:', error);
      }
    }

    fetchJudges();
  }, []);

  const handleJudgeSelect = (investigationId, judgeId) => {
    setSelectedJudge((prev) => ({
      ...prev,
      [investigationId]: judgeId,
    }));
  };

  const handleAssignCase = async (investigationId) => {
    const judgeId = selectedJudge[investigationId];

    if (!judgeId) {
      alert('Please select a judge to assign this case.');
      return;
    }

    console.log('Assigning:', { investigationId, judgeId });

    try {
      const response = await fetch('/api/admin/cases/assign_cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investigation_id: investigationId, judge_id: judgeId }),
      });

      if (!response.ok) throw new Error('Failed to assign case');

      setCases((prevCases) => prevCases.filter((id) => id !== investigationId));
      alert('Case assigned successfully.');
    } catch (error) {
      console.error('Error assigning case:', error);
      alert('Failed to assign case. Please try again.');
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Assign Cases</CardTitle>
        <CardDescription>Assign cases to judges</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investigation ID</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan="3">No cases available</TableCell>
              </TableRow>
            ) : (
              cases.map((investigationId) => (
                <TableRow key={investigationId}>
                  <TableCell>{investigationId}</TableCell>
                  <TableCell>
                    <Select
                      value={selectedJudge[investigationId] || ''}
                      onValueChange={(value) => handleJudgeSelect(investigationId, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Judge" />
                      </SelectTrigger>
                      <SelectContent>
                        {judges.map((judge) => (
                          <SelectItem key={judge.id} value={judge.id}>
                            {judge.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleAssignCase(investigationId)}>
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


