import type { Customer } from "@/context/PharmacyContext";
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface Props {
  customer: Customer;
  onToggleAtRisk: (id: string) => void;
}

export function CustomerInvoice({ customer, onToggleAtRisk }: Props) {
  const totalQuantity = customer.purchaseHistory.reduce(
    (sum, purchase) =>
      sum + purchase.medicines.reduce((s, m) => s + m.quantity, 0),
    0,
  );

  const allMedicines = customer.purchaseHistory.flatMap((p) =>
    p.medicines.map((m) => m.name),
  );
  const uniqueMedicines = [...new Set(allMedicines)];

  // Total spend computed from stored prices in purchase history
  const approxTotalSpend = customer.purchaseHistory.reduce(
    (total, purchase) =>
      total +
      purchase.medicines.reduce((sum, m) => sum + m.price * m.quantity, 0),
    0,
  );

  // Total profit computed from (price - costPrice) * quantity
  const totalProfit = customer.purchaseHistory.reduce(
    (total, purchase) =>
      total +
      purchase.medicines.reduce(
        (sum, m) => sum + (m.price - (m.costPrice ?? 0)) * m.quantity,
        0,
      ),
    0,
  );

  const profitMarginPct =
    approxTotalSpend > 0
      ? ((totalProfit / approxTotalSpend) * 100).toFixed(1)
      : null;

  // Most purchased medicine
  const medicineCounts: Record<string, number> = {};
  for (const purchase of customer.purchaseHistory) {
    for (const m of purchase.medicines) {
      medicineCounts[m.name] = (medicineCounts[m.name] ?? 0) + m.quantity;
    }
  }
  const mostPurchased =
    Object.entries(medicineCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const invoiceCount = customer.purchaseHistory.length;
  const avgInvoiceValue =
    invoiceCount > 0 ? approxTotalSpend / invoiceCount : 0;

  return (
    <div className="space-y-4">
      {/* Customer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{
              background: customer.isAtRisk
                ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)"
                : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            }}
          >
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-foreground">{customer.name}</div>
            <div className="text-xs text-muted-foreground">
              {customer.purchaseHistory.length} invoice
              {customer.purchaseHistory.length !== 1 ? "s" : ""} ·{" "}
              {totalQuantity} units total
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {customer.isAtRisk ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#7F1D1D", color: "#FCA5A5" }}
            >
              <ShieldAlert className="w-3 h-3" />
              At Risk
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#064E3B", color: "#6EE7B7" }}
            >
              <ShieldCheck className="w-3 h-3" />
              Active
            </span>
          )}
          <button
            type="button"
            onClick={() => onToggleAtRisk(customer.id)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{
              border: customer.isAtRisk
                ? "1px solid #6EE7B7"
                : "1px solid #EF4444",
              color: customer.isAtRisk ? "#6EE7B7" : "#FCA5A5",
              background: "transparent",
            }}
            data-ocid="customers.toggle"
          >
            {customer.isAtRisk ? "Mark as Active" : "Mark as At Risk"}
          </button>
        </div>
      </div>

      {/* At-risk warning section */}
      {customer.isAtRisk && (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: "#1A0707", border: "1px solid #7F1D1D" }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" style={{ color: "#EF4444" }} />
            <span className="text-sm font-bold" style={{ color: "#FCA5A5" }}>
              At-Risk Customer Detail
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: "#2A0A0A",
                border: "1px solid #450A0A",
              }}
            >
              <div
                className="text-xs font-medium mb-1"
                style={{ color: "#F87171" }}
              >
                <Package className="inline w-3 h-3 mr-1" />
                Medicines Purchased
              </div>
              <div className="space-y-0.5">
                {uniqueMedicines.map((med) => (
                  <div
                    key={med}
                    className="text-xs"
                    style={{ color: "#FCA5A5" }}
                  >
                    • {med}
                  </div>
                ))}
                {uniqueMedicines.length === 0 && (
                  <div className="text-xs" style={{ color: "#F87171" }}>
                    —
                  </div>
                )}
              </div>
            </div>
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: "#2A0A0A",
                border: "1px solid #450A0A",
              }}
            >
              <div
                className="text-xs font-medium mb-1"
                style={{ color: "#F87171" }}
              >
                <Calendar className="inline w-3 h-3 mr-1" />
                Invoice Dates
              </div>
              <div className="space-y-0.5">
                {customer.purchaseHistory.map((p) => (
                  <div
                    key={p.invoiceId}
                    className="text-xs"
                    style={{ color: "#FCA5A5" }}
                  >
                    • {p.date}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: "#2A0A0A",
                border: "1px solid #450A0A",
              }}
            >
              <div
                className="text-xs font-medium mb-1"
                style={{ color: "#F87171" }}
              >
                Total Quantity
              </div>
              <div className="text-2xl font-bold" style={{ color: "#EF4444" }}>
                {totalQuantity}
              </div>
              <div className="text-xs" style={{ color: "#F87171" }}>
                units purchased
              </div>
            </div>
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: "#2A0A0A",
                border: "1px solid #450A0A",
              }}
            >
              <div
                className="text-xs font-medium mb-1"
                style={{ color: "#F87171" }}
              >
                <DollarSign className="inline w-3 h-3 mr-1" />
                Total Profit (EGP)
              </div>
              {totalProfit > 0 ? (
                <>
                  <div
                    className="text-xl font-bold"
                    style={{ color: "#EF4444" }}
                  >
                    {totalProfit.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="text-xs" style={{ color: "#F87171" }}>
                    EGP
                  </div>
                </>
              ) : (
                <div className="text-xs" style={{ color: "#F87171" }}>
                  No profit data
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      {customer.purchaseHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Invoice ID",
                  "Date",
                  "Medicines",
                  "Qty",
                  "Price",
                  "Subtotal",
                  "Profit",
                  "Invoice Total",
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
              {customer.purchaseHistory.map((purchase, i) => {
                const invoiceTotal = purchase.medicines.reduce(
                  (sum, m) => sum + m.price * m.quantity,
                  0,
                );
                const invoiceProfit = purchase.medicines.reduce(
                  (sum, m) => sum + (m.price - (m.costPrice ?? 0)) * m.quantity,
                  0,
                );
                return (
                  <tr
                    key={purchase.invoiceId}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    data-ocid={`customers.invoice.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground align-top">
                      #{purchase.invoiceId.slice(-6)}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground align-top">
                      {purchase.date}
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      <div className="space-y-0.5">
                        {purchase.medicines.map((med) => (
                          <div
                            key={med.name}
                            className="text-xs text-foreground"
                          >
                            {med.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      <div className="space-y-0.5">
                        {purchase.medicines.map((med) => (
                          <div
                            key={med.name}
                            className="text-xs font-mono text-foreground"
                          >
                            ×{med.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      <div className="space-y-0.5">
                        {purchase.medicines.map((med) => (
                          <div
                            key={med.name}
                            className="text-xs font-mono text-muted-foreground"
                          >
                            {med.price} EGP
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      <div className="space-y-0.5">
                        {purchase.medicines.map((med) => (
                          <div
                            key={med.name}
                            className="text-xs font-mono"
                            style={{ color: "#6EE7B7" }}
                          >
                            {(med.price * med.quantity).toFixed(0)} EGP
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      <div className="space-y-0.5">
                        {purchase.medicines.map((med) => (
                          <div
                            key={med.name}
                            className="text-xs font-mono"
                            style={{ color: "#A78BFA" }}
                          >
                            {((m) =>
                              (m.price - (m.costPrice ?? 0)) * m.quantity)(
                              med,
                            ).toFixed(0)}{" "}
                            EGP
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 align-top space-y-0.5">
                      <span
                        className="text-sm font-bold font-mono block"
                        style={{ color: "#10B981" }}
                      >
                        {invoiceTotal.toFixed(0)} EGP
                      </span>
                      <span
                        className="text-xs font-mono block"
                        style={{ color: "#A78BFA" }}
                      >
                        +{invoiceProfit.toFixed(0)} profit
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-4">
          No purchase history yet.
        </div>
      )}

      {/* Customer Insights Row */}
      {invoiceCount > 0 && (
        <div
          className="rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          style={{ backgroundColor: "#0A1628", border: "1px solid #1E3A5F" }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp
              className="w-4 h-4 shrink-0"
              style={{ color: "#6366F1" }}
            />
            <div>
              <div className="text-xs text-muted-foreground">
                Most Purchased
              </div>
              <div className="text-sm font-semibold text-foreground truncate">
                {mostPurchased ?? "—"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign
              className="w-4 h-4 shrink-0"
              style={{ color: "#10B981" }}
            />
            <div>
              <div className="text-xs text-muted-foreground">
                Avg Invoice Value
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "#10B981" }}
              >
                {avgInvoiceValue.toFixed(0)} EGP
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package
              className="w-4 h-4 shrink-0"
              style={{ color: "#A78BFA" }}
            />
            <div>
              <div className="text-xs text-muted-foreground">Purchases</div>
              <div
                className="text-sm font-semibold"
                style={{ color: "#A78BFA" }}
              >
                {invoiceCount} invoice{invoiceCount !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp
              className="w-4 h-4 shrink-0"
              style={{ color: "#F59E0B" }}
            />
            <div>
              <div className="text-xs text-muted-foreground">Profit Margin</div>
              <div
                className="text-sm font-semibold"
                style={{ color: "#F59E0B" }}
              >
                {profitMarginPct !== null ? `${profitMarginPct}%` : "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
