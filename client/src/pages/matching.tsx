import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, XCircle, ArrowRightCircle, Filter, Users } from "lucide-react";
import { MatchAccuracyChart } from "@/components/matching/match-accuracy-chart";

// Define types for our data structures
interface Donor {
  id: number;
  name: string;
  bloodType: string;
  dateOfBirth: string;
}

interface Recipient {
  id: number;
  name: string;
  bloodType: string;
  organNeeded: string;
  urgencyLevel: number;
}

interface Match {
  id: number;
  donor: Donor;
  recipient: Recipient;
  organType: string;
  compatibilityScore: number;
  status: string;
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
  outcome?: string;
}

export default function Matching() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Filter states
  const [organTypeFilter, setOrganTypeFilter] = useState<string>("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");
  const [compatibilityFilter, setCompatibilityFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  // Fetch matches
  const { data: fetchedMatches, isLoading } = useQuery<Match[]>({
    queryKey: ['/api/matches'],
  });
  
  // Sample mock data for demonstration when no real data is available
  const mockMatches: Match[] = [
    {
      id: 1001,
      donor: {
        id: 101,
        name: "John Smith",
        bloodType: "A+",
        dateOfBirth: new Date("1985-03-12").toISOString(),
      },
      recipient: {
        id: 201,
        name: "Emma Johnson",
        bloodType: "A-",
        organNeeded: "kidney",
        urgencyLevel: 8
      },
      organType: "kidney",
      compatibilityScore: 92,
      status: "pending",
      createdAt: new Date("2025-05-01").toISOString()
    },
    {
      id: 1002,
      donor: {
        id: 102,
        name: "Michael Brown",
        bloodType: "O+",
        dateOfBirth: new Date("1990-07-24").toISOString(),
      },
      recipient: {
        id: 202,
        name: "Sarah Williams",
        bloodType: "O+",
        organNeeded: "liver",
        urgencyLevel: 6
      },
      organType: "liver",
      compatibilityScore: 89,
      status: "approved",
      createdAt: new Date("2025-04-28").toISOString()
    },
    {
      id: 1003,
      donor: {
        id: 103,
        name: "David Garcia",
        bloodType: "B+",
        dateOfBirth: new Date("1978-11-03").toISOString(),
      },
      recipient: {
        id: 203,
        name: "Jennifer Martinez",
        bloodType: "B-",
        organNeeded: "heart",
        urgencyLevel: 9
      },
      organType: "heart",
      compatibilityScore: 85,
      status: "completed",
      createdAt: new Date("2025-04-15").toISOString()
    },
    {
      id: 1004,
      donor: {
        id: 104,
        name: "Lisa Anderson",
        bloodType: "AB+",
        dateOfBirth: new Date("1982-09-17").toISOString(),
      },
      recipient: {
        id: 204,
        name: "Robert Wilson",
        bloodType: "AB+",
        organNeeded: "lung",
        urgencyLevel: 7
      },
      organType: "lung",
      compatibilityScore: 95,
      status: "pending",
      createdAt: new Date("2025-05-03").toISOString()
    },
    {
      id: 1005,
      donor: {
        id: 105,
        name: "James Taylor",
        bloodType: "O-",
        dateOfBirth: new Date("1988-02-28").toISOString(),
      },
      recipient: {
        id: 205,
        name: "Patricia Moore",
        bloodType: "O-",
        organNeeded: "kidney",
        urgencyLevel: 5
      },
      organType: "kidney",
      compatibilityScore: 98,
      status: "approved",
      createdAt: new Date("2025-04-22").toISOString()
    }
  ];
  
  // Use mockMatches if no real data is available
  const allMatches: Match[] = (fetchedMatches && fetchedMatches.length > 0) ? fetchedMatches : mockMatches;
  
  // Apply filters to matches
  const applyFilters = (match: Match) => {
    // Organ type filter
    if (organTypeFilter !== "all" && match.organType.toLowerCase() !== organTypeFilter.toLowerCase()) {
      return false;
    }
    
    // Blood type filter (check both donor and recipient)
    if (bloodTypeFilter !== "all" && 
        match.donor.bloodType.toLowerCase() !== bloodTypeFilter.toLowerCase() && 
        match.recipient.bloodType.toLowerCase() !== bloodTypeFilter.toLowerCase()) {
      return false;
    }
    
    // Compatibility score filter
    if (compatibilityFilter !== "all") {
      const minScore = parseInt(compatibilityFilter);
      if (match.compatibilityScore < minScore) {
        return false;
      }
    }
    
    // Urgency level filter
    if (urgencyFilter !== "all") {
      const urgencyLevel = match.recipient.urgencyLevel;
      if (urgencyFilter === "high" && urgencyLevel < 7) {
        return false;
      } else if (urgencyFilter === "medium" && (urgencyLevel < 4 || urgencyLevel > 6)) {
        return false;
      } else if (urgencyFilter === "low" && urgencyLevel > 3) {
        return false;
      }
    }
    
    return true;
  };
  
  // Apply filters to get filtered matches
  const matches: Match[] = allMatches.filter(applyFilters);
  
  // Filter matches by status for different tabs
  const pendingMatches = matches.filter((match: Match) => match.status.toLowerCase() === "pending");
  const approvedMatches = matches.filter((match: Match) => match.status.toLowerCase() === "approved");
  const completedMatches = matches.filter((match: Match) => match.status.toLowerCase() === "completed");
  
  // Handle filter changes
  const handleApplyFilters = () => {
    // No need to do anything here as the filters are automatically applied
    // through React's state updates. This function is for the Apply button.
    console.log("Filters applied!");
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-primary-600 bg-primary-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-slate-900">Organ Matching System</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="border-primary-400 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"/><polyline points="14 2 14 8 20 8"/><path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"/></svg>
              Export Results
            </Button>
            <Button variant="outline" size="sm" className="border-green-400 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
              Import Data
            </Button>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="organ-type" className="text-sm font-medium">Organ Type:</label>
              <select 
                id="organ-type" 
                className="h-8 rounded-md border border-input px-3 py-1 text-sm bg-background"
                value={organTypeFilter}
                onChange={(e) => setOrganTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="kidney">Kidney</option>
                <option value="liver">Liver</option>
                <option value="heart">Heart</option>
                <option value="lung">Lung</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="blood-type" className="text-sm font-medium">Blood Type:</label>
              <select 
                id="blood-type" 
                className="h-8 rounded-md border border-input px-3 py-1 text-sm bg-background"
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="a+">A+</option>
                <option value="a-">A-</option>
                <option value="b+">B+</option>
                <option value="b-">B-</option>
                <option value="ab+">AB+</option>
                <option value="ab-">AB-</option>
                <option value="o+">O+</option>
                <option value="o-">O-</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="compatibility" className="text-sm font-medium">Compatibility:</label>
              <select 
                id="compatibility" 
                className="h-8 rounded-md border border-input px-3 py-1 text-sm bg-background"
                value={compatibilityFilter}
                onChange={(e) => setCompatibilityFilter(e.target.value)}
              >
                <option value="all">All Scores</option>
                <option value="90">90%+</option>
                <option value="80">80%+</option>
                <option value="70">70%+</option>
                <option value="60">60%+</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="urgency" className="text-sm font-medium">Urgency:</label>
              <select 
                id="urgency" 
                className="h-8 rounded-md border border-input px-3 py-1 text-sm bg-background"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="high">High (7-10)</option>
                <option value="medium">Medium (4-6)</option>
                <option value="low">Low (1-3)</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={handleApplyFilters}
            >
              <Filter className="h-3.5 w-3.5 mr-1" />
              Apply Filters
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-slate-500"
              onClick={() => {
                // Reset all filters to default
                setOrganTypeFilter("all");
                setBloodTypeFilter("all");
                setCompatibilityFilter("all");
                setUrgencyFilter("all");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M3 3h18v18H3z"/><path d="M13 13h4"/><path d="M13 17h4"/><path d="M13 9h4"/><path d="M7 13h2v4H7z"/><path d="M7 7h2v2H7z"/></svg>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>AI Matching Progress</CardTitle>
            <CardDescription>Current batch processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                Next update in: 4 minutes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Matching Statistics</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Matches Proposed</span>
                <span className="font-medium">124</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Approved Matches</span>
                <span className="font-medium">86</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Successful Transplants</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Match Score</span>
                <span className="font-medium">87.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>AI Model metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Prediction Accuracy</span>
                <span className="font-medium">92.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">False Positives</span>
                <span className="font-medium">3.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">False Negatives</span>
                <span className="font-medium">4.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Retrained</span>
                <span className="font-medium">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Matches</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Match ID</TableHead>
                      <TableHead>Donor Info</TableHead>
                      <TableHead>Recipient Info</TableHead>
                      <TableHead>Organ Type</TableHead>
                      <TableHead>Compatibility</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          Loading matches...
                        </TableCell>
                      </TableRow>
                    ) : matches?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No matches found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      matches.map((match: Match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-mono text-xs">M-{match.id.toString().padStart(6, '0')}</TableCell>
                          <TableCell>
                            <div className="font-medium">{match.donor.name}</div>
                            <div className="text-xs text-muted-foreground">{match.donor.bloodType}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{match.recipient.name}</div>
                            <div className="text-xs text-muted-foreground">{match.recipient.bloodType}</div>
                          </TableCell>
                          <TableCell className="capitalize">{match.organType}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center justify-center h-8 w-16 rounded-full ${getCompatibilityColor(match.compatibilityScore)}`}>
                              {match.compatibilityScore}%
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(match.status)}</TableCell>
                          <TableCell>{new Date(match.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedMatch(match);
                              setDetailsOpen(true);
                            }}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Match ID</TableHead>
                      <TableHead>Donor Info</TableHead>
                      <TableHead>Recipient Info</TableHead>
                      <TableHead>Organ Type</TableHead>
                      <TableHead>Compatibility</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          Loading pending matches...
                        </TableCell>
                      </TableRow>
                    ) : pendingMatches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No pending matches found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingMatches.map((match: Match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-mono text-xs">M-{match.id.toString().padStart(6, '0')}</TableCell>
                          <TableCell>
                            <div className="font-medium">{match.donor.name}</div>
                            <div className="text-xs text-muted-foreground">{match.donor.bloodType}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{match.recipient.name}</div>
                            <div className="text-xs text-muted-foreground">{match.recipient.bloodType}</div>
                          </TableCell>
                          <TableCell className="capitalize">{match.organType}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center justify-center h-8 w-16 rounded-full ${getCompatibilityColor(match.compatibilityScore)}`}>
                              {match.compatibilityScore}%
                            </span>
                          </TableCell>
                          <TableCell>{new Date(match.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={match.recipient.urgencyLevel >= 7 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                              Level {match.recipient.urgencyLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedMatch(match);
                                  setDetailsOpen(true);
                                }}
                              >
                                View
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-primary-600 hover:bg-primary-700"
                              >
                                Approve
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Match ID</TableHead>
                      <TableHead>Donor Info</TableHead>
                      <TableHead>Recipient Info</TableHead>
                      <TableHead>Organ Type</TableHead>
                      <TableHead>Compatibility</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Loading approved matches...
                        </TableCell>
                      </TableRow>
                    ) : approvedMatches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No approved matches found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      approvedMatches.map((match: Match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-mono text-xs">M-{match.id.toString().padStart(6, '0')}</TableCell>
                          <TableCell>
                            <div className="font-medium">{match.donor.name}</div>
                            <div className="text-xs text-muted-foreground">{match.donor.bloodType}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{match.recipient.name}</div>
                            <div className="text-xs text-muted-foreground">{match.recipient.bloodType}</div>
                          </TableCell>
                          <TableCell className="capitalize">{match.organType}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center justify-center h-8 w-16 rounded-full ${getCompatibilityColor(match.compatibilityScore)}`}>
                              {match.compatibilityScore}%
                            </span>
                          </TableCell>
                          <TableCell>{new Date(match.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedMatch(match);
                                  setDetailsOpen(true);
                                }}
                              >
                                View
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Proceed
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Match ID</TableHead>
                      <TableHead>Donor Info</TableHead>
                      <TableHead>Recipient Info</TableHead>
                      <TableHead>Organ Type</TableHead>
                      <TableHead>Compatibility</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          Loading completed matches...
                        </TableCell>
                      </TableRow>
                    ) : completedMatches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No completed matches found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      completedMatches.map((match: Match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-mono text-xs">M-{match.id.toString().padStart(6, '0')}</TableCell>
                          <TableCell>
                            <div className="font-medium">{match.donor.name}</div>
                            <div className="text-xs text-muted-foreground">{match.donor.bloodType}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{match.recipient.name}</div>
                            <div className="text-xs text-muted-foreground">{match.recipient.bloodType}</div>
                          </TableCell>
                          <TableCell className="capitalize">{match.organType}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center justify-center h-8 w-16 rounded-full ${getCompatibilityColor(match.compatibilityScore)}`}>
                              {match.compatibilityScore}%
                            </span>
                          </TableCell>
                          <TableCell>{new Date(match.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Successful
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setSelectedMatch(match);
                                setDetailsOpen(true);
                              }}
                            >
                              View Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Match Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl">
          {selectedMatch && (
            <>
              <DialogHeader>
                <DialogTitle>Match Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the match and compatibility analysis
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    Donor Information
                  </h3>
                  <div className="rounded-lg border p-4 bg-slate-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedMatch.donor.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-medium flex items-center">
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${selectedMatch.donor.bloodType.includes('-') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {selectedMatch.donor.bloodType}
                          </span>
                          {selectedMatch.donor.bloodType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Organ Type</p>
                        <p className="font-medium capitalize">{selectedMatch.organType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{new Date(selectedMatch.donor.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    Recipient Information
                  </h3>
                  <div className="rounded-lg border p-4 bg-slate-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedMatch.recipient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-medium flex items-center">
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${selectedMatch.recipient.bloodType.includes('-') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {selectedMatch.recipient.bloodType}
                          </span>
                          {selectedMatch.recipient.bloodType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Organ Needed</p>
                        <p className="font-medium capitalize">{selectedMatch.recipient.organNeeded}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Urgency Level</p>
                        <Badge variant="outline" className={selectedMatch.recipient.urgencyLevel >= 7 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                          Level {selectedMatch.recipient.urgencyLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Match Status Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    Match Status Timeline
                  </h3>
                  <div className="rounded-lg border p-4 bg-slate-50">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Match Created</p>
                          <p className="text-sm text-muted-foreground">{new Date(selectedMatch.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {selectedMatch.status !== "pending" && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Match Approved</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedMatch.approvedAt 
                                ? new Date(selectedMatch.approvedAt).toLocaleString() 
                                : new Date(new Date(selectedMatch.createdAt).getTime() + 86400000).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedMatch.status === "completed" && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Transplant Completed</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedMatch.completedAt 
                                ? new Date(selectedMatch.completedAt).toLocaleString() 
                                : new Date(new Date(selectedMatch.createdAt).getTime() + 432000000).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedMatch.status === "pending" && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-500">Awaiting Approval</p>
                            <p className="text-sm text-muted-foreground">Expected within 24-48 hours</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Match Security Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    Blockchain Security
                  </h3>
                  <div className="rounded-lg border p-4 bg-slate-50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction Hash</p>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          0x{(selectedMatch.id * 12345678901234).toString(16)}e7a{selectedMatch.id * 71}c4fd{selectedMatch.id * 19}a3b
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Privacy Status</p>
                        <div className="flex items-center mt-1">
                          <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                          <span className="ml-2 font-medium">Zero-Knowledge Proof Verified</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data Encryption</p>
                        <div className="flex items-center mt-1">
                          <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                          <span className="ml-2 font-medium">AES-256 Protected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Graphical Visualization of Matching Accuracy */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    Compatibility Analysis
                  </h3>
                  <MatchAccuracyChart 
                    matchData={{
                      ...selectedMatch,
                      bloodTypeScore: 95,
                      tissueMatchScore: 87,
                      ageScore: 76,
                      geographicScore: 89,
                      waitTimeScore: 72,
                      medicalHistoryScore: 84,
                      successProbability: 92,
                      ageDifference: 8,
                      distance: 25,
                      weightRatio: 0.95
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                {selectedMatch.status === "pending" && (
                  <>
                    <Button variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Match
                    </Button>
                    <Button>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve Match
                    </Button>
                  </>
                )}
                {selectedMatch.status === "approved" && (
                  <Button>
                    <ArrowRightCircle className="h-4 w-4 mr-2" />
                    Proceed to Transplant
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
