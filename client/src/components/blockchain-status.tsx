import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function BlockchainStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blockchain/status"],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-slate-200 animate-pulse">
          <div className="h-6 w-full bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-red-200 text-red-500">
          Error loading blockchain status. Please try again.
        </div>
      </div>
    );
  }

  const status = data || {
    status: "Unknown",
    blockNumber: "N/A",
    contractAddress: "N/A",
  };

  const formattedBlockNumber = typeof status.blockNumber === 'number' 
    ? status.blockNumber.toLocaleString() 
    : status.blockNumber;

  return (
    <div className="mb-8">
      <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className={`h-3 w-3 ${status.status === "Active" ? "bg-green-500" : "bg-red-500"} rounded-full mr-2 animate-pulse`}></div>
            <span className="text-sm font-medium text-slate-500">Blockchain Status: {status.status}</span>
          </div>
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-slate-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-sm font-medium text-slate-500">Latest Block: #{formattedBlockNumber}</span>
          </div>
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-slate-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-medium text-slate-500">Smart Contract: Verified</span>
          </div>
        </div>
        <Button variant="link" size="sm" className="text-primary-600">
          View Details
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export default BlockchainStatus;
