import { aiInsights } from "@/data/pharmacyData";
import {
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Zap,
  Users,
};

const typeConfig: Record<
  string,
  { bg: string; border: string; text: string; badge: string; badgeText: string }
> = {
  alert: {
    bg: "#1A0A0A",
    border: "#EF4444",
    text: "#FCA5A5",
    badge: "#7F1D1D",
    badgeText: "ALERT",
  },
  opportunity: {
    bg: "#0A1A10",
    border: "#10B981",
    text: "#6EE7B7",
    badge: "#064E3B",
    badgeText: "OPPORTUNITY",
  },
  pattern: {
    bg: "#13091F",
    border: "#7C3AED",
    text: "#C4B5FD",
    badge: "#4C1D95",
    badgeText: "PATTERN",
  },
  risk: {
    bg: "#1A1000",
    border: "#F59E0B",
    text: "#FCD34D",
    badge: "#78350F",
    badgeText: "RISK",
  },
  info: {
    bg: "#091220",
    border: "#0EA5E9",
    text: "#7DD3FC",
    badge: "#0C4A6E",
    badgeText: "INFO",
  },
};

export function AIInsightsPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aiInsights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const insight = aiInsights[currentIndex];
  const config = typeConfig[insight.type] ?? typeConfig.info;
  const Icon = iconMap[insight.icon] ?? Sparkles;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-xl p-4 shadow-2xl"
          style={{
            background: config.bg,
            border: `1px solid ${config.border}`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: config.badge }}
            >
              <Icon className="w-4 h-4" style={{ color: config.text }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold tracking-wider"
                  style={{ color: config.text }}
                >
                  {config.badgeText}
                </span>
                <span className="text-xs" style={{ color: "#475569" }}>
                  AI Insight {currentIndex + 1}/{aiInsights.length}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#CBD5E1" }}
              >
                {insight.message}
              </p>
            </div>
            <button
              type="button"
              data-ocid="ai_panel.close_button"
              onClick={() => setVisible(false)}
              className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: "#64748B" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3 flex gap-1">
            {aiInsights.map((ins, i) => (
              <div
                key={ins.message.slice(0, 20)}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    i === currentIndex ? config.border : "#1E293B",
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
