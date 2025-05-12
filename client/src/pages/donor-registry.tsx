import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DonorForm from "@/components/forms/donor-form";
import { UserPlus, FileText, Search, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ImportDialog } from "@/components/import-dialog";
import { ExportDialog } from "@/components/export-dialog";

export default function DonorRegistry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch donors list
  const { data: donors, isLoading } = useQuery({
    queryKey: ['/api/donors'],
  });
  
  // For refreshing data after import
  const handleImportSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/donors'] });
  };

  const filteredDonors = donors?.filter((donor: any) => {
    if (!searchTerm) return true;
    return (
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.organType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Donor Registry</h1>
        <div className="flex items-center gap-2">
          <ImportDialog onImportSuccess={handleImportSuccess} />
          <ExportDialog donors={donors || []} />
          <Button onClick={() => setIsFormOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Donor
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active Donors</TabsTrigger>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="all">All Donors</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search donors..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-1 h-4 w-4" />
                  {filteredDonors?.length || 0} donors found
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Organ Type</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Loading donors...
                        </TableCell>
                      </TableRow>
                    ) : filteredDonors?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No donors found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDonors?.map((donor: any) => (
                        <TableRow key={donor.id}>
                          <TableCell className="font-medium">{donor.name}</TableCell>
                          <TableCell className="capitalize">{donor.organType}</TableCell>
                          <TableCell>{donor.bloodType}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {donor.walletAddress.substring(0, 6)}...{donor.walletAddress.substring(38)}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {donor.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(donor.createdAt).toLocaleDateString()}
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

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10 text-muted-foreground">
                No pending verifications at this time.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10 text-muted-foreground">
                Loading all donor records...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isFormOpen && (
        <DonorForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
