import {
  customerMedicineLinks,
  customerPredictions,
} from "@/data/pharmacyData";
import {
  Brain,
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

function SegmentBadge({ segment }: { segment: string }) {
  const cfg = {
    "high-value": {
      bg: "#3B0764",
      text: "#C4B5FD",
      border: "#7C3AED",
      label: "High-Value",
    },
    frequent: {
      bg: "#022C22",
      text: "#6EE7B7",
      border: "#10B981",
      label: "Frequent Buyer",
    },
    "at-risk": {
      bg: "#7F1D1D",
      text: "#FCA5A5",
      border: "#EF4444",
      label: "At-Risk",
    },
  }[segment] ?? {
    bg: "#1E293B",
    text: "#94A3B8",
    border: "#334155",
    label: segment,
  };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.label}
    </span>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")
    return <TrendingUp className="w-4 h-4" style={{ color: "#10B981" }} />;
  if (trend === "down")
    return <TrendingDown className="w-4 h-4" style={{ color: "#EF4444" }} />;
  return <Minus className="w-4 h-4" style={{ color: "#64748B" }} />;
}

function ProbBar({ prob, segment }: { prob: number; segment: string }) {
  const color =
    segment === "at-risk"
      ? "#EF4444"
      : segment === "high-value"
        ? "#7C3AED"
        : "#10B981";
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div
        className="flex-1 h-2 rounded-full"
        style={{ backgroundColor: "#1E293B" }}
      >
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${prob}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>
        {prob}%
      </span>
    </div>
  );
}

function MedicinePill({ name, accent }: { name: string; accent?: boolean }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mr-1 mb-1"
      style={{
        backgroundColor: accent ? "#1E1B4B" : "#1E293B",
        color: accent ? "#A78BFA" : "#94A3B8",
        border: `1px solid ${accent ? "#4338CA" : "#334155"}`,
      }}
    >
      {name}
    </span>
  );
}

function WhyTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Why explanation"
      >
        <Info className="w-4 h-4" />
      </button>
      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-lg text-xs text-slate-300 z-50"
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

export function CustomerPredictions() {
  const sorted = useMemo(
    () =>
      [...customerPredictions].sort(
        (a, b) => b.repurchaseProb - a.repurchaseProb,
      ),
    [],
  );
  const highValue = customerPredictions.filter(
    (c) => c.segment === "high-value",
  );
  const frequent = customerPredictions.filter((c) => c.segment === "frequent");
  const atRisk = customerPredictions.filter((c) => c.segment === "at-risk");

  const atRiskActions = [
    "Send re-engagement SMS",
    "Offer discount voucher",
    "Schedule pharmacist call",
  ];

  return (
    <div className="p-6 space-y-6" data-ocid="customer_predictions.page">
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
            Customer &amp; Medicine Predictions
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-powered behavioral forecasting and demand intelligence
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
          Live Predictions
        </div>
      </div>

      {/* Customer Insights KPI Cards */}
      <div
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        data-ocid="customer_predictions.panel"
      >
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" style={{ color: "#6366F1" }} />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Total Analyzed
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {customerPredictions.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Customers tracked
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#7C3AED" }}
            />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              High-Value
            </span>
          </div>
          <div className="text-3xl font-bold" style={{ color: "#A78BFA" }}>
            {highValue.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Premium customers
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#10B981" }}
            />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Frequent Buyers
            </span>
          </div>
          <div className="text-3xl font-bold" style={{ color: "#34D399" }}>
            {frequent.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Regular purchasers
          </div>
        </div>
        <div
          className="bg-card rounded-xl p-5 border"
          style={{ borderColor: "#7F1D1D" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#EF4444" }}
            />
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "#FCA5A5" }}
            >
              At-Risk
            </span>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: "#7F1D1D", color: "#FCA5A5" }}
            >
              Needs attention
            </span>
          </div>
          <div className="text-3xl font-bold" style={{ color: "#EF4444" }}>
            {atRisk.length}
          </div>
          <div className="text-xs mt-1" style={{ color: "#FCA5A5" }}>
            Churn risk detected
          </div>
        </div>
      </div>

      {/* Predicted Top Customers Table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-1">
          Predicted Top Customers
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Ranked by repurchase probability — auto-updated when data changes
        </p>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="customer_predictions.table"
          >
            <thead>
              <tr className="border-b border-border">
                {[
                  "#",
                  "Customer",
                  "Segment",
                  "Repurchase Prob.",
                  "Trend",
                  "Last Purchase",
                  "Top Medicines",
                  "Why",
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
              {sorted.map((c, i) => (
                <tr
                  key={c.name}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`customer_predictions.item.${i + 1}`}
                >
                  <td className="py-2.5 px-3">
                    <span className="text-xs font-bold text-muted-foreground">
                      #{i + 1}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-foreground">
                    {c.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <SegmentBadge segment={c.segment} />
                  </td>
                  <td className="py-2.5 px-3">
                    <ProbBar prob={c.repurchaseProb} segment={c.segment} />
                  </td>
                  <td className="py-2.5 px-3">
                    <TrendIcon trend={c.trend} />
                  </td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">
                    {c.lastPurchaseDays}d ago
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap">
                      {c.topMedicines.map((m) => (
                        <MedicinePill key={m} name={m} />
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <WhyTooltip text={c.whyHighValue} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-Risk Customers Panel */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          ⚠ At-Risk Customer Panel
        </h3>
        <div
          className="grid grid-cols-1 xl:grid-cols-3 gap-4"
          data-ocid="customer_predictions.panel"
        >
          {atRisk.map((c, i) => (
            <div
              key={c.name}
              className="rounded-xl p-5"
              style={{
                backgroundColor: "#13090D",
                border: "1px solid #7F1D1D",
              }}
              data-ocid={`customer_predictions.card.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-foreground">{c.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#FCA5A5" }}>
                    {c.lastPurchaseDays} days since last purchase
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-xl font-bold"
                    style={{ color: "#EF4444" }}
                  >
                    {c.repurchaseProb}%
                  </div>
                  <div className="text-xs" style={{ color: "#F87171" }}>
                    repurchase
                  </div>
                </div>
              </div>
              <div
                className="h-1.5 rounded-full mb-3"
                style={{ backgroundColor: "#1E293B" }}
              >
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${c.repurchaseProb}%`,
                    backgroundColor: "#EF4444",
                  }}
                />
              </div>
              <p className="text-xs mb-3" style={{ color: "#94A3B8" }}>
                {c.whyHighValue}
              </p>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: "#1E293B",
                  color: "#A78BFA",
                  border: "1px solid #4338CA",
                }}
              >
                💬 {atRiskActions[i % atRiskActions.length]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer-Medicine Smart Links */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-1">
          Customer–Medicine Smart Links
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          AI-detected purchase patterns and personalized medicine
          recommendations
        </p>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="customer_predictions.links.table"
          >
            <thead>
              <tr className="border-b border-border">
                {[
                  "Customer",
                  "Top Purchases",
                  "AI Recommendation",
                  "Reason",
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
              {customerMedicineLinks.map((link, i) => (
                <tr
                  key={link.customerName}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`customer_predictions.links.item.${i + 1}`}
                >
                  <td className="py-2.5 px-3 font-semibold text-foreground">
                    {link.customerName}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap">
                      {link.topMedicines.map((m) => (
                        <MedicinePill key={m} name={m} />
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap">
                      {link.recommended.map((m) => (
                        <MedicinePill key={m} name={m} accent />
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground max-w-[260px]">
                    {link.linkReason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
