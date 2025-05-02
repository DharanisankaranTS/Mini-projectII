import { useQuery } from "@tanstack/react-query";
import BlockchainStatus from "@/components/dashboard/blockchain-status";
import StatCard from "@/components/dashboard/stat-card";
import ChartCard from "@/components/dashboard/chart-card";
import ActivityTable from "@/components/dashboard/activity-table";
import MatchingStatus from "@/components/dashboard/matching-status";
import AiMatches from "@/components/dashboard/ai-matches";
import SecurityCard from "@/components/dashboard/security-card";

export default function Dashboard() {
  // Get system statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/statistics'],
  });

  // Get recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions/recent'],
  });

  // Get AI matches
  const { data: aiMatches, isLoading: aiMatchesLoading } = useQuery({
    queryKey: ['/api/matches/ai-suggested'],
  });

  const aiModel = {
    accuracy: "93.7%",
    batchProcessing: "76%",
    zkpValidation: "100%",
    lastUpdate: "August 14, 2023 at 09:32 AM"
  };

  const securityStatus = {
    zkp: "active",
    aes: "active",
    ecc: "active",
    hipaa: "warning",
    admins: [
      { initials: "JD", name: "Dr. Jane Doe", action: "Modified recipient priority list", time: "2 hours ago" },
      { initials: "MS", name: "Dr. Michael Smith", action: "Approved heart transplant match", time: "5 hours ago" },
      { initials: "AD", name: "System Admin", action: "Updated AI matching algorithm", time: "Yesterday" }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Blockchain Status */}
      <BlockchainStatus />

      {/* Dashboard Overview Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-6">System Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Donors"
            value={statsLoading ? "Loading..." : stats?.totalDonors.toString() || "0"}
            icon="user"
            color="primary"
            trend={8.2}
            trendLabel="vs last month"
          />
          
          <StatCard 
            title="Pending Requests"
            value={statsLoading ? "Loading..." : stats?.pendingRequests.toString() || "0"}
            icon="file"
            color="secondary"
            trend={-4.1}
            trendLabel="vs last month"
          />
          
          <StatCard 
            title="Successful Matches"
            value={statsLoading ? "Loading..." : stats?.successfulMatches.toString() || "0"}
            icon="check-circle"
            color="green"
            trend={12.3}
            trendLabel="vs last month"
          />
          
          <StatCard 
            title="AI Match Rate"
            value={statsLoading ? "Loading..." : `${stats?.aiMatchRate.toFixed(1)}%` || "0%"}
            icon="sliders-horizontal"
            color="blockchain"
            trend={3.2}
            trendLabel="vs last month"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard 
            title="Donations by Organ Type"
            type="bar"
            filter="Last 12 months"
            data={statsLoading ? null : stats?.organTypeDistribution}
          />
          
          <ChartCard 
            title="Regional Distribution"
            type="doughnut"
            filter="All Regions"
            data={statsLoading ? null : stats?.regionalDistribution}
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <ActivityTable transactions={transactions} isLoading={transactionsLoading} />

      {/* Matching System Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-slate-900">AI/ML Matching System</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blockchain-100 text-blockchain-800">
            <span className="-ml-0.5 mr-1.5 h-2 w-2 rounded-full bg-blockchain-400"></span>
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MatchingStatus data={aiModel} />
          </div>
          
          <div className="lg:col-span-2">
            <AiMatches matches={aiMatches} isLoading={aiMatchesLoading} />
          </div>
        </div>
      </div>

      {/* Security & Privacy Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-slate-900">Security & Privacy</h2>
          <button className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            System Health Check
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SecurityCard type="dataSecurity" data={securityStatus} />
          <SecurityCard type="accessControl" data={securityStatus} />
        </div>
      </div>
    </div>
  );
}
