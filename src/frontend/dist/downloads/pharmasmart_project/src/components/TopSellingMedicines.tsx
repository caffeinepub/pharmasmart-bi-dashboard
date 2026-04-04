import type { TopSellingEntry } from "@/analytics/businessAnalytics";

type TopSellingMedicinesProps = {
  items: TopSellingEntry[];
};

const RANK_STYLES: Record<
  number,
  { badge: string; text: string; dot: string }
> = {
  1: { badge: "#78350F", text: "#FCD34D", dot: "#F59E0B" },
  2: { badge: "#1E293B", text: "#CBD5E1", dot: "#94A3B8" },
  3: { badge: "#1C120A", text: "#FDBA74", dot: "#F97316" },
};

function getRankStyle(rank: number) {
  return (
    RANK_STYLES[rank] ?? { badge: "#0F172A", text: "#64748B", dot: "#475569" }
  );
}

export function TopSellingMedicines({ items }: TopSellingMedicinesProps) {
  return (
    <div
      className="bg-card rounded-xl border border-border shadow-xs flex flex-col"
      data-ocid="top-selling.panel"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <h3 className="text-base font-semibold text-foreground">
            Top Selling Medicines
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Top 5 by quantity sold
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4">
        {items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full py-8 text-center"
            data-ocid="top-selling.empty_state"
          >
            <span className="text-3xl mb-2">📊</span>
            <p className="text-sm text-muted-foreground">
              No sales recorded yet. Create invoices to see top sellers.
            </p>
          </div>
        ) : (
          <ol className="space-y-2.5" data-ocid="top-selling.list">
            {items.map((item, index) => {
              const rank = index + 1;
              const style = getRankStyle(rank);
              return (
                <li
                  key={item.medicineId}
                  className="flex items-center gap-3"
                  data-ocid={`top-selling.item.${rank}`}
                >
                  {/* Rank badge */}
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: style.badge, color: style.text }}
                  >
                    {rank}
                  </span>

                  {/* Name */}
                  <span className="flex-1 text-sm font-medium text-foreground truncate">
                    {item.medicineName}
                  </span>

                  {/* Quantity badge */}
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: `${style.dot}25`,
                      color: style.dot,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: style.dot }}
                    />
                    {item.totalSold} sold
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
