import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Match = {
  id: number;
  matchScore: number;
  organType: string;
  donor: {
    id: string;
    name: string;
  };
  recipient: {
    id: string;
    name: string;
  };
};

type AiMatchesProps = {
  matches: Match[] | undefined;
  isLoading: boolean;
};

export default function AiMatches({ matches, isLoading }: AiMatchesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 col-span-2">
      <h3 className="text-lg font-medium text-slate-900 mb-4">Recent AI-Suggested Matches</h3>
      <div className="overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {isLoading ? (
            <li className="py-4 text-center text-slate-500">Loading AI matches...</li>
          ) : matches?.length === 0 ? (
            <li className="py-4 text-center text-slate-500">No AI matches available.</li>
          ) : (
            matches?.map((match) => (
              <li key={match.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100">
                        <span className="font-medium text-primary-600">{match.matchScore}%</span>
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900">{match.organType} Transplant</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-slate-500">Donor:</span>
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ID: {match.donor.id}
                        </span>
                        <span className="mx-2 text-slate-300">→</span>
                        <span className="text-xs text-slate-500">Recipient:</span>
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          ID: {match.recipient.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50" size="sm">
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              </li>
            ))
          )}

          {!isLoading && !matches && (
            <>
              <li className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100">
                        <span className="font-medium text-primary-600">95%</span>
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900">Kidney Transplant</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-slate-500">Donor:</span>
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ID: 0x28f3...9e21
                        </span>
                        <span className="mx-2 text-slate-300">→</span>
                        <span className="text-xs text-slate-500">Recipient:</span>
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          ID: 0x71ae...4f09
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50" size="sm">
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              </li>

              <li className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100">
                        <span className="font-medium text-primary-600">87%</span>
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900">Liver Transplant</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-slate-500">Donor:</span>
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ID: 0x92c1...3a76
                        </span>
                        <span className="mx-2 text-slate-300">→</span>
                        <span className="text-xs text-slate-500">Recipient:</span>
                        <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          ID: 0x65fd...8b23
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50" size="sm">
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="mt-6">
        <Button variant="outline" className="w-full">
          View All Matches
        </Button>
      </div>
    </div>
  );
}
