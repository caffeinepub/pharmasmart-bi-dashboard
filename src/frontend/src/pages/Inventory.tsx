import { usePharmacy } from "@/context/PharmacyContext";
import { stockClassification } from "@/data/pharmacyData";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Package,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

function ClassBadge({ cls }: { cls: string }) {
  const cfg = {
    fast: { bg: "#064E3B", text: "#6EE7B7", label: "⚡ Fast Moving" },
    slow: { bg: "#78350F", text: "#FCD34D", label: "🐢 Slow Moving" },
    dead: { bg: "#7F1D1D", text: "#FCA5A5", label: "💀 Dead Stock" },
  }[cls] ?? { bg: "#1E293B", text: "#94A3B8", label: cls };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

export function Inventory() {
  const { medicines } = usePharmacy();

  const critical = useMemo(
    () =>
      medicines.filter((m) => m.daysLeft <= 10 || m.stock <= m.reorderPoint)
        .length,
    [medicines],
  );
  const low = useMemo(
    () =>
      medicines.filter(
        (m) => m.daysLeft > 10 && m.daysLeft <= 20 && m.stock > m.reorderPoint,
      ).length,
    [medicines],
  );
  const healthy = useMemo(
    () =>
      medicines.filter((m) => m.daysLeft > 20 && m.stock > m.reorderPoint)
        .length,
    [medicines],
  );

  const criticalList = useMemo(
    () =>
      medicines.filter((m) => m.stock <= m.reorderPoint || m.daysLeft <= 10),
    [medicines],
  );

  return (
    <div className="p-6 space-y-6" data-ocid="inventory.page">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Inventory Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Stock levels, classification, and reorder optimization
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Total SKUs
          </div>
          <div className="text-2xl font-bold text-foreground">
            {medicines.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Active products
          </div>
        </div>
        <div
          className="bg-card rounded-xl p-5 border"
          style={{ borderColor: "#EF4444" }}
        >
          <div
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#FCA5A5" }}
          >
            Critical
          </div>
          <div className="text-2xl font-bold" style={{ color: "#EF4444" }}>
            {critical}
          </div>
          <div className="text-xs mt-1" style={{ color: "#FCA5A5" }}>
            Immediate action needed
          </div>
        </div>
        <div
          className="bg-card rounded-xl p-5 border"
          style={{ borderColor: "#F59E0B" }}
        >
          <div
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#FCD34D" }}
          >
            Low Stock
          </div>
          <div className="text-2xl font-bold" style={{ color: "#F59E0B" }}>
            {low}
          </div>
          <div className="text-xs mt-1" style={{ color: "#FCD34D" }}>
            Order soon
          </div>
        </div>
        <div
          className="bg-card rounded-xl p-5 border"
          style={{ borderColor: "#10B981" }}
        >
          <div
            className="text-xs uppercase tracking-wider mb-1"
            style={{ color: "#6EE7B7" }}
          >
            Healthy
          </div>
          <div className="text-2xl font-bold" style={{ color: "#10B981" }}>
            {healthy}
          </div>
          <div className="text-xs mt-1" style={{ color: "#6EE7B7" }}>
            Adequate stock
          </div>
        </div>
      </div>

      {/* AI Reorder Recommendation */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#091220", border: "1px solid #6366F1" }}
      >
        <div className="flex items-start gap-3">
          <Brain
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: "#818CF8" }}
          />
          <div>
            <div
              className="text-sm font-bold mb-2"
              style={{ color: "#A5B4FC" }}
            >
              AI Reorder Recommendations
            </div>
            <div className="space-y-2">
              {criticalList.length === 0 ? (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle
                    className="w-3.5 h-3.5"
                    style={{ color: "#10B981" }}
                  />
                  <span className="text-slate-300">
                    All stock levels are healthy. No immediate action required.
                  </span>
                </div>
              ) : (
                criticalList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <AlertTriangle
                      className="w-3.5 h-3.5 shrink-0"
                      style={{
                        color: item.daysLeft <= 10 ? "#EF4444" : "#F59E0B",
                      }}
                    />
                    <span className="text-slate-300">
                      <strong>{item.name}</strong>: Order{" "}
                      <strong style={{ color: "#818CF8" }}>
                        {item.reorderPoint * 4} units
                      </strong>{" "}
                      — {item.daysLeft} days remaining at current sales
                      velocity.
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alert Table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle
            className="text-amber-400"
            style={{ width: "18px", height: "18px" }}
          />
          <h3 className="text-base font-semibold text-foreground">
            Stock Level Monitoring
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="inventory.alerts.table">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Medicine",
                  "Category",
                  "Current Stock",
                  "Reorder Point",
                  "Status",
                  "Days Remaining",
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
              {medicines.map((item, i) => {
                const status =
                  item.daysLeft <= 10 || item.stock <= item.reorderPoint
                    ? "critical"
                    : item.daysLeft <= 20
                      ? "low"
                      : "ok";
                return (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    data-ocid={`inventory.alert.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        {item.isUserAdded && (
                          <span
                            className="px-1.5 py-0.5 rounded text-xs font-bold"
                            style={{
                              backgroundColor: "#022C22",
                              color: "#10B981",
                            }}
                          >
                            New
                          </span>
                        )}
                        {item.name}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-foreground">
                          {item.stock}
                        </span>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((item.stock / item.reorderPoint) * 100, 100)}%`,
                              backgroundColor:
                                status === "critical"
                                  ? "#EF4444"
                                  : status === "low"
                                    ? "#F59E0B"
                                    : "#10B981",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {item.reorderPoint}
                    </td>
                    <td className="py-2.5 px-3">
                      {status === "critical" ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#7F1D1D",
                            color: "#FCA5A5",
                          }}
                        >
                          <XCircle className="w-3 h-3" /> Critical
                        </span>
                      ) : status === "low" ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#78350F",
                            color: "#FCD34D",
                          }}
                        >
                          <AlertTriangle className="w-3 h-3" /> Low
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#064E3B",
                            color: "#6EE7B7",
                          }}
                        >
                          <CheckCircle className="w-3 h-3" /> OK
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          item.daysLeft <= 10
                            ? "text-red-400"
                            : item.daysLeft <= 20
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {item.daysLeft} days
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Classification Table */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Stock Classification (ABC/XYZ Analysis)
        </h3>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="stock.classification.table"
          >
            <thead>
              <tr className="border-b border-border">
                {[
                  "Medicine",
                  "Category",
                  "Monthly Sales",
                  "Classification",
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
              {stockClassification.map((item, i) => (
                <tr
                  key={item.name}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-ocid={`stock.item.${i + 1}`}
                >
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-foreground">
                    {item.monthlySales} units/mo
                  </td>
                  <td className="py-2.5 px-3">
                    <ClassBadge cls={item.classification} />
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
