"use client"
{/*
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Select, {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Calendar from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'

// Mock data for demonstration
const mockJudge = {
  id: 1,
  name: "Judge John Doe",
  courtroom: "Supreme Court",
  yearsOfExperience: 15,
}

const mockCases = [
  {
    id: 1,
    title: "State vs. Smith",
    criminals: [{ id: 1, name: "John Smith" }],
    hearingDate: new Date("2023-07-15"),
    evidence: [
      { id: 1, type: "Document", description: "Witness Statement" },
      { id: 2, type: "Image", description: "Crime Scene Photo" },
    ],
    charges: ["Theft", "Assault"],
  },
  {
    id: 2,
    title: "State vs. Johnson et al.",
    criminals: [
      { id: 2, name: "Sarah Johnson" },
      { id: 3, name: "Mike Williams" },
    ],
    hearingDate: new Date("2023-07-20"),
    evidence: [
      { id: 3, type: "Document", description: "Financial Records" },
      { id: 4, type: "Document", description: "Email Correspondence" },
    ],
    charges: ["Fraud", "Money Laundering"],
  },
]

export default function JudgesPage() {
  const [judge] = useState(mockJudge)
  const [cases, setCases] = useState(mockCases)
  const router = useRouter()

  const handleLogOut = () => {
    router.push("/login")
  }

  const handleDateChange = (caseId, newDate) => {
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseId ? { ...c, hearingDate: newDate || c.hearingDate } : c
      )
    )
  }

  const handleVerdict = (caseId, verdict) => {
    // In a real application, you would send this to your backend
    alert(`Case ${caseId} verdict: ${verdict}`)
  }

  const handleAddCharge = (caseId, charge) => {
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseId
          ? { ...c, charges: [...c.charges, charge] }
          : c
      )
    )
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
          <p><strong>Name:</strong> {judge.name}</p>
          <p><strong>Courtroom:</strong> {judge.courtroom}</p>
          <p><strong>Years of Experience:</strong> {judge.yearsOfExperience}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Assigned Cases</h2>
      <Accordion type="single" collapsible className="w-full">
        {cases.map((case_) => (
          <AccordionItem key={case_.id} value={`case-${case_.id}`}>
            <AccordionTrigger>{case_.title}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Accused:</h3>
                  <ul className="list-disc list-inside">
                    {case_.criminals.map((criminal) => (
                      <li key={criminal.id}>{criminal.name}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Hearing Date:</h3>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-[240px] justify-start text-left font-normal ${!case_.hearingDate ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {case_.hearingDate ? format(case_.hearingDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={case_.hearingDate}
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
                    {case_.evidence.map((item) => (
                      <li key={item.id}>
                        {item.type}: {item.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Charges:</h3>
                  <ul className="list-disc list-inside">
                    {case_.charges.map((charge, index) => (
                      <li key={index}>{charge}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Verdict:</h3>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleVerdict(case_.id, "guilty")} variant="destructive">
                      Guilty
                    </Button>
                    <Button onClick={() => handleVerdict(case_.id, "acquitted")} variant="secondary">
                      Acquitted
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Add Charge:</h3>
                  <div className="flex space-x-2">
                    <Select onValueChange={(value) => handleAddCharge(case_.id, value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select charge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theft">Theft</SelectItem>
                        <SelectItem value="Assault">Assault</SelectItem>
                        <SelectItem value="Fraud">Fraud</SelectItem>
                        <SelectItem value="Murder">Murder</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleAddCharge(case_.id, "Custom Charge")}>
                      Add Custom Charge
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
*/}
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
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseId ? { ...c, hearingDate: newDate || c.hearingDate } : c
      )
    );

    await fetch(`/api/cases/assign_hearing_date`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ caseId, hearingDate: newDate }),
    });
  };

  const handleVerdict = async (caseId, verdict) => {
    await fetch(`/api/cases/assign_verdict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ caseId, verdict }),
    });

    alert(`Case ${caseId} verdict: ${verdict}`);
  };

  const handleAddCharge = async (caseId, charge) => {
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseId ? { ...c, charges: [...(c.charges || []), charge] } : c
      )
    );

    await fetch(`/api/cases/add_charge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ caseId, charge }),
    });
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
                    onValueChange={(value) => handleAddCharge(case_.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select charge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Theft">Theft</SelectItem>
                      <SelectItem value="Assault">Assault</SelectItem>
                      <SelectItem value="Fraud">Fraud</SelectItem>
                      <SelectItem value="Murder">Murder</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => handleAddCharge(case_.id, "Custom Charge")}>
                    Add Custom Charge
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
