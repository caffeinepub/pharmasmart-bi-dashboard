import { usePharmacy } from "@/context/PharmacyContext";
import { forecastData } from "@/data/pharmacyData";
import {
  AlertTriangle,
  Brain,
  Calendar,
  Clock,
  Minus,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DemandBadge({ tier }: { tier: string }) {
  const cfg = {
    high: { bg: "#7F1D1D", text: "#FCA5A5", label: "High" },
    medium: { bg: "#78350F", text: "#FCD34D", label: "Medium" },
    low: { bg: "#1E293B", text: "#64748B", label: "Low" },
    new: { bg: "#0D3A4A", text: "#67E8F9", label: "New" },
  }[tier] ?? { bg: "#1E293B", text: "#64748B", label: tier };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")
    return (
      <TrendingUp className="w-4 h-4 inline" style={{ color: "#10B981" }} />
    );
  if (trend === "down")
    return (
      <TrendingDown className="w-4 h-4 inline" style={{ color: "#EF4444" }} />
    );
  return <Minus className="w-4 h-4 inline" style={{ color: "#64748B" }} />;
}

function StockDaysCell({ days }: { days: number }) {
  const color = days < 15 ? "#EF4444" : days < 30 ? "#F59E0B" : "#10B981";
  return (
    <span className="font-bold" style={{ color }}>
      {days}d
    </span>
  );
}

function TruncatedWhy({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const short = text.length > 60 ? `${text.slice(0, 60)}…` : text;
  return (
    <div className="relative">
      <span
        className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {short}
      </span>
      {open && text.length > 60 && (
        <div
          className="absolute bottom-full left-0 mb-2 w-72 p-3 rounded-lg text-xs text-slate-300 z-50"
          style={{
            backgroundColor: "#0F172A",
            border: "1px solid #334155",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

export function Predictions() {
  const { medicines, criticalMeds } = usePharmacy();

  return (
    <div className="p-6 space-y-6" data-ocid="predictions.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
          }}
        >
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            AI Demand Forecast Engine
          </h2>
          <p className="text-sm text-muted-foreground">
            Machine learning–based sales predictions with 95% confidence
            intervals
          </p>
        </div>
        <div
          className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: "#4C1D95",
            color: "#C4B5FD",
            border: "1px solid #7C3AED",
          }}
        >
          Model Accuracy: 91.4%
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-1">
          Revenue Forecast — Q1 2026
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Shaded region represents 95% confidence interval. Dashed line
          indicates forecasted values.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient
                id="confidenceGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k EGP`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#E2E8F0" }}
              itemStyle={{ color: "#94A3B8" }}
              formatter={(value, name: string) => [
                value !== null
                  ? `${(value as number).toLocaleString()} EGP`
                  : "N/A",
                name,
              ]}
            />
            <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#confidenceGradient)"
              name="Upper Bound"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="white"
              fillOpacity={0.01}
              name="Lower Bound"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              name="Actual Revenue"
              dot={{ fill: "#6366F1", r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#A78BFA"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              fill="none"
              name="Forecast"
              dot={{ fill: "#A78BFA", r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* At-risk stockout table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Clock
            className="text-red-400"
            style={{ width: "18px", height: "18px" }}
          />
          <h3 className="text-base font-semibold text-foreground">
            At-Risk Stockout Forecast
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="predictions.stockout.table"
          >
            <thead>
              <tr className="border-b border-border">
                {[
                  "Medicine",
                  "Category",
                  "Current Stock",
                  "Predicted Stockout",
                  "Urgency",
                  "Action Required",
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
              {criticalMeds
                .filter((m) => m.stock <= m.reorderPoint || m.daysLeft < 15)
                .map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    data-ocid={`predictions.stockout.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-foreground">
                      {item.stock} units
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          item.daysLeft <= 10
                            ? "text-red-400"
                            : "text-amber-400"
                        }`}
                      >
                        {item.daysLeft} days
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.daysLeft <= 10 ? (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: "#7F1D1D",
                            color: "#FCA5A5",
                          }}
                        >
                          🚨 CRITICAL
                        </span>
                      ) : (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: "#78350F",
                            color: "#FCD34D",
                          }}
                        >
                          ⚠️ HIGH
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">
                      Order {item.reorderPoint * 4} units within{" "}
                      {Math.max(1, item.daysLeft - 5)} days
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demand Planning Strategy */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Demand Planning Strategy
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {[
            {
              icon: TrendingUp,
              title: "Seasonal Stocking",
              color: "#6366F1",
              bg: "#1E1B4B",
              border: "#4338CA",
              desc: "Increase Antibiotic and Antiviral stock by 40% in October before the winter flu season. Historical data confirms a 28% demand spike in Q4 every year.",
            },
            {
              icon: ShoppingCart,
              title: "Just-In-Time Replenishment",
              color: "#10B981",
              bg: "#022C22",
              border: "#065F46",
              desc: "For fast-moving items (Paracetamol, Amoxicillin), automate reorder triggers when stock drops below the 30-day threshold to reduce holding costs.",
            },
            {
              icon: Calendar,
              title: "Chronic Disease Pre-Fill",
              color: "#F59E0B",
              bg: "#1C1407",
              border: "#78350F",
              desc: "Metformin and Cardiovascular drugs have predictable monthly demand. Use subscription-based forecasting to maintain a 90-day safety stock at all times.",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-xl p-5"
                style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    style={{ color: card.color, width: "18px", height: "18px" }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: card.color }}
                  >
                    {card.title}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medicine Demand Forecast Table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-1">
          Medicine Demand Forecast
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          AI-predicted demand tiers, trends, and stock runway for all medicines
        </p>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="predictions.demand.table"
          >
            <thead>
              <tr className="border-b border-border">
                {[
                  "Medicine",
                  "Category",
                  "Demand Tier",
                  "Trend",
                  "Forecast Units",
                  "Stock Days Left",
                  "Why Trend",
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
              {medicines.map((m, i) => (
                <tr
                  key={m.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`predictions.demand.item.${i + 1}`}
                >
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {m.isUserAdded && (
                        <span
                          className="px-1.5 py-0.5 rounded text-xs font-bold"
                          style={{
                            backgroundColor: "#0D3A4A",
                            color: "#67E8F9",
                          }}
                        >
                          New
                        </span>
                      )}
                      {m.name}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground text-xs">
                    {m.category}
                  </td>
                  <td className="py-2.5 px-3">
                    <DemandBadge tier={m.demandTier} />
                  </td>
                  <td className="py-2.5 px-3">
                    <TrendIcon trend={m.trend} />
                  </td>
                  <td className="py-2.5 px-3 font-mono text-foreground">
                    {m.forecastUnits.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <StockDaysCell days={m.daysLeft} />
                  </td>
                  <td className="py-2.5 px-3">
                    {m.isUserAdded ? (
                      <span className="text-xs" style={{ color: "#67E8F9" }}>
                        Insufficient data — predictions will improve as sales
                        history builds
                      </span>
                    ) : (
                      <TruncatedWhy text={m.whyTrend} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Alert Panel */}
      {criticalMeds.length > 0 && (
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#1A0707", border: "2px solid #EF4444" }}
          data-ocid="predictions.critical.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" style={{ color: "#EF4444" }} />
            <h3 className="text-base font-bold" style={{ color: "#FCA5A5" }}>
              Critical: Low Stock + High Demand Detected
            </h3>
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold animate-pulse"
              style={{ backgroundColor: "#7F1D1D", color: "#FCA5A5" }}
            >
              {criticalMeds.length} medicine{criticalMeds.length > 1 ? "s" : ""}{" "}
              at risk
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {criticalMeds.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{
                  backgroundColor: "#2D0A0A",
                  border: "1px solid #7F1D1D",
                }}
                data-ocid={`predictions.critical.item.${i + 1}`}
              >
                <div>
                  <div className="font-bold text-foreground">{m.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#FCA5A5" }}>
                    {m.daysLeft}d stock left ·{" "}
                    {m.forecastUnits.toLocaleString()} units forecasted
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#EF4444", color: "#fff" }}
                >
                  ORDER NOW
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
