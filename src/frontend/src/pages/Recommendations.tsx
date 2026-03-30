import { aiDecisionLog, recommendations } from "@/data/pharmacyData";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  DollarSign,
  Package,
  RefreshCw,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  AlertTriangle,
  Users,
  RefreshCw,
  DollarSign,
  Package,
};

const priorityConfig: Record<
  string,
  { border: string; badge: string; badgeText: string; badgeBg: string }
> = {
  high: {
    border: "#EF4444",
    badge: "#7F1D1D",
    badgeText: "HIGH PRIORITY",
    badgeBg: "#FCA5A5",
  },
  medium: {
    border: "#F59E0B",
    badge: "#78350F",
    badgeText: "MEDIUM",
    badgeBg: "#FCD34D",
  },
  low: {
    border: "#6366F1",
    badge: "#1E1B4B",
    badgeText: "LOW",
    badgeBg: "#A5B4FC",
  },
};

export function Recommendations() {
  return (
    <div className="p-6 space-y-6" data-ocid="recommendations.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
          }}
        >
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            AI Decision Support Engine
          </h2>
          <p className="text-sm text-muted-foreground">
            Actionable business recommendations ranked by priority and expected
            impact
          </p>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {recommendations.map((rec, i) => {
          const Icon = iconMap[rec.icon] ?? TrendingUp;
          const cfg = priorityConfig[rec.priority] ?? priorityConfig.low;
          return (
            <div
              key={rec.title}
              className="bg-card rounded-xl p-5 border border-border relative overflow-hidden"
              style={{ borderLeft: `3px solid ${cfg.border}` }}
              data-ocid={`recommendations.item.${i + 1}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cfg.border}20` }}
                >
                  <Icon
                    className="w-4.5 h-4.5"
                    style={{ color: cfg.border, width: "18px", height: "18px" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-flex px-2 py-0.5 rounded text-xs font-bold tracking-wide"
                      style={{ backgroundColor: cfg.badge, color: cfg.badgeBg }}
                    >
                      {cfg.badgeText}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {rec.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {rec.description}
                  </p>
                  <div
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: "#0F2A1F",
                      border: "1px solid #10B981",
                      color: "#6EE7B7",
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {rec.impact}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Decision Log */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-1">
          AI Decision Audit Log
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Track which recommendations were acted upon and their outcomes
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="decision.log.table">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Date",
                  "AI Recommendation",
                  "Action Taken",
                  "Outcome",
                  "Result",
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
              {aiDecisionLog.map((entry, i) => (
                <tr
                  key={entry.date}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`decision.log.item.${i + 1}`}
                >
                  <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="py-2.5 px-3 text-foreground max-w-48">
                    {entry.recommendation}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground max-w-40">
                    {entry.action}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={
                        entry.status === "success"
                          ? "text-emerald-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    >
                      {entry.outcome}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {entry.status === "success" ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: "#064E3B", color: "#6EE7B7" }}
                      >
                        <CheckCircle className="w-3 h-3" /> Acted
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: "#7F1D1D", color: "#FCA5A5" }}
                      >
                        <XCircle className="w-3 h-3" /> Missed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusion */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#0A0F1E", border: "1px solid #1E3A5F" }}
      >
        <h3 className="text-base font-bold text-slate-200 mb-2">
          System Conclusion
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          PharmaSmart's AI Decision Support Engine synthesizes sales patterns,
          inventory velocity, and customer behavior to generate prioritized,
          evidence-based recommendations. By acting on high-priority alerts —
          particularly emergency restocking and bundle promotions — the pharmacy
          can increase annual revenue by an estimated
          <span className="text-emerald-400 font-bold"> 12–18%</span> while
          reducing waste by
          <span className="text-emerald-400 font-bold"> 30%</span>. The system
          demonstrates that data-driven pharmacy management is not merely an
          operational improvement, but a strategic competitive advantage.
        </p>
      </div>
    </div>
  );
}
