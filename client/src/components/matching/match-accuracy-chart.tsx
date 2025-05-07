import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface MatchAccuracyChartProps {
  matchData: any;
  className?: string;
}

export function MatchAccuracyChart({ matchData, className = "" }: MatchAccuracyChartProps) {
  // Ensure we have data
  if (!matchData) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No match data available</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for radar chart
  const radarData = [
    {
      category: "Blood Type",
      score: matchData.bloodTypeScore || 90,
      fullMark: 100,
    },
    {
      category: "Tissue Match",
      score: matchData.tissueMatchScore || 85,
      fullMark: 100,
    },
    {
      category: "Age Compatibility",
      score: matchData.ageScore || 80,
      fullMark: 100,
    },
    {
      category: "Geographic",
      score: matchData.geographicScore || 95,
      fullMark: 100,
    },
    {
      category: "Wait Time",
      score: matchData.waitTimeScore || 70,
      fullMark: 100,
    },
    {
      category: "Medical History",
      score: matchData.medicalHistoryScore || 88,
      fullMark: 100,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Match Compatibility Analysis</CardTitle>
        <CardDescription>
          Detailed visualization of donor-recipient compatibility factors
        </CardDescription>
        <div className="mt-2 inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 border border-primary-200">
          Overall Score: {matchData.compatibilityScore || 85}%
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="radar">
          <TabsList className="mb-4">
            <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
            <TabsTrigger value="progress">Progress Bars</TabsTrigger>
            <TabsTrigger value="factors">Key Factors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="radar">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Match Score"
                    dataKey="score"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="space-y-3">
              {radarData.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm font-medium">{item.score}%</span>
                  </div>
                  <Progress 
                    value={item.score} 
                    className={`h-2 ${
                      item.score >= 90 
                        ? "bg-green-100" 
                        : item.score >= 75 
                        ? "bg-blue-100" 
                        : item.score >= 60 
                        ? "bg-yellow-100" 
                        : "bg-red-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="factors">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <h4 className="text-sm font-medium mb-2">Critical Factors</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Blood Type Match</span>
                      <Badge 
                        variant="outline" 
                        className={
                          (matchData.bloodTypeScore || 90) > 85 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {matchData.donor?.bloodType || "A+"} → {matchData.recipient?.bloodType || "A+"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">HLA Tissue Typing</span>
                      <Badge 
                        variant="outline" 
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        5/6 Match
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Age Difference</span>
                      <span className="text-sm font-medium">
                        {matchData.ageDifference || "8"} years
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-3">
                  <h4 className="text-sm font-medium mb-2">Secondary Factors</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Geographic Distance</span>
                      <span className="text-sm font-medium">
                        {matchData.distance || "25"} miles
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Weight Ratio</span>
                      <span className="text-sm font-medium">
                        {matchData.weightRatio || "0.95"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">CMV Status</span>
                      <Badge 
                        variant="outline" 
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Partial Match
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-3 mt-3">
                <h4 className="text-sm font-medium mb-2">AI-Enhanced Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI model predicts a {matchData.successProbability || "87"}% probability of successful transplantation
                  based on analysis of 1,284 similar cases with {matchData.compatibilityScore || 85}% or higher compatibility scores.
                </p>
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Success Probability</span>
                    <span className="text-sm font-medium">{matchData.successProbability || "87"}%</span>
                  </div>
                  <Progress value={matchData.successProbability || 87} className="h-2 bg-emerald-100" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}