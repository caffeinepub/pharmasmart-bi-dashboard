import { customerSegments, topCustomers } from "@/data/pharmacyData";
import { Crown, RefreshCw, UserX, Users } from "lucide-react";

export function Customers() {
  return (
    <div className="p-6 space-y-6" data-ocid="customers.page">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Customer Intelligence
        </h2>
        <p className="text-sm text-muted-foreground">
          Segmentation analysis and purchase behavior patterns
        </p>
      </div>

      {/* Avg Order Value prominent */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
          border: "1px solid #4338CA",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: "#A5B4FC" }}
            >
              Average Order Value
            </div>
            <div className="text-4xl font-bold text-white">
              ${customerSegments.avgOrderValue}
            </div>
            <div className="text-sm mt-1" style={{ color: "#C7D2FE" }}>
              Per transaction across all customer segments
            </div>
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#4338CA" }}
          >
            <Users className="w-8 h-8" style={{ color: "#A5B4FC" }} />
          </div>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="bg-card rounded-xl p-5 border"
          style={{ borderColor: "#7C3AED" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4" style={{ color: "#A78BFA" }} />
            <span className="text-sm font-bold" style={{ color: "#A78BFA" }}>
              High-Value Customers
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {customerSegments.highValue.count}
          </div>
          <div className="text-xs text-muted-foreground">customers</div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Avg. Annual Spend
            </div>
            <div className="text-lg font-bold" style={{ color: "#A78BFA" }}>
              ${customerSegments.highValue.avgSpent}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Top 24% of customers generating 68% of total revenue. Focus on
            retention via loyalty programs.
          </p>
        </div>

        <div
          className="bg-card rounded-xl p-5 border"
          style={{ borderColor: "#10B981" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4" style={{ color: "#34D399" }} />
            <span className="text-sm font-bold" style={{ color: "#34D399" }}>
              Frequent Buyers
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {customerSegments.frequent.count}
          </div>
          <div className="text-xs text-muted-foreground">customers</div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Avg. Monthly Orders
            </div>
            <div className="text-lg font-bold" style={{ color: "#34D399" }}>
              {customerSegments.frequent.avgOrders}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Chronic disease patients with predictable refill cycles. Target with
            subscription packages.
          </p>
        </div>

        <div
          className="bg-card rounded-xl p-5 border"
          style={{ borderColor: "#64748B" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <UserX className="w-4 h-4" style={{ color: "#94A3B8" }} />
            <span className="text-sm font-bold" style={{ color: "#94A3B8" }}>
              Low Engagement
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {customerSegments.lowEngagement.count}
          </div>
          <div className="text-xs text-muted-foreground">customers</div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Avg. Annual Spend
            </div>
            <div className="text-lg font-bold" style={{ color: "#94A3B8" }}>
              ${customerSegments.lowEngagement.avgSpent}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Infrequent visitors. Re-engagement campaign with discount vouchers
            recommended.
          </p>
        </div>
      </div>

      {/* Top Customers Table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Top Customers by Revenue
        </h3>
        <table className="w-full text-sm" data-ocid="customers.table">
          <thead>
            <tr className="border-b border-border">
              {[
                "Rank",
                "Customer",
                "Orders",
                "Total Spent",
                "Segment",
                "Contribution",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-3 text-xs text-muted-foreground font-medium uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((c, i) => {
              const totalAll = topCustomers.reduce(
                (s, x) => s + x.totalSpent,
                0,
              );
              const pct = ((c.totalSpent / totalAll) * 100).toFixed(1);
              return (
                <tr
                  key={c.name}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`customers.item.${i + 1}`}
                >
                  <td className="py-2.5 px-3">
                    <span
                      className="font-bold"
                      style={{ color: i < 2 ? "#A78BFA" : "#64748B" }}
                    >
                      #{i + 1}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    {c.name}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {c.orders}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                    {c.totalSpent.toLocaleString()} EGP
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                      style={
                        c.segment === "high-value"
                          ? { backgroundColor: "#4C1D95", color: "#C4B5FD" }
                          : { backgroundColor: "#064E3B", color: "#6EE7B7" }
                      }
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: "#6366F1",
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Purchase Pattern Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {[
          {
            title: "Cross-Selling Opportunity",
            desc: "Metformin buyers also purchase Vitamin D3 in 68% of cases. A prompted bundle at checkout could increase average basket value by 180–270 EGP.",
            color: "#7C3AED",
          },
          {
            title: "Seasonal Purchase Pattern",
            desc: "High-value customers purchase 35% more in November–December. Pre-season outreach with exclusive offers can capitalize on this window.",
            color: "#10B981",
          },
          {
            title: "Churn Risk Signal",
            desc: "12 high-value customers have not purchased in 30+ days, representing 126,000 EGP in potential lost revenue. SMS re-engagement is advised.",
            color: "#EF4444",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-card rounded-xl p-5 border border-border"
          >
            <div
              className="w-1 h-10 rounded-full mb-3"
              style={{ backgroundColor: card.color }}
            />
            <div className="text-sm font-bold text-foreground mb-2">
              {card.title}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
