import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/web3-context";
import { Bell } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  
  // Access the Web3 context 
  const { isConnected, connect, disconnect, account } = useWeb3();
  console.log("Web3 context values in Navbar:", { isConnected, account });
  
  // Direct connect function for debugging
  const handleConnect = async () => {
    console.log("Connect button clicked");
    try {
      await connect();
      console.log("Connect function completed successfully");
    } catch (err) {
      console.error("Connect function failed:", err);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-2 text-xl font-heading font-semibold text-primary-700">OrganChain</span>
              </div>
            </div>
            <nav className="ml-8 flex space-x-8">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/donor-registry", label: "Donor Registry" },
                { href: "/recipient-registry", label: "Recipient Registry" },
                { href: "/matching", label: "Matching" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === item.href
                      ? "border-primary-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-500"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </Button>

            <div className="ml-4 relative flex-shrink-0">
              {isConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="flex items-center border border-primary-500 rounded-full text-primary-600 bg-white hover:bg-primary-50"
                >
                  <svg
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span className="font-medium">Connected</span>
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleConnect}
                  className="flex items-center rounded-full bg-primary-600 text-white hover:bg-primary-700"
                >
                  <svg
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span className="font-medium">Connect Wallet</span>
                </Button>
              )}
            </div>

            <div className="ml-4 relative flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-medium">
                {account ? account.substring(0, 2) : "UC"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
