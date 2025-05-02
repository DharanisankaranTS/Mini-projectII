import { 
  User, FileText, CheckCircle, 
  SlidersHorizontal, TrendingUp, TrendingDown
} from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend: number;
  trendLabel: string;
};

export default function StatCard({ title, value, icon, color, trend, trendLabel }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'user':
        return <User className={`h-6 w-6 text-${color}-600`} />;
      case 'file':
        return <FileText className={`h-6 w-6 text-${color}-600`} />;
      case 'check-circle':
        return <CheckCircle className={`h-6 w-6 text-${color}-600`} />;
      case 'sliders-horizontal':
        return <SlidersHorizontal className={`h-6 w-6 text-${color}-600`} />;
      default:
        return <User className={`h-6 w-6 text-${color}-600`} />;
    }
  };

  const isTrendPositive = trend >= 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 bg-${color}-100 rounded-md p-3`}>
          {getIcon()}
        </div>
        <div className="ml-5">
          <dl>
            <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-900">{value}</dd>
          </dl>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${isTrendPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {isTrendPositive ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {Math.abs(trend)}% {isTrendPositive ? 'increase' : 'decrease'}
          </span>
          <span className="text-xs text-slate-500">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}
