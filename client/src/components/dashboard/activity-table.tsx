import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  PlusCircle, 
  Eye, 
  XCircle, 
  CheckCircle, 
  ClipboardList 
} from "lucide-react";

type Transaction = {
  id: number;
  txHash: string;
  type: string;
  details: {
    organType: string;
    bloodType: string;
    compatibility?: number;
  };
  timestamp: string;
  status: string;
};

type ActivityTableProps = {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
};

export default function ActivityTable({ transactions, isLoading }: ActivityTableProps) {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'new_donor_registration':
        return (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <PlusCircle className="h-4 w-4 text-green-600" />
          </div>
        );
      case 'ai_match_found':
        return (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
        );
      case 'recipient_registration':
        return (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <ClipboardList className="h-4 w-4 text-purple-600" />
          </div>
        );
      case 'donation_cancelled':
        return (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
        );
      case 'transplant_completed':
        return (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
            <ClipboardList className="h-4 w-4 text-slate-600" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case 'pending_approval':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending Approval
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      case 'success':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Success
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'new_donor_registration':
        return 'New Donor Registration';
      case 'ai_match_found':
        return 'AI Match Found';
      case 'recipient_registration':
        return 'Recipient Registration';
      case 'donation_cancelled':
        return 'Donation Cancelled';
      case 'transplant_completed':
        return 'Transplant Completed';
      default:
        return type;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-slate-900">Recent Activity</h2>
        <Button variant="outline">View All</Button>
      </div>

      {/* Activity Table */}
      <div className="bg-white shadow-sm overflow-hidden border border-slate-200 rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : transactions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions?.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-sm text-slate-500">
                      {transaction.txHash.substring(0, 6)}...{transaction.txHash.substring(transaction.txHash.length - 4)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getTypeIcon(transaction.type)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {getTypeLabel(transaction.type)}
                          </div>
                          <div className="text-sm text-slate-500">
                            {transaction.details.organType && transaction.details.bloodType && `${transaction.details.organType}, Blood Type ${transaction.details.bloodType}`}
                            {transaction.details.compatibility && `, ${transaction.details.compatibility}% compatibility`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">
                      {transaction.timestamp}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              
              {/* Default example transactions if none are provided */}
              {!isLoading && !transactions && (
                <>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="font-mono text-sm text-slate-500">0x3a2e...8f91</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <PlusCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">New Donor Registration</div>
                          <div className="text-sm text-slate-500">Kidney, Blood Type B+</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">2023-08-15 14:23:09</TableCell>
                    <TableCell>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="font-mono text-sm text-slate-500">0x7c1d...3e42</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">AI Match Found</div>
                          <div className="text-sm text-slate-500">Heart, 92.5% compatibility</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">2023-08-15 12:48:33</TableCell>
                    <TableCell>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Approval</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-900">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
