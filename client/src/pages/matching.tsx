import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, XCircle, ArrowRightCircle, Filter, Users } from "lucide-react";

export default function Matching() {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch matches
  const { data: matches, isLoading } = useQuery({
    queryKey: ['/api/matches'],
  });

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
                      matches?.map((match: any) => (
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
              <div className="text-center py-10 text-muted-foreground">
                Loading pending matches...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10 text-muted-foreground">
                Loading approved matches...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10 text-muted-foreground">
                Loading completed matches...
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

                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium">Compatibility Analysis</h3>
                  <div className="rounded-lg border p-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Overall Compatibility</span>
                          <span className="text-sm font-medium">{selectedMatch.compatibilityScore}%</span>
                        </div>
                        <Progress value={selectedMatch.compatibilityScore} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Blood Compatibility</span>
                            <span>95%</span>
                          </div>
                          <Progress value={95} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Tissue Matching</span>
                            <span>87%</span>
                          </div>
                          <Progress value={87} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Age Factors</span>
                            <span>76%</span>
                          </div>
                          <Progress value={76} className="h-1.5" />
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <h4 className="text-sm font-medium mb-2">AI Analysis Notes</h4>
                        <p className="text-sm text-muted-foreground">
                          This match shows high compatibility in primary factors. Blood type is a direct match, and tissue cross-matching indicates minimal rejection risk. Geographic proximity is optimal (same region). The AI model gives this match a high success probability based on historical outcomes of similar profiles.
                        </p>
                      </div>
                    </div>
                  </div>
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
