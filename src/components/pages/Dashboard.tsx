
import { Layout } from '@/components/layout/Layout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { AthleteHighlights } from '@/components/dashboard/AthleteHighlights';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao painel de gestão do MGM Fitness Luanda
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              Exportar Relatório
            </Button>
            <Button className="bg-mgm-blue hover:bg-mgm-blue-dark">
              Novo Atleta
            </Button>
          </div>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingEvents />
          <RecentActivity />
        </div>
        <div>
          <AthleteHighlights />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
