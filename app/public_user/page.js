"use client"

import { useState } from "react"
import  Button  from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import  Input  from "@/components/ui/input"
import  Label  from "@/components/ui/label"
import { useToast } from "@/components/ui/useToast"
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, FileText, List } from "lucide-react"
import  Badge  from "@/components/ui/badge"

// Mock data for previous complaints
const mockPreviousComplaints = [
  { id: 1, title: "Noise Complaint", status: "Resolved", dateFiled: "2023-05-15", natureOfCrime: "Disturbance", station: "Central Station", filedBy: "John Doe", filedAgainst: "Unknown Neighbor" },
  { id: 2, title: "Vandalism Report", status: "Under Investigation", dateFiled: "2023-06-02", natureOfCrime: "Property Damage", station: "West Precinct", filedBy: "Jane Smith", filedAgainst: "Unknown Suspects" },
  { id: 3, title: "Theft Report", status: "Pending", dateFiled: "2023-06-10", natureOfCrime: "Larceny", station: "East Precinct", filedBy: "Bob Johnson", filedAgainst: "Unknown Perpetrator" },
]

export default function ComplaintPage() {
  const [title, setTitle] = useState("")
  const [dateFiled, setDateFiled] = useState("")
  const [natureOfCrime, setNatureOfCrime] = useState("")
  const [station, setStation] = useState("")
  const [filedBy, setFiledBy] = useState("")
  const [filedAgainst, setFiledAgainst] = useState("")
  const [expandedComplaint, setExpandedComplaint] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSubmitting) return // Prevent multiple submissions
    setIsSubmitting(true)

    // Here you would typically send the complaint to your backend
    console.log("Submitting complaint:", { title, dateFiled, natureOfCrime, station, filedBy, filedAgainst })
    
    // Simulate successful submission
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been successfully filed.",
    })

    // Reset form fields
    setTitle("")
    setDateFiled("")
    setNatureOfCrime("")
    setStation("")
    setFiledBy("")
    setFiledAgainst("")
    setIsSubmitting(false)
  }

  const toggleComplaint = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500"
      case "Under Investigation":
        return "bg-yellow-500"
      case "Pending":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Complaint Management System</h1>
      
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
                <Label htmlFor="title">Complaint Title</Label>
                <Input
                  id="title"
                  aria-label="Complaint Title"
                  placeholder="Enter a brief title for your complaint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
             </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="dateFiled">Date Filed</Label>
                <Input
                  id="dateFiled"
                  type="date"
                  aria-label="Date Filed"
                  value={dateFiled}
                  onChange={(e) => setDateFiled(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="station">Station</Label>
                <Input
                  id="station"
                  aria-label="Station"
                  placeholder="Enter the police station name"
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="filedBy">Filed By</Label>
                <Input
                  id="filedBy"
                  aria-label="Filed By"
                  placeholder="Enter your full name"
                  value={filedBy}
                  onChange={(e) => setFiledBy(e.target.value)}
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
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </CardFooter>
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
            {mockPreviousComplaints.map((complaint) => (
              <li key={complaint.id}>
                <Card>
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted transition-colors" 
                    onClick={() => toggleComplaint(complaint.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription>Filed on: {complaint.dateFiled}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Badge className={`mr-2 ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </Badge>
                        {expandedComplaint === complaint.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {expandedComplaint === complaint.id && (
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">Nature of Crime:</p>
                          <p>{complaint.natureOfCrime}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Station:</p>
                          <p>{complaint.station}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Filed By:</p>
                          <p>{complaint.filedBy}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Filed Against:</p>
                          <p>{complaint.filedAgainst}</p>
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        {complaint.status === "Resolved" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        )}
                        <span>
                          {complaint.status === "Resolved" 
                            ? "This complaint has been resolved" 
                            : "This complaint is still being processed"}
                        </span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

