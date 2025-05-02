import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AiMatchingStatus() {
  const { toast } = useToast();
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: matches = [], isLoading: isMatchesLoading } = useQuery({
    queryKey: ["/api/matches"],
  });

  const aiMatches = matches
    .filter((match: any) => match.aiGenerated && match.status === "Pending")
    .sort((a: any, b: any) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 3);

  const handleRunAiMatching = async () => {
    try {
      toast({
        title: "Running AI Matching",
        description: "Please wait while we run the matching algorithm...",
      });
      
      await apiRequest("POST", "/api/matches/run-ai-matching", {});
      
      toast({
        title: "AI Matching Complete",
        description: "New potential matches have been identified.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run AI matching process. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleApproveMatch = async (matchId: number, fromAddress: string) => {
    try {
      toast({
        title: "Approving Match",
        description: "Please wait while the match is being approved...",
      });
      
      await apiRequest("POST", `/api/matches/${matchId}/approve`, { fromAddress });
      
      toast({
        title: "Match Approved",
        description: "The match has been successfully approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve match. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-slate-900">
          AI/ML Matching System
        </h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blockchain-100 text-blockchain-800">
          <svg
            className="-ml-0.5 mr-1.5 h-2 w-2 text-blockchain-400"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx="4" cy="4" r="3" />
          </svg>
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Matching Card */}
        <Card className="shadow-sm border border-slate-200 col-span-1">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              Current Matching Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    AI Model Accuracy
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 inline-block" />
                    ) : (
                      `${stats?.aiMatchRate || 0}%`
                    )}
                  </span>
                </div>
                <Progress
                  value={isStatsLoading ? 0 : (stats?.aiMatchRate || 0)}
                  className="h-2 bg-slate-200"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    Batch Processing
                  </span>
                  <span className="text-sm font-medium text-slate-900">76%</span>
                </div>
                <Progress value={76} className="h-2 bg-slate-200" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    ZKP Validation
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    100%
                  </span>
                </div>
                <Progress value={100} className="h-2 bg-slate-200" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Last Model Update
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date().toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <Button size="sm" onClick={handleRunAiMatching}>
                  Run Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recent Matches */}
        <Card className="shadow-sm border border-slate-200 col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              Recent AI-Suggested Matches
            </h3>
            <div className="overflow-hidden">
              {isMatchesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="ml-4 space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-60" />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : aiMatches.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {aiMatches.map((match: any) => (
                    <li key={match.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span
                              className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                                match.compatibilityScore >= 90
                                  ? "bg-primary-100"
                                  : match.compatibilityScore >= 80
                                  ? "bg-primary-100"
                                  : "bg-yellow-100"
                              }`}
                            >
                              <span
                                className={`font-medium ${
                                  match.compatibilityScore >= 90
                                    ? "text-primary-600"
                                    : match.compatibilityScore >= 80
                                    ? "text-primary-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {match.compatibilityScore}%
                              </span>
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-slate-900">
                              {match.organType} Transplant
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-slate-500">
                                Donor:
                              </span>
                              <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                ID: {match.donor?.walletAddress.substring(0, 6)}...
                                {match.donor?.walletAddress.slice(-4)}
                              </span>
                              <span className="mx-2 text-slate-300">→</span>
                              <span className="text-xs text-slate-500">
                                Recipient:
                              </span>
                              <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                ID: {match.recipient?.walletAddress.substring(0, 6)}...
                                {match.recipient?.walletAddress.slice(-4)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-700 hover:bg-green-50"
                            onClick={() => handleApproveMatch(match.id, match.donor.walletAddress)}
                          >
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-slate-500">No AI-suggested matches currently.</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                View All Matches
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AiMatchingStatus;
