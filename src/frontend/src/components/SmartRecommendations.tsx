import type { SmartRecommendation } from "@/analytics/businessAnalytics";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

type SmartRecommendationsProps = {
  recommendations: SmartRecommendation[];
};

const MAX_DISPLAY = 8;

const TYPE_CONFIG = {
  "high-demand": {
    icon: TrendingUp,
    borderColor: "#10B981",
    iconColor: "#10B981",
    bg: "#022C22",
    labelBg: "#064E3B",
    labelText: "#6EE7B7",
    label: "High Demand",
  },
  "low-sales": {
    icon: TrendingDown,
    borderColor: "#F59E0B",
    iconColor: "#F59E0B",
    bg: "#1C1400",
    labelBg: "#78350F",
    labelText: "#FCD34D",
    label: "Low Sales",
  },
  "near-expiry": {
    icon: AlertTriangle,
    borderColor: "#EF4444",
    iconColor: "#EF4444",
    bg: "#1A0707",
    labelBg: "#7F1D1D",
    labelText: "#FCA5A5",
    label: "Near Expiry",
  },
} as const;

export function SmartRecommendations({
  recommendations,
}: SmartRecommendationsProps) {
  const visible = recommendations.slice(0, MAX_DISPLAY);

  return (
    <div
      className="bg-card rounded-xl border border-border shadow-xs flex flex-col"
      data-ocid="recommendations.panel"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="text-base font-semibold text-foreground">
            Smart AI Recommendations
          </h3>
          {recommendations.length > 0 && (
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#1E1B4B", color: "#818CF8" }}
            >
              {recommendations.length}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Rule-based business insights
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4">
        {recommendations.length === 0 ? (
          <div
            className="rounded-xl px-4 py-4 flex items-center gap-3"
            style={{ backgroundColor: "#022C22", border: "1px solid #10B981" }}
            data-ocid="recommendations.success_state"
          >
            <span className="text-xl">✅</span>
            <p className="text-sm font-medium" style={{ color: "#34D399" }}>
              No recommendations at this time — business is running well.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5" data-ocid="recommendations.list">
            {visible.map((rec, i) => {
              const cfg = TYPE_CONFIG[rec.type];
              const Icon = cfg.icon;
              return (
                <li
                  key={`${rec.type}-${rec.medicineName}`}
                  className="rounded-lg px-3 py-2.5 flex items-start gap-3"
                  style={{
                    backgroundColor: cfg.bg,
                    borderLeft: `3px solid ${cfg.borderColor}`,
                    border: `1px solid ${cfg.borderColor}30`,
                    borderLeftWidth: "3px",
                  }}
                  data-ocid={`recommendations.item.${i + 1}`}
                >
                  <Icon
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: cfg.iconColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: cfg.labelBg,
                          color: cfg.labelText,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: cfg.labelText, opacity: 0.9 }}
                    >
                      {rec.message}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {recommendations.length > MAX_DISPLAY && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            +{recommendations.length - MAX_DISPLAY} more insights hidden
          </p>
        )}
      </div>
    </div>
  );
}
