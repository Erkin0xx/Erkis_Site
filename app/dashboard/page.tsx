import { createClient } from "@/lib/supabase/server";
import BentoGrid from "@/components/shared/BentoGrid";
import StatsCard from "@/components/shared/StatsCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch mock stats (replace with real data later)
  const stats = {
    totalRevenue: 1250.0,
    revenueChange: 12.5,
    newCustomers: 1234,
    customersChange: -20,
    activeAccounts: 45678,
    accountsChange: 8.3,
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">General</h1>
        <p className="text-muted-foreground">
          Overview of your dashboard metrics and activities.
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid>
        {/* Total Revenue Card */}
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          trend={stats.revenueChange > 0 ? "up" : "down"}
          subtitle="Trending up this month"
          icon="TrendingUp"
          className="md:col-span-2"
        />

        {/* New Customers Card */}
        <StatsCard
          title="New Customers"
          value={stats.newCustomers.toLocaleString()}
          change={stats.customersChange}
          trend={stats.customersChange > 0 ? "up" : "down"}
          subtitle="Down 20% this period"
          icon="Users"
        />

        {/* Active Accounts Card */}
        <StatsCard
          title="Active Accounts"
          value={stats.activeAccounts.toLocaleString()}
          change={stats.accountsChange}
          trend={stats.accountsChange > 0 ? "up" : "down"}
          subtitle="Strong user retention"
          icon="Activity"
        />

        {/* Additional placeholder cards */}
        <div className="glass-card p-6">
          <h3 className="text-xs uppercase text-muted-foreground mb-2">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
              Refresh Data
            </button>
            <button className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
              View Reports
            </button>
          </div>
        </div>
      </BentoGrid>
    </div>
  );
}
