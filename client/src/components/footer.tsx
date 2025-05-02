import React from "react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-primary-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 8L12 12L20 8L12 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12L12 16L20 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16L12 20L20 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 text-sm font-medium text-slate-500">
              OrganChain - Blockchain Organ Donation System
            </span>
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <span>Smart Contract: 0x72F8Fc3d1289e7325gA82F0f24eB38B203b53f2D</span>
            <span className="mx-2">•</span>
            <span>Block: #1,284,421</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
