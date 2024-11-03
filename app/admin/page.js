"use client";

import { useState, useEffect } from "react";
import Tabs, { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Button from "@/components/ui/button";
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import Modal from '@/components/ui/modal';

export default function AdminDashboard() {
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



  return (
    <div className="container mx-auto p-4">
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
{/*
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Quick stats of the crime management system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard title="Total Complaints" value="156" />
                <DashboardCard title="Active Cases" value="43" />
                <DashboardCard title="Police Officers" value="78" />
                <DashboardCard title="Judges" value="12" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
*/}
        <TabsContent value="dashboard">
          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Manage Officials</CardTitle>
              <CardDescription>Add, remove, or update details of officials</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="police" className="w-full mb-4">
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
                  <form className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="prisonName">Prison Name</Label>
                      <Input id="prisonName" placeholder="Enter prison name" />
                    </div>
                    <div>
                      <Label htmlFor="prisonLocation">Location</Label>
                      <Input id="prisonLocation" placeholder="Enter prison location" />
                    </div>
                    <div>
                      <Label htmlFor="prisonCapacity">Capacity</Label>
                      <Input id="prisonCapacity" type="number" placeholder="Enter prison capacity" />
                    </div>
                    <Button>Add Prison</Button>
                  </form>
                </TabsContent>
                <TabsContent value="crimes">
                  <form className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="crimeName">Crime Name</Label>
                      <Input id="crimeName" placeholder="Enter crime name" />
                    </div>
                    <div>
                      <Label htmlFor="crimeDescription">Description</Label>
                      <Input id="crimeDescription" placeholder="Enter crime description" />
                    </div>
                    <div>
                      <Label htmlFor="crimeSeverity">Severity</Label>
                      <Select>
                        <SelectTrigger id="crimeSeverity">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Add Crime</Button>
                  </form>
                </TabsContent>
                <TabsContent value="criminals">
                  <form className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="criminalName">Name</Label>
                      <Input id="criminalName" placeholder="Enter criminal's name" />
                    </div>
                    <div>
                      <Label htmlFor="criminalAge">Age</Label>
                      <Input id="criminalAge" type="number" placeholder="Enter criminal's age" />
                    </div>
                    <div>
                      <Label htmlFor="criminalCrimes">Associated Crimes</Label>
                      <Select>
                        <SelectTrigger id="criminalCrimes">
                          <SelectValue placeholder="Select crimes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theft">Theft</SelectItem>
                          <SelectItem value="assault">Assault</SelectItem>
                          <SelectItem value="fraud">Fraud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>Add Criminal</Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Assign Cases</CardTitle>
              <CardDescription>Assign cases to officials</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar structure to Assign Complaints */}
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
                  {/* Mock data for cases */}
                  {complaints.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>{caseItem.title}</TableCell>
                      <TableCell>{caseItem.status}</TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={caseItem.assignedTo} />
                          </SelectTrigger>
                          <SelectContent>
                            {officials.map((official) => (
                              <SelectItem key={official.id} value={official.name}>
                                {official.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button>Assign</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints">
          <ComplaintsTab />
        </TabsContent>
        
        <TabsContent value="cases">
          <Card>
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
  
    // Collect data and send to your API
    const data = {
      Fname,
      Lname,
      DOB,
      police_rank,
      station,
      official_email,
      phoneNumbers: phoneNumbers.filter((number) => number !== ""), // Filter out empty numbers
    };
  
    try {
      const response = await fetch('/api/admin/police/add_police', {
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
      // Handle successful response
      console.log('Success:', result.message);
      // Optionally reset the form or show a success message
      setFname(''); // Reset first name
      setLname(''); // Reset last name
      setDOB(''); // Reset date of birth
      setPoliceRank(''); // Reset police rank
      setStation(''); // Reset station
      setOfficialEmail(''); // Reset official email
      setPhoneNumbers(['']); 
  
    } catch (error) {
      console.error('Error submitting data:', error);
      // Handle error response
      alert('Failed to add police officer. Please try again.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {role === "Police Officer" && (
        <>
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
            <Input id="DOB" type="date" value={DOB} onChange={(e) => setDOB(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="police_rank">Rank</Label>
            <select
              id="police_rank"
              value={police_rank}
              onChange={(e) => setPoliceRank(e.target.value)}
              className="border rounded px-2 py-1 w-half" // Adjust styles as needed
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
        </>
      )}
      {(role === "Judge" || role === "Prison Official") && (
        <>
          <div>
            <Label htmlFor="officialName">Name</Label>
            <Input id="officialName" placeholder={`Enter ${role} name`} />
          </div>
          <div>
            <Label htmlFor="DOB">Date of Birth</Label>
            <Input id="DOB" type="date" placeholder={`Enter ${role} date of birth`} />
          </div>
        </>
      )}
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
    <Card>
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
      <Card>
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
    </div>
  );
}

const ExistingOfficialsTable = ({ officials }) => {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {officials.map((official) => (
          <TableRow key={official.id}>
            <TableCell>{official.name}</TableCell>
            <TableCell>{official.role}</TableCell>
            <TableCell>
              <Button>Edit</Button>
              <Button variant="destructive">Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const DashboardCard = ({ title, value }) => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-2xl">{value}</p>
    </Card>
  );
};


