import { usePharmacy } from "@/context/PharmacyContext";
import {
  bottomMedicines,
  monthlyRevenue,
  topMedicines,
} from "@/data/pharmacyData";
import { AlertCircle, Award, TrendingDown, TrendingUp } from "lucide-react";

function MoMChange({
  current,
  prev,
}: { current: number; prev: number | null }) {
  if (prev === null) return <span className="text-muted-foreground">—</span>;
  const pct = ((current - prev) / prev) * 100;
  const positive = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        positive ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {positive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {positive ? "+" : ""}
      {pct.toFixed(1)}%
    </span>
  );
}

export function SalesAnalysis() {
  const { totalRevenue: contextRevenue, invoices } = usePharmacy();
  const baseRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const invoiceRevenue = invoices.reduce((s, inv) => s + inv.total, 0);
  const displayRevenue = contextRevenue;

  const firstHalf = monthlyRevenue
    .slice(0, 6)
    .reduce((s, m) => s + m.revenue, 0);
  const secondHalf = monthlyRevenue.slice(6).reduce((s, m) => s + m.revenue, 0);
  const growthRate = (((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6" data-ocid="sales.page">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Sales Performance Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Fiscal Year 2025 — Full annual review
          </p>
        </div>
        <div
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ backgroundColor: "#064E3B", border: "1px solid #10B981" }}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400">
            +{growthRate}% H2 vs H1 Growth
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Total Annual Revenue
          </div>
          <div className="text-2xl font-bold text-foreground">
            {displayRevenue.toLocaleString()} EGP
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-emerald-400">+15.2% YTD</span>
            {invoiceRevenue > 0 && (
              <span className="text-xs text-indigo-400">
                (incl. {invoiceRevenue.toFixed(0)} EGP from {invoices.length}{" "}
                invoices)
              </span>
            )}
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Best Month
          </div>
          <div className="text-2xl font-bold text-foreground">December</div>
          <div className="text-xs text-muted-foreground mt-1">
            22,100 EGP — Peak of year
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Avg Monthly Revenue
          </div>
          <div className="text-2xl font-bold text-foreground">
            {(baseRevenue / 12).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Consistent growth observed
          </div>
        </div>
      </div>

      {/* Monthly Revenue Table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Monthly Revenue Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="sales.table">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Month",
                  "Revenue",
                  "Orders",
                  "Avg Order",
                  "MoM Change",
                  "Performance",
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
              {monthlyRevenue.map((row, i) => {
                const prevRevenue =
                  i > 0 ? monthlyRevenue[i - 1].revenue : null;
                const pct = prevRevenue
                  ? ((row.revenue - prevRevenue) / prevRevenue) * 100
                  : null;
                const barW = Math.round((row.revenue / 22100) * 100);
                return (
                  <tr
                    key={row.month}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    data-ocid={`sales.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-foreground">
                      {row.month}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                      {row.revenue.toLocaleString()} EGP
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {row.orders}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {(row.revenue / row.orders).toFixed(0)} EGP
                    </td>
                    <td className="py-2.5 px-3">
                      <MoMChange current={row.revenue} prev={prevRevenue} />
                    </td>
                    <td className="py-2.5 px-3 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${barW}%`,
                              backgroundColor:
                                pct !== null && pct >= 0
                                  ? "#6366F1"
                                  : "#EF4444",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">
                          {barW}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top vs Bottom Performers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Award
              className="text-indigo-400"
              style={{ width: "18px", height: "18px" }}
            />
            <h3 className="text-base font-semibold text-foreground">
              Best Performing Medicines
            </h3>
          </div>
          <div className="space-y-3">
            {topMedicines.slice(0, 5).map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-3"
                data-ocid={`sales.top.item.${i + 1}`}
              >
                <span
                  className="text-xs font-bold w-6 text-center rounded"
                  style={{ color: "#6366F1" }}
                >
                  #{i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {m.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {m.category} · {m.units} units
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {m.revenue.toLocaleString()} EGP
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle
              className="text-amber-400"
              style={{ width: "18px", height: "18px" }}
            />
            <h3 className="text-base font-semibold text-foreground">
              Underperforming Medicines
            </h3>
          </div>
          <div className="space-y-3">
            {bottomMedicines.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-3"
                data-ocid={`sales.bottom.item.${i + 1}`}
              >
                <span
                  className="text-xs font-bold w-6 text-center"
                  style={{ color: "#F59E0B" }}
                >
                  ↓
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {m.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {m.category} · {m.units} units
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-400">
                  {m.revenue.toLocaleString()} EGP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight block */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#13091F", border: "1px solid #7C3AED" }}
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-violet-300 mb-1">
              Why the December Peak?
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              December's 22,100 EGP revenue — the highest of the year — is
              driven by a combination of winter flu season increasing Antibiotic
              and Antiviral demand (+28%), year-end chronic medication refills
              for Metformin and Cardiovascular drugs, and a successful Vitamin
              bundle promotion launched in November. This seasonal pattern
              repeats annually and should inform stocking decisions for Q4 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
