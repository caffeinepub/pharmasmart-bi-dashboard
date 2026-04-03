import { computeSmartRecommendations } from "@/analytics/businessAnalytics";
import type { TopSellingEntry } from "@/analytics/businessAnalytics";
import { ActivityLog } from "@/components/ActivityLog";
import { ProfitSummaryCard } from "@/components/ProfitSummaryCard";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { TopSellingMedicines } from "@/components/TopSellingMedicines";
import { usePharmacy } from "@/context/PharmacyContext";
import type {
  Customer,
  Invoice,
  MedicineEntry,
} from "@/context/PharmacyContext";
import {
  categoryDistribution,
  customerPredictions,
  inventoryAlerts,
  monthlyRevenue,
  topMedicines,
} from "@/data/pharmacyData";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Download,
  Package,
  Printer,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#7C3AED",
  "#EC4899",
];

function exportReportCSV(
  medicines: MedicineEntry[],
  invoices: Invoice[],
  totalProfit: number,
  topSelling: TopSellingEntry[],
  customers: Customer[],
) {
  const totalRevenue = invoices.reduce((s, inv) => s + inv.total, 0);
  const lowStockItems = medicines.filter((m) => m.stock < 10);

  const rows: string[] = [];

  // Section 1: Summary KPIs
  rows.push("=== PHARMASMART REPORT ===");
  rows.push(`Generated,${new Date().toLocaleString()}`);
  rows.push("");
  rows.push("=== SUMMARY KPIs ===");
  rows.push("Metric,Value");
  rows.push(`Total Revenue (EGP),${totalRevenue.toFixed(2)}`);
  rows.push(`Total Orders,${invoices.length}`);
  rows.push(`Total Profit (EGP),${totalProfit.toFixed(2)}`);
  rows.push(`Low Stock Items,${lowStockItems.length}`);
  rows.push("");

  // Section 2: Top Selling Medicines
  rows.push("=== TOP SELLING MEDICINES ===");
  rows.push("Rank,Medicine Name,Units Sold");
  for (let i = 0; i < topSelling.length; i++) {
    const entry = topSelling[i];
    rows.push(`${i + 1},${entry.medicineName},${entry.totalSold}`);
  }
  if (topSelling.length === 0) rows.push("No sales data available");
  rows.push("");

  // Section 3: Latest Invoices
  rows.push("=== LATEST INVOICES ===");
  rows.push("Date,Customer,Items Count,Total (EGP)");
  const latest = [...invoices]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20);
  for (const inv of latest) {
    rows.push(
      `${inv.date.toLocaleDateString()},${inv.customerName || "Walk-in"},${inv.items.length},${inv.total.toFixed(2)}`,
    );
  }
  if (invoices.length === 0) rows.push("No invoices available");
  rows.push("");

  // Section 4: At-Risk Customers
  rows.push("=== AT-RISK CUSTOMERS ===");
  rows.push("Name,Invoice Count,Last Purchase Date");
  const atRisk = customers.filter((c) => c.isAtRisk);
  for (const c of atRisk) {
    const lastDate =
      c.purchaseHistory.length > 0
        ? c.purchaseHistory[c.purchaseHistory.length - 1].date
        : "—";
    rows.push(`${c.name},${c.purchaseHistory.length},${lastDate}`);
  }
  if (atRisk.length === 0) rows.push("No at-risk customers");
  rows.push("");

  // Section 5: Low Stock Medicines
  rows.push("=== LOW STOCK MEDICINES ===");
  rows.push("Name,Current Stock,Reorder Point");
  for (const m of lowStockItems) {
    rows.push(`${m.name},${m.stock},${m.reorderPoint}`);
  }
  if (lowStockItems.length === 0)
    rows.push("All medicines sufficiently stocked");
  rows.push("");

  // Section 6: Customer Purchase History
  rows.push("=== CUSTOMER PURCHASE HISTORY ===");
  rows.push("Customer Name,Invoice ID,Date,Medicines,Quantities");
  for (const c of customers) {
    for (const p of c.purchaseHistory) {
      const medNames = p.medicines.map((m) => m.name).join("; ");
      const medQtys = p.medicines.map((m) => m.quantity).join("; ");
      rows.push(
        `${c.name},#${p.invoiceId.slice(-6)},${p.date},${medNames},${medQtys}`,
      );
    }
  }
  if (customers.length === 0) rows.push("No customer data available");

  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pharmasmart-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {sub && (
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = {
    critical: { bg: "#7F1D1D", text: "#FCA5A5", label: "Critical" },
    low: { bg: "#78350F", text: "#FCD34D", label: "Low Stock" },
    ok: { bg: "#064E3B", text: "#6EE7B7", label: "OK" },
  }[status] ?? { bg: "#1E293B", text: "#94A3B8", label: status };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

export function Overview() {
  const {
    totalRevenue,
    totalOrders,
    invoices,
    medicines,
    totalProfit,
    topSelling,
    customers,
  } = usePharmacy();

  const atRiskCount = useMemo(
    () => customers.filter((c) => c.isAtRisk).length,
    [customers],
  );
  const highValueCount = useMemo(
    () => customerPredictions.filter((c) => c.segment === "high-value").length,
    [],
  );
  const avgRepurchase = useMemo(() => {
    const sum = customerPredictions.reduce(
      (acc, c) => acc + c.repurchaseProb,
      0,
    );
    return Math.round(sum / customerPredictions.length);
  }, []);

  const criticalMeds = useMemo(
    () => medicines.filter((m) => m.demandTier === "high" && m.daysLeft < 15),
    [medicines],
  );

  const recentlyAdded = useMemo(
    () =>
      medicines
        .filter((m) => m.isUserAdded)
        .sort(
          (a, b) => (b.addedAt?.getTime() ?? 0) - (a.addedAt?.getTime() ?? 0),
        )
        .slice(0, 5),
    [medicines],
  );

  const latestInvoices = useMemo(
    () =>
      [...invoices]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5),
    [invoices],
  );

  const smartRecommendations = useMemo(
    () => computeSmartRecommendations(medicines, invoices),
    [medicines, invoices],
  );

  // Customer & Invoice Analytics
  const topCustomersByRevenue = useMemo(() => {
    return [...customers]
      .map((c) => ({
        name: c.name,
        revenue: c.purchaseHistory.reduce(
          (sum, ph) =>
            sum + ph.medicines.reduce((s, m) => s + m.price * m.quantity, 0),
          0,
        ),
        invoiceCount: c.purchaseHistory.length,
        profit: c.purchaseHistory.reduce(
          (sum, ph) =>
            sum +
            ph.medicines.reduce(
              (s, m) => s + (m.price - (m.costPrice ?? 0)) * m.quantity,
              0,
            ),
          0,
        ),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [customers]);

  const allCustomerRevenue = useMemo(
    () =>
      customers.reduce(
        (sum, c) =>
          sum +
          c.purchaseHistory.reduce(
            (s, ph) =>
              s + ph.medicines.reduce((ms, m) => ms + m.price * m.quantity, 0),
            0,
          ),
        0,
      ),
    [customers],
  );

  const customersWithHistory = useMemo(
    () => customers.filter((c) => c.purchaseHistory.length > 0).length,
    [customers],
  );
  const avgRevenuePerCustomer =
    customersWithHistory > 0 ? allCustomerRevenue / customersWithHistory : 0;

  return (
    <div className="p-6 space-y-6" data-ocid="overview.page">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <KPICard
          label="Total Revenue"
          value={`${totalRevenue.toLocaleString()} EGP`}
          sub="FY 2025"
          icon={DollarSign}
          color="#6366F1"
        />
        <KPICard
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          sub="FY 2025"
          icon={ShoppingCart}
          color="#10B981"
        />
        <KPICard
          label="Avg Order Value"
          value="1,010 EGP"
          sub="per transaction"
          icon={Activity}
          color="#F59E0B"
        />
        <KPICard
          label="Top Product"
          value="Amoxicillin"
          sub="126,000 EGP revenue"
          icon={Star}
          color="#7C3AED"
        />
        <KPICard
          label="AI Health Score"
          value="87/100"
          sub="System efficiency"
          icon={Package}
          color="#10B981"
        />
      </div>

      {/* Business Intelligence Section */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>📊</span> Business Intelligence
            <span className="text-xs font-normal text-muted-foreground ml-2">
              Advanced Analytics &amp; Smart Insights
            </span>
          </h2>

          {/* Export / Print toolbar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                exportReportCSV(
                  medicines,
                  invoices,
                  totalProfit,
                  topSelling,
                  customers,
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                border: "1px solid #334155",
                color: "#94A3B8",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#1E293B";
                (e.currentTarget as HTMLButtonElement).style.color = "#E2E8F0";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#6366F1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#334155";
              }}
              data-ocid="overview.export.button"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                border: "1px solid #334155",
                color: "#94A3B8",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#1E293B";
                (e.currentTarget as HTMLButtonElement).style.color = "#E2E8F0";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#6366F1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#334155";
              }}
              data-ocid="overview.print.button"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <TopSellingMedicines items={topSelling} />
          <ProfitSummaryCard
            totalProfit={totalProfit}
            invoiceCount={invoices.length}
          />
          <SmartRecommendations recommendations={smartRecommendations} />
        </div>
      </div>

      {/* Customer & Invoice Analytics Section */}
      <div data-ocid="overview.customer_analytics.section">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5" style={{ color: "#6366F1" }} />
          <h2 className="text-lg font-bold text-foreground">
            Customer &amp; Invoice Analytics
          </h2>
          <span className="text-xs font-normal text-muted-foreground">
            Revenue breakdown by customer
          </span>
        </div>

        {/* Customer KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ backgroundColor: "#0A1628", border: "1px solid #1E3A5F" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#1E3A5F" }}
            >
              <DollarSign className="w-5 h-5" style={{ color: "#6366F1" }} />
            </div>
            <div>
              <div
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "#818CF8" }}
              >
                Total Customer Revenue
              </div>
              <div className="text-2xl font-bold" style={{ color: "#6366F1" }}>
                {allCustomerRevenue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                EGP
              </div>
              <div className="text-xs" style={{ color: "#818CF8" }}>
                From tracked purchases
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ backgroundColor: "#042f2e", border: "1px solid #134e4a" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#134e4a" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#10B981" }} />
            </div>
            <div>
              <div
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "#6EE7B7" }}
              >
                Avg Revenue / Customer
              </div>
              <div className="text-2xl font-bold" style={{ color: "#10B981" }}>
                {avgRevenuePerCustomer.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                EGP
              </div>
              <div className="text-xs" style={{ color: "#6EE7B7" }}>
                Active customers only
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ backgroundColor: "#1A0707", border: "1px solid #7F1D1D" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#7F1D1D" }}
            >
              <Users className="w-5 h-5" style={{ color: "#FCA5A5" }} />
            </div>
            <div>
              <div
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "#FCA5A5" }}
              >
                At-Risk Customers
              </div>
              <div className="text-2xl font-bold" style={{ color: "#EF4444" }}>
                {atRiskCount}
              </div>
              <div className="text-xs" style={{ color: "#F87171" }}>
                {atRiskCount === 0
                  ? "No at-risk customers"
                  : "Flagged for follow-up"}
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers Table */}
        <div
          className="bg-card rounded-xl p-6 border border-border shadow-xs"
          data-ocid="overview.top_customers.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4" style={{ color: "#F59E0B" }} />
            <h3 className="text-base font-semibold text-foreground">
              Top Customers by Revenue
            </h3>
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#1E1B4B", color: "#818CF8" }}
            >
              Top {topCustomersByRevenue.filter((c) => c.revenue > 0).length}
            </span>
          </div>
          {topCustomersByRevenue.filter((c) => c.revenue > 0).length === 0 ? (
            <div
              className="text-sm text-muted-foreground text-center py-6"
              data-ocid="overview.top_customers.empty_state"
            >
              No customer purchase data yet. Create invoices to see top
              customers.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="overview.top_customers.table"
              >
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Rank",
                      "Customer Name",
                      "Revenue (EGP)",
                      "Invoices",
                      "Profit (EGP)",
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
                  {topCustomersByRevenue
                    .filter((c) => c.revenue > 0)
                    .map((c, i) => (
                      <tr
                        key={c.name}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        data-ocid={`overview.top_customers.item.${i + 1}`}
                      >
                        <td className="py-2.5 px-3">
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor:
                                i === 0
                                  ? "#78350F"
                                  : i === 1
                                    ? "#1E293B"
                                    : i === 2
                                      ? "#172554"
                                      : "#0F172A",
                              color:
                                i === 0
                                  ? "#FDE68A"
                                  : i === 1
                                    ? "#CBD5E1"
                                    : i === 2
                                      ? "#93C5FD"
                                      : "#64748B",
                            }}
                          >
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          {c.name}
                        </td>
                        <td
                          className="py-2.5 px-3 font-mono font-bold"
                          style={{ color: "#818CF8" }}
                        >
                          {c.revenue.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {c.invoiceCount}
                        </td>
                        <td
                          className="py-2.5 px-3 font-mono font-semibold"
                          style={{ color: "#10B981" }}
                        >
                          {c.profit.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Customer Intelligence KPI Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-5 flex items-center gap-4"
          style={{ backgroundColor: "#1A0707", border: "1px solid #7F1D1D" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#7F1D1D" }}
          >
            <Users className="w-5 h-5" style={{ color: "#FCA5A5" }} />
          </div>
          <div>
            <div
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "#FCA5A5" }}
            >
              At-Risk Customers
            </div>
            <div className="text-2xl font-bold" style={{ color: "#EF4444" }}>
              {atRiskCount}
            </div>
            <div className="text-xs" style={{ color: "#F87171" }}>
              {atRiskCount === 0
                ? "No at-risk customers"
                : "Flagged for follow-up"}
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#1E1B4B" }}
          >
            <Activity className="w-5 h-5" style={{ color: "#A78BFA" }} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Avg Repurchase Prob.
            </div>
            <div className="text-2xl font-bold" style={{ color: "#A78BFA" }}>
              {avgRepurchase}%
            </div>
            <div className="text-xs text-muted-foreground">
              Across all customers
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#0D1B34" }}
          >
            <Star className="w-5 h-5" style={{ color: "#C4B5FD" }} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              High-Value Customers
            </div>
            <div className="text-2xl font-bold" style={{ color: "#C4B5FD" }}>
              {highValueCount}
            </div>
            <div className="text-xs text-muted-foreground">Premium segment</div>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {criticalMeds.length > 0 && (
        <div
          className="rounded-xl px-5 py-4 flex items-center gap-3"
          style={{ backgroundColor: "#1A0707", border: "2px solid #EF4444" }}
          data-ocid="overview.critical.panel"
        >
          <AlertTriangle
            className="w-5 h-5 shrink-0"
            style={{ color: "#EF4444" }}
          />
          <div>
            <span className="font-bold text-sm" style={{ color: "#FCA5A5" }}>
              ⚠ Critical Stock Alert:{" "}
            </span>
            <span className="text-sm" style={{ color: "#FCA5A5" }}>
              {criticalMeds.map((m) => m.name).join(", ")}.
            </span>
            <span className="text-xs ml-2" style={{ color: "#F87171" }}>
              High demand + critically low stock detected.
            </span>
          </div>
        </div>
      )}

      {/* Revenue + Orders Line Chart */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-xs">
        <h3 className="text-base font-semibold text-foreground mb-1">
          Monthly Revenue &amp; Orders Trend
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Full year 2025 — dual-axis view
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k EGP`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#E2E8F0" }}
              itemStyle={{ color: "#94A3B8" }}
            />
            <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 12 }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#6366F1"
              strokeWidth={2.5}
              dot={{ fill: "#6366F1", r: 3 }}
              name="Revenue (EGP)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ fill: "#10B981", r: 3 }}
              name="Orders"
              strokeDasharray="5 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar + Pie side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-xs">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Top 10 Medicines by Revenue
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Ranked by annual revenue
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={topMedicines}
              layout="vertical"
              margin={{ left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E293B"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#64748B", fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k EGP`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#E2E8F0" }}
                itemStyle={{ color: "#94A3B8" }}
              />
              <Bar
                dataKey="revenue"
                fill="#6366F1"
                radius={[0, 4, 4, 0]}
                name="Revenue (EGP)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-xs">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Revenue by Category
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Distribution across medicine categories
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="45%"
                outerRadius={90}
                innerRadius={45}
                paddingAngle={3}
              >
                {categoryDistribution.map((entry, i) => (
                  <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#E2E8F0" }}
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} EGP`,
                  name,
                ]}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#94A3B8", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Alerts */}
      <div
        className="bg-card rounded-xl p-6 border border-border shadow-xs"
        data-ocid="inventory.panel"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle
            className="text-amber-400"
            style={{ width: "18px", height: "18px" }}
          />
          <h3 className="text-base font-semibold text-foreground">
            Inventory Alerts
          </h3>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />3 items need attention
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="inventory.table">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Medicine",
                  "Category",
                  "Current Stock",
                  "Reorder Point",
                  "Status",
                  "Days Left",
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
              {inventoryAlerts.map((item, i) => (
                <tr
                  key={item.name}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`inventory.item.${i + 1}`}
                >
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-foreground">
                    {item.stock}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">
                    {item.reorder}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={
                        item.daysLeft <= 10
                          ? "text-red-400 font-bold"
                          : item.daysLeft <= 20
                            ? "text-amber-400 font-semibold"
                            : "text-muted-foreground"
                      }
                    >
                      {item.daysLeft}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recently Added Medicines */}
      {recentlyAdded.length > 0 && (
        <div
          className="bg-card rounded-xl p-6 border shadow-xs"
          style={{ borderColor: "#10B981" }}
          data-ocid="overview.recently_added.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package
              className="w-4.5 h-4.5"
              style={{ width: "18px", height: "18px", color: "#10B981" }}
            />
            <h3 className="text-base font-semibold text-foreground">
              Recently Added Medicines
            </h3>
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#022C22", color: "#10B981" }}
            >
              {recentlyAdded.length} new
            </span>
          </div>
          <div className="space-y-2">
            {recentlyAdded.map((med, i) => (
              <div
                key={med.id}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{
                  backgroundColor: "#0A1F16",
                  border: "1px solid #064E3B",
                }}
                data-ocid={`overview.recently_added.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#022C22", color: "#10B981" }}
                  >
                    New
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {med.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {med.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs text-muted-foreground">Stock</div>
                    <div className="text-sm font-mono font-bold text-foreground">
                      {med.stock} units
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div
                      className="text-sm font-mono font-bold"
                      style={{ color: "#10B981" }}
                    >
                      {med.price.toFixed(2)} EGP
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Invoices */}
      {latestInvoices.length > 0 && (
        <div
          className="bg-card rounded-xl p-6 border shadow-xs"
          style={{ borderColor: "#6366F1" }}
          data-ocid="overview.invoices.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart
              className="w-4.5 h-4.5"
              style={{ width: "18px", height: "18px", color: "#6366F1" }}
            />
            <h3 className="text-base font-semibold text-foreground">
              Latest Invoices
            </h3>
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#1E1B4B", color: "#818CF8" }}
            >
              {latestInvoices.length} invoice
              {latestInvoices.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              data-ocid="overview.invoices.table"
            >
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Customer", "Items", "Total"].map((h) => (
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
                {latestInvoices.map((inv, i) => (
                  <tr
                    key={inv.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    data-ocid={`overview.invoices.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">
                      {inv.date.toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {inv.customerName || "Walk-in"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {inv.items.length} item{inv.items.length !== 1 ? "s" : ""}
                    </td>
                    <td
                      className="py-2.5 px-3 font-mono font-bold"
                      style={{ color: "#818CF8" }}
                    >
                      {inv.total.toFixed(2)} EGP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <ActivityLog invoices={invoices} customers={customers} />
    </div>
  );
}
