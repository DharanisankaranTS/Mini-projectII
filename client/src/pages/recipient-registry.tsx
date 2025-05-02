import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RecipientForm from "@/components/forms/recipient-form";
import { UserPlus, FileText, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function RecipientRegistry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch recipients list
  const { data: recipients, isLoading } = useQuery({
    queryKey: ['/api/recipients'],
  });

  const filteredRecipients = recipients?.filter((recipient: any) => {
    if (!searchTerm) return true;
    return (
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.organNeeded.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Helper function to get urgency level color
  const getUrgencyColor = (level: number) => {
    if (level >= 8) return "bg-red-100 text-red-800";
    if (level >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "matched":
        return "bg-green-100 text-green-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Recipient Registry</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Register New Recipient
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Attention</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                All recipient data is stored encrypted on the blockchain. Medical personnel with appropriate permissions can access and view this information. Please ensure all submitted information is accurate.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="waiting" className="mb-6">
        <TabsList>
          <TabsTrigger value="waiting">Waiting List</TabsTrigger>
          <TabsTrigger value="matched">Matched Recipients</TabsTrigger>
          <TabsTrigger value="all">All Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="waiting" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recipients..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-1 h-4 w-4" />
                  {filteredRecipients?.length || 0} recipients found
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Organ Needed</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Urgency Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Loading recipients...
                        </TableCell>
                      </TableRow>
                    ) : filteredRecipients?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No recipients found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecipients?.map((recipient: any) => (
                        <TableRow key={recipient.id}>
                          <TableCell className="font-medium">{recipient.name}</TableCell>
                          <TableCell className="capitalize">{recipient.organNeeded}</TableCell>
                          <TableCell>{recipient.bloodType}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getUrgencyColor(recipient.urgencyLevel)}>
                              Level {recipient.urgencyLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipient.status)}`}>
                              {recipient.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(recipient.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
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

        <TabsContent value="matched" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10 text-muted-foreground">
                Loading matched recipients...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10 text-muted-foreground">
                Loading all recipient records...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isFormOpen && (
        <RecipientForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
