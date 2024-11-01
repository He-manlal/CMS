'use client';

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useToast } from "@/components/ui/useToast";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FileText, List } from "lucide-react";
import Badge from "@/components/ui/badge";

export default function ComplaintPage() {
  const [natureOfCrime, setNatureOfCrime] = useState("");
  const [description, setDescription] = useState("");
  const [date_of_crime, setDateOfCrime] = useState("");
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
      const response = await fetch(`/api/user-complaints/`); // Adjust API endpoint as necessary
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
      case "Resolved":
        return "bg-green-500";
      case "Under Investigation":
        return "bg-yellow-500";
      case "Pending":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
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
                <Input
                  id="natureOfCrime"
                  aria-label="Nature of Crime"
                  placeholder="Enter the nature of the crime"
                  value={natureOfCrime}
                  onChange={(e) => setNatureOfCrime(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  aria-label="Description"
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
                  aria-label="Date of Crime"
                  value={date_of_crime}
                  onChange={(e) => setDateOfCrime(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="filedAgainst">Filed Against</Label>
                <Input
                  id="filedAgainst"
                  aria-label="Filed Against"
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
                <li key={`complaint-${complaint.complaint_id}`}> {/* Ensure unique key */}
                  <Card>
                  <CardHeader className="flex items-center">
                    <div className="flex-1 cursor-pointer" onClick={() => toggleComplaint(complaint.complaint_id)}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{complaint.description}</CardTitle>
                        <Badge className={`ml-2 ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </Badge>
                      </div>
                      <CardDescription className="inline-block">Filed on: {complaint.date_filed}</CardDescription>
                    </div>
                  </CardHeader>
                    {expandedComplaint === complaint.complaint_id && ( // Only render details if expanded
                      <CardContent>
                        <div>
                          <p><strong>Nature of Crime:</strong> {complaint.nature_of_crime}</p>
                          <p><strong>Date of Crime:</strong> {complaint.date_of_crime}</p>
                          <span>
                            <strong>Status:</strong> {complaint.status === "Resolved"
                              ? "This complaint has been resolved"
                              : "This complaint is still being processed"}
                          </span>
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
