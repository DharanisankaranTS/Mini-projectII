import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/web3-context";

export default function Navbar() {
  const [location] = useLocation();
  const { isConnected, connect, disconnect, account } = useWeb3();

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
              <Link href="/">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location === "/" 
                    ? "border-primary-500 text-sm font-medium" 
                    : "border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/donor-registry">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location === "/donor-registry" 
                    ? "border-primary-500 text-sm font-medium" 
                    : "border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}>
                  Donor Registry
                </a>
              </Link>
              <Link href="/recipient-registry">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location === "/recipient-registry" 
                    ? "border-primary-500 text-sm font-medium" 
                    : "border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}>
                  Recipient Registry
                </a>
              </Link>
              <Link href="/matching">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location === "/matching" 
                    ? "border-primary-500 text-sm font-medium" 
                    : "border-transparent text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}>
                  Matching
                </a>
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button type="button" className="p-1 text-slate-400 hover:text-slate-500 focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div className="ml-4 relative flex-shrink-0">
              {isConnected ? (
                <div>
                  <button
                    onClick={disconnect}
                    className="flex items-center px-3 py-1.5 border border-primary-500 rounded-full text-sm text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="font-medium">Connected</span>
                  </button>
                </div>
              ) : (
                <Button onClick={connect}>Connect Wallet</Button>
              )}
            </div>

            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button className="bg-white rounded-full flex text-sm ring-2 ring-primary-500 focus:outline-none focus:ring-offset-2 focus:ring-primary-500" id="user-menu-button">
                  <span className="sr-only">Open user menu</span>
                  <span className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-medium">AD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
