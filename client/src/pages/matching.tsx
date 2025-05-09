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
  const matches: Match[] = (fetchedMatches && fetchedMatches.length > 0) ? fetchedMatches : mockMatches;
  
  // Filter matches by status for different tabs
  const pendingMatches = matches.filter((match: Match) => match.status.toLowerCase() === "pending");
  const approvedMatches = matches.filter((match: Match) => match.status.toLowerCase() === "approved");
  const completedMatches = matches.filter((match: Match) => match.status.toLowerCase() === "completed");

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Organ Matching System</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Regional View
          </Button>
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
                  <h3 className="text-lg font-medium">Donor Information</h3>
                  <div className="rounded-lg border p-4 bg-slate-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedMatch.donor.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-medium">{selectedMatch.donor.bloodType}</p>
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
                  <h3 className="text-lg font-medium">Recipient Information</h3>
                  <div className="rounded-lg border p-4 bg-slate-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedMatch.recipient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-medium">{selectedMatch.recipient.bloodType}</p>
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

                {/* Advanced Graphical Visualization of Matching Accuracy */}
                <div className="md:col-span-2">
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
