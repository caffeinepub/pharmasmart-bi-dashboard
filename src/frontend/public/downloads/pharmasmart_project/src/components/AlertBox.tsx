import type { ReactNode } from "react";

type AlertBoxProps = {
  type: "warning" | "danger";
  title: string;
  count: number;
  emptyMessage: string;
  children: ReactNode;
};

const STYLES = {
  warning: {
    border: "#D97706",
    bg: "#1C1400",
    divider: "#78350F",
    titleColor: "#FCD34D",
    badgeBg: "#D97706",
    badgeText: "#1C1400",
    emptyBg: "#051F11",
    emptyBorder: "#10B981",
    emptyText: "#34D399",
  },
  danger: {
    border: "#EF4444",
    bg: "#1A0707",
    divider: "#7F1D1D",
    titleColor: "#FCA5A5",
    badgeBg: "#EF4444",
    badgeText: "#1A0707",
    emptyBg: "#051F11",
    emptyBorder: "#10B981",
    emptyText: "#34D399",
  },
};

export function AlertBox({
  type,
  title,
  count,
  emptyMessage,
  children,
}: AlertBoxProps) {
  const s = STYLES[type];

  if (count === 0) {
    return (
      <div
        className="rounded-xl px-5 py-4 flex items-center gap-3"
        style={{
          background: s.emptyBg,
          border: `1px solid ${s.emptyBorder}`,
        }}
        data-ocid={`${type}-alert.success_state`}
      >
        <span className="text-xl">✅</span>
        <p className="text-sm font-medium" style={{ color: s.emptyText }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
      data-ocid={`${type}-alert.panel`}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ borderBottom: `1px solid ${s.divider}` }}
      >
        <span className="text-base">⚠️</span>
        <span className="text-sm font-bold" style={{ color: s.titleColor }}>
          {title}
        </span>
        <span
          className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
          style={{ background: s.badgeBg, color: s.badgeText }}
        >
          {count}
        </span>
      </div>

      {/* Divider Line (visual spacer already handled by header border) */}
      {/* Children */}
      <ul className="divide-y" style={{ borderColor: s.divider }}>
        {children}
      </ul>
    </div>
  );
}
