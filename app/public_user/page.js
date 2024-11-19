
'use client';
{/*
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/useToast";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FileText, List } from "lucide-react";
import Badge from "@/components/ui/badge";

export default function ComplaintPage() {
  const router = useRouter(); 
  const [natureOfCrime, setNatureOfCrime] = useState("");
  const [description, setDescription] = useState("");
  const [date_of_crime, setDateOfCrime] = useState("");
  const [location, setLocation] = useState("");
  const [filedAgainst, setFiledAgainst] = useState("");
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [previousComplaints, setPreviousComplaints] = useState([]); // Store previous complaints
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/public_user');
        const data = await response.json();

        if (data.success) {
          setUserId(data.userId);
          console.log("Current userId", data.userId);
          fetchPreviousComplaints(data.userId); // Fetch complaints after getting userId
        } else {
          console.error("Failed to fetch userId:", data.message);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, []);

  const fetchPreviousComplaints = async (userId) => {
    try {
      const response = await fetch(`/api/user-complaints/`); 
      const data = await response.json();

      if (data.success && Array.isArray(data.complaints)) {
        setPreviousComplaints(data.complaints);
      } else {
        console.error("Failed to fetch complaints:", data.message);
      }
    } catch (error) {
      console.error("Error fetching previous complaints:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !userId) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natureOfCrime,
          description,
          date_of_crime,
          filedAgainst,
          location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          title: "Complaint Submitted",
          description: "Your complaint has been successfully filed.",
        });
        // Optionally reset form fields
        setNatureOfCrime("");
        setDescription("");
        setDateOfCrime("");
        setLocation("");
        setFiledAgainst("");

        // Fetch updated complaints after submission
        fetchPreviousComplaints(userId); // Fetch complaints after filing a new one
      } else {
        addToast({
          title: "Error",
          description: data.message,
        });
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      addToast({
        title: "Error",
        description: "An error occurred while submitting your complaint.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComplaint = (id) => {
    setExpandedComplaint(prev => (prev === id ? null : id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Investigation Completed":
        return "bg-green-500";
      case "Under Investigation":
        return "bg-yellow-500";
      case "Yet to be assigned":
        return "bg-orange-500";
      case "In Court":
        return "bg-red-500"
      default:
        return "bg-gray-500";
    }
  };
  const handleLogOut = () => {
    router.push('/login');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogOut} className="bg-red-500 hover:bg-red-700 text-white">
          LogOut
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Register Complaints</h1>
      
      {userId && <p className="text-lg text-center mb-8">Welcome, User ID: {userId}</p>}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2" />
            File a New Complaint
          </CardTitle>
          <CardDescription>Please provide details about your complaint</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="natureOfCrime">Nature of Crime</Label>
                <select
                  id="natureOfCrime"
                  className="border rounded p-2"
                  value={natureOfCrime}
                  onChange={(e) => setNatureOfCrime(e.target.value)}
                  required
                >
                  <option value="" disabled>Select the nature of the crime</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Assault">Assault</option>
                  <option value="Vandalism">Vandalism</option>
                  <option value="Kidnapping">Kidnapping</option>
                  <option value="Burglary">Burglary</option>
                  <option value="Murder">Murder</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Provide a brief description of the complaint"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="dateOfCrime">Date of Crime</Label>
                <Input
                  id="dateOfCrime"
                  type="date"
                  value={date_of_crime}
                  onChange={(e) => setDateOfCrime(e.target.value)}
                  max={new Date().toISOString().split("T")[0]} // Sets max to today's date
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter the location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="filedAgainst">Filed Against</Label>
                <Input
                  id="filedAgainst"
                  placeholder="Enter the name of the accused (if known)"
                  value={filedAgainst}
                  onChange={(e) => setFiledAgainst(e.target.value)}
                />
              </div>
            </div>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <List className="mr-2" />
            Your Previous Complaints
          </CardTitle>
          <CardDescription>View and track the status of your filed complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {previousComplaints.length === 0 ? (
              <p>No previous complaints found.</p>
            ) : (
              previousComplaints.map((complaint) => (
                <li key={`complaint-${complaint.complaint_id}`}>
                  <Card>
                    <CardHeader className="flex items-center">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleComplaint(complaint.complaint_id)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{complaint.description}</CardTitle>
                          <Badge className={`ml-2 ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </Badge>
                        </div>
                        <CardDescription>Filed on: {complaint.date_filed}</CardDescription>
                      </div>
                    </CardHeader>
                    {expandedComplaint === complaint.complaint_id && (
                      <CardContent>
                        <div>
                          <p><strong>Nature of Crime:</strong> {complaint.natureOfCrime}</p>
                          <p><strong>Location:</strong> {complaint.location}</p>
                          <p><strong>Filed Against:</strong> {complaint.filedAgainst || "N/A"}</p>
                          <p><strong>Date of Crime:</strong> {complaint.date_of_crime}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
*/}


import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/useToast";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FileText, List } from "lucide-react";
import Badge from "@/components/ui/badge";

export default function ComplaintPage() {
  const router = useRouter();
  const [natureOfCrime, setNatureOfCrime] = useState("");
  const [description, setDescription] = useState("");
  const [date_of_crime, setDateOfCrime] = useState("");
  const [location, setLocation] = useState("");
  const [filedAgainst, setFiledAgainst] = useState("");
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [previousComplaints, setPreviousComplaints] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/public_user');
        const data = await response.json();

        if (data.success) {
          setUserId(data.userId);
          fetchPreviousComplaints(data.userId);
        } else {
          console.error("Failed to fetch userId:", data.message);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, []);

  const fetchPreviousComplaints = async (userId) => {
    try {
      const response = await fetch(`/api/user-complaints/`);
      const data = await response.json();

      if (data.success && Array.isArray(data.complaints)) {
        setPreviousComplaints(data.complaints);
      } else {
        console.error("Failed to fetch complaints:", data.message);
      }
    } catch (error) {
      console.error("Error fetching previous complaints:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !userId) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natureOfCrime,
          description,
          date_of_crime,
          filedAgainst,
          location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          title: "Complaint Submitted",
          description: "Your complaint has been successfully filed.",
        });

        setNatureOfCrime("");
        setDescription("");
        setDateOfCrime("");
        setLocation("");
        setFiledAgainst("");

        fetchPreviousComplaints(userId);
      } else {
        addToast({
          title: "Error",
          description: data.message,
        });
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      addToast({
        title: "Error",
        description: "An error occurred while submitting your complaint.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawComplaint = async (complaintId) => {
    try {
      const response = await fetch(`/api/complaints/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complaintId }),
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          title: "Complaint Withdrawn",
          description: "Your complaint has been successfully withdrawn.",
        });
        alert(data.message);
        fetchPreviousComplaints(userId);
      } else {
        addToast({
          title: "Error",
          description: data.message,
        });
        alert(data.message)
      }
    } catch (error) {
      console.error("Error withdrawing complaint:", error);
      addToast({
        title: "Error",
        description: "An error occurred while withdrawing your complaint.",
      });
    }
  };

  const toggleComplaint = (id) => {
    setExpandedComplaint(prev => (prev === id ? null : id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Investigation Completed":
        return "bg-green-500";
      case "Under Investigation":
        return "bg-yellow-500";
      case "Yet to be assigned":
        return "bg-orange-500";
      case "In Court":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleLogOut = () => {
    router.push('/login');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogOut} className="bg-red-500 hover:bg-red-700 text-white">
          LogOut
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Register Complaints</h1>

      {userId && <p className="text-lg text-center mb-8">Welcome, User ID: {userId}</p>}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2" />
            File a New Complaint
          </CardTitle>
          <CardDescription>Please provide details about your complaint</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="natureOfCrime">Nature of Crime</Label>
                <select
                  id="natureOfCrime"
                  className="border rounded p-2"
                  value={natureOfCrime}
                  onChange={(e) => setNatureOfCrime(e.target.value)}
                  required
                >
                  <option value="" disabled>Select the nature of the crime</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Assault">Assault</option>
                  <option value="Vandalism">Vandalism</option>
                  <option value="Kidnapping">Kidnapping</option>
                  <option value="Burglary">Burglary</option>
                  <option value="Murder">Murder</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Provide a brief description of the complaint"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="dateOfCrime">Date of Crime</Label>
                <Input
                  id="dateOfCrime"
                  type="date"
                  value={date_of_crime}
                  onChange={(e) => setDateOfCrime(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter the location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="filedAgainst">Filed Against</Label>
                <Input
                  id="filedAgainst"
                  placeholder="Enter the name of the accused (if known)"
                  value={filedAgainst}
                  onChange={(e) => setFiledAgainst(e.target.value)}
                />
              </div>
            </div>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <List className="mr-2" />
            Your Previous Complaints
          </CardTitle>
          <CardDescription>View and track the status of your filed complaints</CardDescription>
        </CardHeader>
        <CardContent>
          {previousComplaints && previousComplaints.length > 0 ? (
            <div>
              {previousComplaints.map((complaint) => (
                <div key={complaint.complaint_id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{complaint.nature_of_crime}</span>
                    <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                  </div>
                  <p className="text-gray-600">{complaint.description}</p>
                  <p className="text-gray-500 text-sm">Filed on: {complaint.date_of_crime}</p>
                  <button
                    onClick={() => toggleComplaint(complaint.complaint_id)}
                    className="text-blue-500 mt-2"
                  >
                    {expandedComplaint === complaint.id ? (
                      <>
                        Collapse Details <ChevronUp />
                      </>
                    ) : (
                      <>
                        View Details <ChevronDown />
                      </>
                    )}
                  </button>
                  {expandedComplaint === complaint.complaint_id && (
                    <div className="mt-2">
                      <p><strong>Location:</strong> {complaint.location}</p>
                      <p><strong>Filed Against:</strong> {complaint.filedAgainst || 'N/A'}</p>
                      <Button
                        variant="destructive"
                        onClick={() => handleWithdrawComplaint(complaint.complaint_id)}
                      >
                        Withdraw Complaint
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No previous complaints found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
