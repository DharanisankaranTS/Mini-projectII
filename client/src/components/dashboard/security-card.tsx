import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type SecurityCardProps = {
  type: "dataSecurity" | "accessControl";
  data: {
    zkp: string;
    aes: string;
    ecc: string;
    hipaa: string;
    admins: {
      initials: string;
      name: string;
      action: string;
      time: string;
    }[];
  };
};

export default function SecurityCard({ type, data }: SecurityCardProps) {
  const getStatusIcon = (status: string) => {
    if (status === "active") {
      return <CheckCircle className="mr-2 h-5 w-5 text-green-500" />;
    }
    if (status === "warning") {
      return <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />;
    }
    return <XCircle className="mr-2 h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    if (status === "warning") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          1 Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  if (type === "dataSecurity") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-medium text-slate-900">Data Security Status</h3>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(data.zkp)}
              <span className="text-sm font-medium text-slate-900">Zero-Knowledge Proofs</span>
            </div>
            {getStatusBadge(data.zkp)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(data.aes)}
              <span className="text-sm font-medium text-slate-900">AES-256 Encryption</span>
            </div>
            {getStatusBadge(data.aes)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(data.ecc)}
              <span className="text-sm font-medium text-slate-900">Elliptic Curve Cryptography</span>
            </div>
            {getStatusBadge(data.ecc)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(data.hipaa)}
              <span className="text-sm font-medium text-slate-900">HIPAA Compliance Check</span>
            </div>
            {getStatusBadge(data.hipaa)}
          </div>
        </div>

        <div className="mt-6">
          <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">View Detailed Security Report →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blockchain-100 rounded-md p-3">
          <svg className="h-6 w-6 text-blockchain-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="ml-5">
          <h3 className="text-lg font-medium text-slate-900">Access Control</h3>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Administrator Activity</h4>
        <ul className="divide-y divide-slate-200">
          {data.admins.map((admin, index) => (
            <li key={index} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="h-8 w-8 rounded-full bg-blockchain-200 flex items-center justify-center text-blockchain-700 font-medium">
                    {admin.initials}
                  </span>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">{admin.name}</p>
                    <p className="text-xs text-slate-500">{admin.action}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{admin.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">Manage Access Controls →</a>
      </div>
    </div>
  );
}
