import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type MatchingStatusProps = {
  data: {
    accuracy: string;
    batchProcessing: string;
    zkpValidation: string;
    lastUpdate: string;
  };
};

export default function MatchingStatus({ data }: MatchingStatusProps) {
  const accuracyValue = parseFloat(data.accuracy.replace('%', ''));
  const batchValue = parseFloat(data.batchProcessing.replace('%', ''));
  const zkpValue = parseFloat(data.zkpValidation.replace('%', ''));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 col-span-1">
      <h3 className="text-lg font-medium text-slate-900 mb-4">Current Matching Status</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700">AI Model Accuracy</span>
            <span className="text-sm font-medium text-slate-900">{data.accuracy}</span>
          </div>
          <Progress value={accuracyValue} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700">Batch Processing</span>
            <span className="text-sm font-medium text-slate-900">{data.batchProcessing}</span>
          </div>
          <Progress value={batchValue} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700">ZKP Validation</span>
            <span className="text-sm font-medium text-slate-900">{data.zkpValidation}</span>
          </div>
          <Progress value={zkpValue} className="h-2" />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Last Model Update</p>
            <p className="text-sm text-slate-500">{data.lastUpdate}</p>
          </div>
          <Button variant="outline" size="sm">
            Run Update
          </Button>
        </div>
      </div>
    </div>
  );
}
