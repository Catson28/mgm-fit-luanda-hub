
import { 
  Users, Calendar, TrendingUp, DollarSign,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: {
    value: string;
    positive: boolean;
  };
  color?: 'blue' | 'red' | 'green' | 'orange';
}

const StatCard = ({ title, value, icon: Icon, change, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-mgm-blue/20 to-mgm-blue/5 text-mgm-blue',
    red: 'from-mgm-red/20 to-mgm-red/5 text-mgm-red',
    green: 'from-green-500/20 to-green-500/5 text-green-500',
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-500'
  };

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && (
              <div className="flex items-center mt-2 text-xs">
                {change.positive ? (
                  <ChevronUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ChevronDown className="h-3 w-3 mr-1 text-mgm-red" />
                )}
                <span className={change.positive ? 'text-green-500' : 'text-mgm-red'}>
                  {change.value}
                </span>
                <span className="text-muted-foreground ml-1">este mês</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-full bg-gradient-to-br",
            colorClasses[color]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total de Atletas"
        value="245"
        icon={Users}
        change={{ value: "12%", positive: true }}
        color="blue"
      />
      <StatCard
        title="Receita Mensal"
        value="320,500 AOA"
        icon={DollarSign}
        change={{ value: "8%", positive: true }}
        color="green"
      />
      <StatCard
        title="Eventos Ativos"
        value="3"
        icon={Calendar}
        change={{ value: "0%", positive: true }}
        color="orange"
      />
      <StatCard
        title="Taxa de Retenção"
        value="87%"
        icon={TrendingUp}
        change={{ value: "2%", positive: false }}
        color="red"
      />
    </div>
  );
}
