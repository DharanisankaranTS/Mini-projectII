import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, AlertTriangle, Check } from "lucide-react";

export function SecurityStatus() {
  const { toast } = useToast();

  const handleSecurityCheck = () => {
    toast({
      title: "Security Check Initiated",
      description: "Running system health check...",
    });
    
    // Simulate security check
    setTimeout(() => {
      toast({
        title: "Security Check Complete",
        description: "All security systems operational.",
      });
    }, 2000);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-slate-900">
          Security & Privacy
        </h2>
        <Button size="sm" onClick={handleSecurityCheck}>
          System Health Check
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Security Card */}
        <Card className="shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-slate-900">
                  Data Security Status
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-900">
                    Zero-Knowledge Proofs
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-900">
                    AES-256 Encryption
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-900">
                    Elliptic Curve Cryptography
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-900">
                    HIPAA Compliance Check
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  1 Warning
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="link"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 p-0"
              >
                View Detailed Security Report →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Control Card */}
        <Card className="shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blockchain-100 rounded-md p-3">
                <Lock className="h-6 w-6 text-blockchain-600" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-slate-900">
                  Access Control
                </h3>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Recent Administrator Activity
              </h4>
              <ul className="divide-y divide-slate-200">
                <li className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-blockchain-200 flex items-center justify-center text-blockchain-700 font-medium">
                        JD
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">
                          Dr. Jane Doe
                        </p>
                        <p className="text-xs text-slate-500">
                          Modified recipient priority list
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">2 hours ago</span>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-blockchain-200 flex items-center justify-center text-blockchain-700 font-medium">
                        MS
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">
                          Dr. Michael Smith
                        </p>
                        <p className="text-xs text-slate-500">
                          Approved heart transplant match
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">5 hours ago</span>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-blockchain-200 flex items-center justify-center text-blockchain-700 font-medium">
                        AD
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">
                          System Admin
                        </p>
                        <p className="text-xs text-slate-500">
                          Updated AI matching algorithm
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">Yesterday</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <Button
                variant="link"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 p-0"
              >
                Manage Access Controls →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SecurityStatus;
