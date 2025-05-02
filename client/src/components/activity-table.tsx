import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@shared/schema";

interface ActivityTableProps {
  limit?: number;
}

export function ActivityTable({ limit = 5 }: ActivityTableProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/transactions${limit ? `?limit=${limit}` : ""}`],
  });

  // Format transaction timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get icon and icon color based on action type
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "DonorRegistration":
        return {
          bg: "bg-green-100",
          color: "text-green-600",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          ),
        };
      case "AIMatchFound":
        return {
          bg: "bg-blue-100",
          color: "text-blue-600",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ),
        };
      case "RecipientRegistration":
        return {
          bg: "bg-purple-100",
          color: "text-purple-600",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
        };
      case "DonationCancelled":
        return {
          bg: "bg-red-100",
          color: "text-red-600",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
      case "TransplantCompleted":
        return {
          bg: "bg-green-100",
          color: "text-green-600",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case "MatchApproved":
        return {
          bg: "bg-yellow-100",
          color: "text-yellow-600",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-slate-100",
          color: "text-slate-600",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  // Get status badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Format transaction hash for display
  const formatHash = (hash: string) => {
    if (hash.length > 10) {
      return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    }
    return hash;
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm overflow-hidden border border-slate-200 rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(limit)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full mr-4" />
                        <div>
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 shadow-sm border border-red-200 rounded-lg text-red-500">
        Error loading transactions. Please try again.
      </div>
    );
  }

  const transactions = data || [];

  return (
    <div className="bg-white shadow-sm overflow-hidden border border-slate-200 rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Transaction ID
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Action
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Timestamp
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: Transaction) => {
              const { bg, color, icon } = getActionIcon(transaction.actionType);
              const statusClass = getStatusBadge(transaction.status);
              const data = transaction.data as any;

              return (
                <TableRow key={transaction.id} className="hover:bg-slate-50">
                  <TableCell className="text-sm font-mono text-slate-500">
                    {formatHash(transaction.transactionHash)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full ${bg} flex items-center justify-center ${color}`}
                      >
                        {icon}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {transaction.actionType
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                        </div>
                        {data && (
                          <div className="text-sm text-slate-500">
                            {data.organType && `${data.organType}${data.bloodType ? ', ' : ''}`}
                            {data.bloodType && `Blood Type ${data.bloodType}`}
                            {data.compatibilityScore && `, ${data.compatibilityScore}% compatibility`}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {formatTimestamp(transaction.createdAt)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    <Button variant="link" className="text-primary-600 p-0 h-auto">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ActivityTable;
