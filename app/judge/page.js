"use client"
{/*


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Select, {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Calendar from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function JudgesPage() {
  const [judge, setJudge] = useState(null);
  const [cases, setCases] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchJudgeDetails = async () => {
      try {
        const response = await fetch("/api/judges/fetch_everything", {
          method: "GET",
        });

        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        setJudge(data.judge);
        setCases(data.cases || []);
      } catch (error) {
        console.error("Failed to fetch judge details and cases:", error);
      }
    };

    fetchJudgeDetails();
  }, []);

  const handleLogOut = () => {
    router.push("/login");
  };

  const handleDateChange = async (caseId, newDate) => {
    try {
      if (newDate < new Date()) {
        alert("The hearing date cannot be before today.");
        return; // Prevent request if the date is invalid
      }
  
      // Update the UI optimistically
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === caseId ? { ...c, hearingDate: newDate || c.hearingDate } : c
        )
      );
  
      // Make the request to the backend
      const response = await fetch(`/api/judges/assign_date`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caseId, hearingDate: newDate }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Revert changes if the request fails
        setCases((prevCases) =>
          prevCases.map((c) =>
            c.id === caseId ? { ...c, hearingDate: c.originalHearingDate } : c
          )
        );
        alert(`Error: ${data.message || "Failed to assign a new date"}`);
      } else {
        // Display success message with the updated date
        alert(`The date has been set to ${data.updatedHearingDate || newDate}`);
      }
    } catch (error) {
      console.error("Error assigning hearing date:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  
  

  const handleVerdict = async (caseId, verdict) => {
    try {
      const response = await fetch(`/api/judges/assign_verdict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caseId, verdict }),
      });
  
      // Parse the response
      const data = await response.json();
  
      if (response.ok) {
        alert(`Case ${caseId} verdict: ${verdict}`);
      } else {
        // Handle error if response is not okay
        console.error(`Error: ${data.error}`);
        alert(`Error updating verdict: ${data.error}`);
      }
    } catch (error) {
      console.error("Network error updating verdict:", error);
      alert("An error occurred while updating the verdict.");
    }
  };
  
// Function to handle adding a crime to the case
const handleAddCharge = async (investigationId, crimeId) => {
  try {
    // Fetch the case_id based on investigationId
    const response = await fetch(`/api/judges/add_crime_to_case`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ investigationId, crimeId }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(`Error: ${data.message || "Failed to assign crime"}`);
      return;
    }

    // Update the UI optimistically
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseId ? { ...c, charges: [...(c.charges || []), crimeId] } : c
      )
    );
  } catch (error) {
    console.error("Error assigning crime:", error);
    alert("An unexpected error occurred. Please try again.");
  }
};

// Function to fetch all crimes
const fetchCrimes = async () => {
  useEffect(() => {
    const getCrimes = async () => {
      try {
        const response = await fetch("/api/judges/add_crime_to_case", {
          method: "GET",
        });

        const data = await response.json();
        if (!response.ok) {
          alert("Error fetching crimes.");
          return;
        }

        setCrimes(data.crimes); // Set the crimes list from the response
      } catch (error) {
        console.error("Error fetching crimes:", error);
        alert("An error occurred while fetching crimes.");
      }
    };

    getCrimes();
  }, []);

  return crimes;
};

  

  if (!judge) {
    return <div>Loading judge details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Judge's Dashboard</h1>
        <Button onClick={handleLogOut} variant="destructive">
          Log Out
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Judge Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {judge.name}
          </p>
          <p>
            <strong>Courtroom:</strong> {judge.courtroom}
          </p>
          <p>
            <strong>Years of Experience:</strong> {judge.yearsOfExperience}
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Assigned Cases</h2>
      <Accordion type="single" collapsible className="w-full">
        {cases.map((case_) => (
          <AccordionItem key={case_.id} value={`case-${case_.id}`}>
            <AccordionTrigger>Case #{case_.id}</AccordionTrigger>
            <AccordionContent>
              <div>
                <h3 className="font-semibold">Accused:</h3>
                <ul className="list-disc list-inside">
                {Array.isArray(case_.accused) && case_.accused.length > 0 ? (
                  case_.accused.map((criminal, index) => (
                    // Using criminal.id as key; fallback to index if no id is available
                    <li key={criminal.criminal_id || index}>{criminal.name}</li>
                  ))
                ) : (
                  <p>No accused found.</p>
                )}

                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Hearing Date:</h3>
                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-[240px] justify-start text-left font-normal ${
                          !case_.hearingDate ? "text-muted-foreground" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {case_.hearingDate
                          ? format(new Date(case_.hearingDate), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={case_.hearingDate ? new Date(case_.hearingDate) : null}
                        onSelect={(date) => handleDateChange(case_.id, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Evidence:</h3>
                <ul className="list-disc list-inside">
                  {Array.isArray(case_.evidence) && case_.evidence.length > 0 ? (
                    case_.evidence.map((item) => (
                      <li key={item.evidence_id}>
                        {item.evidence_type}: {item.file_path}
                      </li>
                    ))
                  ) : (
                    <p>No evidence found.</p>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Charges:</h3>
                <ul className="list-disc list-inside">
                  {Array.isArray(case_.charges) && case_.charges.length > 0 ? (
                    case_.charges.map((charge, index) => (
                      <li key={index}>{charge}</li>
                    ))
                  ) : (
                    <p>No charges found.</p>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Verdict:</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleVerdict(case_.id, "guilty")}
                    variant="destructive"
                  >
                    Guilty
                  </Button>
                  <Button
                    onClick={() => handleVerdict(case_.id, "acquitted")}
                    variant="secondary"
                  >
                    Acquitted
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Add Charge:</h3>
                <div className="flex space-x-2">
                  <Select
                    onValueChange={(value) => handleAddCharge(case_.investigationId, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select charge" />
                    </SelectTrigger>
                    <SelectContent>
                      {crimes.map((crime) => (
                        <SelectItem key={crime.id} value={crime.id}>
                          {crime.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => handleAddCharge(case_.investigationId, selectedCrime)}>
                    Add Crime
                  </Button>
                </div>
              </div>

            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

*/}

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion,  AccordionContent,  AccordionItem,  AccordionTrigger,} from "@/components/ui/accordion";
import Select, {  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select";
import Calendar from "@/components/ui/calendar";
import {  Popover,  PopoverContent,  PopoverTrigger,} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function JudgesPage() {
  const [judge, setJudge] = useState(null);
  const [cases, setCases] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [selectedCrime, setSelectedCrime] = useState(null);  // Track selected crime
  const router = useRouter();

  useEffect(() => {
    const fetchJudgeDetails = async () => {
      try {
        const response = await fetch("/api/judges/fetch_everything", {
          method: "GET",
        });

        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        setJudge(data.judge);
        setCases(data.cases || []);
      } catch (error) {
        console.error("Failed to fetch judge details and cases:", error);
      }
    };

    fetchJudgeDetails();
  }, []);

  // Fetch crimes for the "Add Crime" functionality
  useEffect(() => {
    const getCrimes = async () => {
      try {
        const response = await fetch("/api/judges/add_crime_to_case", {
          method: "GET",
        });

        const data = await response.json();
        if (!response.ok) {
          alert("Error fetching crimes.");
          return;
        }

        setCrimes(data.crimes); // Set the crimes list from the response
      } catch (error) {
        console.error("Error fetching crimes:", error);
        alert("An error occurred while fetching crimes.");
      }
    };

    getCrimes();
  }, []);

  const handleLogOut = () => {
    router.push("/login");
  };

  const handleDateChange = async (caseId, newDate) => {
    try {
      if (newDate < new Date()) {
        alert("The hearing date cannot be before today.");
        return; // Prevent request if the date is invalid
      }
  
      // Update the UI optimistically
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === caseId ? { ...c, hearingDate: newDate || c.hearingDate } : c
        )
      );
  
      // Make the request to the backend
      const response = await fetch(`/api/judges/assign_date`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caseId, hearingDate: newDate }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Revert changes if the request fails
        setCases((prevCases) =>
          prevCases.map((c) =>
            c.id === caseId ? { ...c, hearingDate: c.originalHearingDate } : c
          )
        );
        alert(`Error: ${data.message || "Failed to assign a new date"}`);
      } else {
        // Display success message with the updated date
        alert(`The date has been set to ${data.updatedHearingDate || newDate}`);
      }
    } catch (error) {
      console.error("Error assigning hearing date:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Handle adding a crime to a case
  const handleAddCharge = async (investigationId, crimeId) => {
    if (!crimeId) {
      alert("Please select a charge.");
      return;
    }
  
    // Find the selected crime details
    const selectedCrime = crimes.find(crime => crime.crime_id === crimeId);
    if (!selectedCrime) {
      alert("Crime not found.");
      return;
    }
  
    try {
      const response = await fetch(`/api/judges/add_crime_to_case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ investigationId, crimeId, crimeName: selectedCrime.crime_name, lawApplicable: selectedCrime.law_applicable }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.message || "Failed to assign crime"}`);
        return;
      } else {
        alert(data.message);
      }
  
      // Optimistically update the charges in the UI
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === investigationId
            ? { ...c, charges: [...(c.charges || []), selectedCrime] }
            : c
        )
      );
    } catch (error) {
      console.error("Error assigning crime:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  

  if (!judge) {
    return <div>Loading judge details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Judge's Dashboard</h1>
        <Button onClick={handleLogOut} variant="destructive">
          Log Out
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Judge Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {judge.name}
          </p>
          <p>
            <strong>Courtroom:</strong> {judge.court}
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Assigned Cases</h2>
      <Accordion type="single" collapsible className="w-full">
        {cases.map((case_) => (
          <AccordionItem key={case_.id} value={`case-${case_.id}`}>
            <AccordionTrigger>Case #{case_.id}</AccordionTrigger>
            <AccordionContent>
              <div>
                <h3 className="font-semibold">Accused:</h3>
                <ul className="list-disc list-inside">
                {Array.isArray(case_.accused) && case_.accused.length > 0 ? (
                  case_.accused.map((criminal, index) => (
                    <li key={criminal.criminal_id || index}>{criminal.name}</li>
                  ))
                ) : (
                  <p>No accused found.</p>
                )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Evidence:</h3>
                <ul className="list-disc list-inside">
                  {Array.isArray(case_.evidence) && case_.evidence.length > 0 ? (
                    case_.evidence.map((item) => (
                      <li key={item.evidence_id}>
                        {item.evidence_type}: {item.file_path}
                      </li>
                    ))
                  ) : (
                    <p>No evidence found.</p>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Charges:</h3>
                <ul className="list-disc list-inside">
                  {Array.isArray(case_.charges) && case_.charges.length > 0 ? (
                    case_.charges.map((charge, index) => (
                      <li key={index}>
                        <strong>{charge.crime_name}</strong> - {charge.law_applicable}
                      </li>
                    ))
                  ) : (
                    <p>No charges found.</p>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Hearing Date:</h3>
                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-[240px] justify-start text-left font-normal ${
                          !case_.hearingDate ? "text-muted-foreground" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {case_.hearingDate
                          ? format(new Date(case_.hearingDate), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={case_.hearingDate ? new Date(case_.hearingDate) : null}
                        onSelect={(date) => handleDateChange(case_.id, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Add Charges:</h3>
                <Select onValueChange={setSelectedCrime} value={selectedCrime}>
                  <SelectTrigger className="w-72">
                    <SelectValue placeholder="Select a charge" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimes.map((crime) => (
                      <SelectItem key={crime.crime_id} value={crime.crime_id}>
                        {crime.crime_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleAddCharge(case_.id, selectedCrime)}
                  variant="outline"
                  className="mt-2"
                >
                  Add Crime
                </Button>
              </div>

              {/* The Guilty and Acquitted buttons, unchanged */}
              <div className="mt-4 flex space-x-4">
                <Button variant="destructive">Guilty</Button>
                <Button variant="outline">Acquitted</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
