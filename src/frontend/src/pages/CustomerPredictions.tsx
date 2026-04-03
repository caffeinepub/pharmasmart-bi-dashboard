import { CustomerInvoice } from "@/components/CustomerInvoice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer, InvoiceItem } from "@/context/PharmacyContext";
import { usePharmacy } from "@/context/PharmacyContext";
import {
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Prediction Tag ──────────────────────────────────────────────────────────────────────────────
type PredictionTag = {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
};

function getPredictionTag(customer: Customer): PredictionTag {
  if (customer.isAtRisk) {
    return {
      label: "High Risk",
      icon: "⚠️",
      color: "#FCA5A5",
      bg: "#7F1D1D",
      border: "#EF4444",
    };
  }
  if (customer.frequentBuyer || customer.purchaseHistory.length >= 3) {
    return {
      label: "Frequent Buyer",
      icon: "⭐",
      color: "#FDE68A",
      bg: "#78350F",
      border: "#F59E0B",
    };
  }
  return {
    label: "Potential for Promotion",
    icon: "🎯",
    color: "#6EE7B7",
    bg: "#064E3B",
    border: "#10B981",
  };
}

function getTotalSpend(customer: Customer): number {
  return customer.purchaseHistory.reduce(
    (total, purchase) =>
      total +
      purchase.medicines.reduce((sum, m) => sum + m.price * m.quantity, 0),
    0,
  );
}

function getProfit(customer: Customer): number {
  return customer.purchaseHistory.reduce(
    (sum, ph) =>
      sum +
      ph.medicines.reduce(
        (s, m) => s + (m.price - (m.costPrice ?? 0)) * m.quantity,
        0,
      ),
    0,
  );
}

// ─── Prediction Badge ───────────────────────────────────────────────────────────────────────────────
function PredictionBadge({ tag }: { tag: PredictionTag }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{
        backgroundColor: tag.bg,
        color: tag.color,
        border: `1px solid ${tag.border}`,
      }}
    >
      <span>{tag.icon}</span>
      {tag.label}
    </span>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: number | string;
  sub: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: accent }}>{icon}</span>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold" style={{ color: accent }}>
        {value}
      </div>
      <div className="text-xs text-slate-500 mt-1">{sub}</div>
    </div>
  );
}

// ─── Inline Invoice Form ─────────────────────────────────────────────────────────────────────────
interface InlineInvoiceFormProps {
  customerName: string;
  onSuccess: (total: number) => void;
  onCancel: () => void;
}

function InlineInvoiceForm({
  customerName,
  onSuccess,
  onCancel,
}: InlineInvoiceFormProps) {
  const { medicines, createInvoice } = usePharmacy();
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const selectedItems = useMemo(() => {
    return medicines
      .map((med) => {
        const qtyStr = quantities[med.id] ?? "";
        const qty = Number.parseInt(qtyStr, 10);
        if (!qtyStr || Number.isNaN(qty) || qty <= 0) return null;
        return {
          medicineId: med.id,
          medicineName: med.name,
          qty,
          unitPrice: med.price,
          subtotal: qty * med.price,
          maxStock: med.stock,
        };
      })
      .filter(Boolean) as (InvoiceItem & { maxStock: number })[];
  }, [medicines, quantities]);

  const grandTotal = useMemo(
    () => selectedItems.reduce((s, it) => s + it.subtotal, 0),
    [selectedItems],
  );

  const overStockErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    for (const it of selectedItems) {
      if (it.qty > it.maxStock) {
        errs[it.medicineId] = `Exceeds stock (${it.maxStock})`;
      }
    }
    return errs;
  }, [selectedItems]);

  const canSubmit =
    selectedItems.length > 0 && Object.keys(overStockErrors).length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError(
        selectedItems.length === 0
          ? "Please select at least one medicine."
          : "Fix stock errors before submitting.",
      );
      return;
    }
    createInvoice(
      selectedItems.map(
        ({ medicineId, medicineName, qty, unitPrice, subtotal }) => ({
          medicineId,
          medicineName,
          qty,
          unitPrice,
          subtotal,
        }),
      ),
      customerName,
    );
    onSuccess(grandTotal);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="predictions.add_invoice.modal"
    >
      {/* Read-only customer name */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-slate-400">Customer</Label>
        <div
          className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-200"
          style={{ backgroundColor: "#0F172A", border: "1px solid #334155" }}
        >
          {customerName}
        </div>
      </div>

      {/* Medicine table */}
      <div>
        <Label className="text-xs font-medium text-slate-400 mb-2 block">
          Select Medicines &amp; Quantities
        </Label>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid #334155" }}
        >
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead
                style={{ backgroundColor: "#0F172A" }}
                className="sticky top-0"
              >
                <tr>
                  {["Medicine", "Price", "Stock", "Qty"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-xs text-slate-500 font-medium uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr
                    key={med.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-2 px-3 text-slate-200 text-xs font-medium">
                      {med.name}
                    </td>
                    <td className="py-2 px-3 text-xs text-slate-400">
                      {med.price} EGP
                    </td>
                    <td className="py-2 px-3 text-xs">
                      <span
                        style={{
                          color: med.stock < 10 ? "#FCA5A5" : "#6EE7B7",
                        }}
                      >
                        {med.stock}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        min={0}
                        max={med.stock}
                        placeholder="0"
                        value={quantities[med.id] ?? ""}
                        onChange={(e) => {
                          setQuantities((prev) => ({
                            ...prev,
                            [med.id]: e.target.value,
                          }));
                          setError("");
                        }}
                        className="w-20 h-7 text-xs"
                        data-ocid="predictions.add_invoice.input"
                      />
                      {overStockErrors[med.id] && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#FCA5A5" }}
                        >
                          {overStockErrors[med.id]}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary */}
      {selectedItems.length > 0 && (
        <div
          className="rounded-lg p-3 flex items-center justify-between"
          style={{ backgroundColor: "#0A1628", border: "1px solid #1E3A5F" }}
        >
          <span className="text-xs text-slate-400">
            {selectedItems.length} medicine
            {selectedItems.length !== 1 ? "s" : ""} selected
          </span>
          <span className="text-sm font-bold" style={{ color: "#6EE7B7" }}>
            Total: {grandTotal.toFixed(0)} EGP
          </span>
        </div>
      )}

      {error && (
        <p
          className="text-xs"
          style={{ color: "#FCA5A5" }}
          data-ocid="predictions.add_invoice.error_state"
        >
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor: canSubmit ? "#10B981" : "#1E293B",
            color: canSubmit ? "#fff" : "#475569",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
          data-ocid="predictions.add_invoice.submit_button"
        >
          Generate Invoice
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          style={{ border: "1px solid #334155" }}
          data-ocid="predictions.add_invoice.cancel_button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Customer Row ────────────────────────────────────────────────────────────────────────────────────
function CustomerRow({
  customer,
  index,
  isExpanded,
  onToggle,
}: {
  customer: Customer;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { toggleAtRisk, toggleFrequentBuyer } = usePharmacy();
  const tag = getPredictionTag(customer);
  const totalSpend = getTotalSpend(customer);
  const profit = getProfit(customer);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceSuccess, setInvoiceSuccess] = useState<number | null>(null);

  function handleInvoiceSuccess(total: number) {
    setInvoiceSuccess(total);
    setShowInvoiceForm(false);
    setTimeout(() => setInvoiceSuccess(null), 3500);
  }

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        border: isExpanded ? `1px solid ${tag.border}` : "1px solid #334155",
        backgroundColor: isExpanded ? "#0F172A" : "#1E293B",
      }}
      data-ocid={`predictions.item.${index + 1}`}
    >
      {/* Row header — clickable */}
      <button
        type="button"
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-800/40 transition-colors"
        onClick={onToggle}
        data-ocid={`predictions.customer.button.${index + 1}`}
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{
            background: customer.isAtRisk
              ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)"
              : customer.frequentBuyer || customer.purchaseHistory.length >= 3
                ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          }}
        >
          {customer.name.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-100 truncate">
            {customer.name}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {customer.purchaseHistory.length} invoice
            {customer.purchaseHistory.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Prediction tag */}
        <PredictionBadge tag={tag} />

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6 text-right">
          <div>
            <div className="text-xs text-slate-500">Total Spend</div>
            <div className="text-sm font-bold" style={{ color: "#6EE7B7" }}>
              {totalSpend > 0 ? `${totalSpend.toFixed(0)} EGP` : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Profit</div>
            <div className="text-sm font-bold" style={{ color: "#A78BFA" }}>
              {profit > 0 ? `${profit.toFixed(0)} EGP` : "—"}
            </div>
          </div>
        </div>

        {/* Expand icon */}
        <div className="text-slate-500 shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-5 pb-6 pt-2 space-y-5"
              style={{ borderTop: "1px solid #334155" }}
            >
              {/* CustomerInvoice component */}
              <CustomerInvoice
                customer={customer}
                onToggleAtRisk={toggleAtRisk}
              />

              {/* Toggle frequent buyer */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleFrequentBuyer(customer.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    border: customer.frequentBuyer
                      ? "1px solid #6EE7B7"
                      : "1px solid #F59E0B",
                    color: customer.frequentBuyer ? "#6EE7B7" : "#FDE68A",
                    background: "transparent",
                  }}
                  data-ocid={`predictions.frequent_buyer.toggle.${index + 1}`}
                >
                  <Star className="w-3 h-3" />
                  {customer.frequentBuyer
                    ? "Remove Frequent Buyer"
                    : "Mark as Frequent Buyer"}
                </button>
              </div>

              {/* Add Invoice section */}
              {invoiceSuccess !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: "#052e16",
                    border: "1px solid #10B981",
                  }}
                  data-ocid="predictions.add_invoice.success_state"
                >
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: "#10B981" }}
                  />
                  <span className="text-sm" style={{ color: "#6EE7B7" }}>
                    Invoice created successfully — Total:{" "}
                    <strong>{invoiceSuccess.toFixed(0)} EGP</strong>
                  </span>
                </motion.div>
              )}

              {!showInvoiceForm && invoiceSuccess === null && (
                <button
                  type="button"
                  onClick={() => setShowInvoiceForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: "#1E3A5F",
                    color: "#60A5FA",
                    border: "1px solid #2563EB",
                  }}
                  data-ocid={`predictions.add_invoice.open_modal_button.${index + 1}`}
                >
                  <Plus className="w-4 h-4" />
                  Add New Invoice
                </button>
              )}

              {showInvoiceForm && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #2563EB",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="w-4 h-4" style={{ color: "#60A5FA" }} />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#93C5FD" }}
                    >
                      New Invoice for {customer.name}
                    </span>
                  </div>
                  <InlineInvoiceForm
                    customerName={customer.name}
                    onSuccess={handleInvoiceSuccess}
                    onCancel={() => setShowInvoiceForm(false)}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────────────────────
export function CustomerPredictions() {
  const { customers } = usePharmacy();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<
    "all" | "high-risk" | "frequent" | "promotion"
  >("all");

  const highRiskCount = useMemo(
    () => customers.filter((c) => c.isAtRisk).length,
    [customers],
  );
  const frequentCount = useMemo(
    () =>
      customers.filter(
        (c) =>
          !c.isAtRisk && (c.frequentBuyer || c.purchaseHistory.length >= 3),
      ).length,
    [customers],
  );
  const promotionCount = useMemo(
    () =>
      customers.filter(
        (c) => !c.isAtRisk && !c.frequentBuyer && c.purchaseHistory.length < 3,
      ).length,
    [customers],
  );

  const totalRevenue = useMemo(
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

  const filteredCustomers = useMemo(() => {
    if (filterTag === "all") return customers;
    return customers.filter((c) => {
      const tag = getPredictionTag(c);
      if (filterTag === "high-risk") return tag.label === "High Risk";
      if (filterTag === "frequent") return tag.label === "Frequent Buyer";
      if (filterTag === "promotion")
        return tag.label === "Potential for Promotion";
      return true;
    });
  }, [customers, filterTag]);

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="min-h-screen p-6 space-y-6"
      style={{ backgroundColor: "#0F172A" }}
      data-ocid="predictions.page"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
          }}
        >
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-100">
            Customer Predictions
          </h2>
          <p className="text-sm text-slate-400">
            AI-powered behavioral insights —{" "}
            <span className="text-slate-300 font-medium">
              {customers.length} customer{customers.length !== 1 ? "s" : ""}{" "}
              analyzed
            </span>
          </p>
        </div>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: "#4C1D95",
            color: "#C4B5FD",
            border: "1px solid #7C3AED",
          }}
        >
          <Sparkles className="w-3 h-3" />🤖 AI Behavioral Analysis
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div
        className="grid grid-cols-2 xl:grid-cols-5 gap-4"
        data-ocid="predictions.panel"
      >
        <KpiCard
          label="Total Customers"
          value={customers.length}
          sub="Customers tracked"
          accent="#818CF8"
          icon={<Users className="w-4 h-4" />}
        />
        <KpiCard
          label="High Risk"
          value={highRiskCount}
          sub="Churn risk detected"
          accent="#FCA5A5"
          icon={<ShieldAlert className="w-4 h-4" />}
        />
        <KpiCard
          label="Frequent Buyers"
          value={frequentCount}
          sub="Regular purchasers"
          accent="#FDE68A"
          icon={<Star className="w-4 h-4" />}
        />
        <KpiCard
          label="Promotion Candidates"
          value={promotionCount}
          sub="Ready to be engaged"
          accent="#6EE7B7"
          icon={<Target className="w-4 h-4" />}
        />
        <KpiCard
          label="Total Revenue"
          value={
            totalRevenue > 0
              ? `${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} EGP`
              : "0 EGP"
          }
          sub="From tracked purchases"
          accent="#A78BFA"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2" data-ocid="predictions.filter.tab">
        {(
          [
            { key: "all", label: "All Customers", color: "#818CF8" },
            { key: "high-risk", label: "⚠️ High Risk", color: "#FCA5A5" },
            { key: "frequent", label: "⭐ Frequent Buyers", color: "#FDE68A" },
            {
              key: "promotion",
              label: "🎯 Promotion Candidates",
              color: "#6EE7B7",
            },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilterTag(f.key)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              backgroundColor: filterTag === f.key ? "#1E293B" : "transparent",
              color: filterTag === f.key ? f.color : "#64748B",
              border:
                filterTag === f.key
                  ? `1px solid ${f.color}`
                  : "1px solid #334155",
            }}
            data-ocid={`predictions.${f.key}.tab`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Customer List ── */}
      {customers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: "#1E293B", border: "1px solid #334155" }}
          data-ocid="predictions.empty_state"
        >
          <Brain className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-300 mb-1">
            No customers yet
          </h3>
          <p className="text-sm text-slate-500">
            Create invoices from the Customers or Create Invoice pages to see
            AI-powered predictions here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {/* Section heading */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: "#6366F1" }} />
            <h3 className="text-sm font-semibold text-slate-300">
              Behavioral Predictions
            </h3>
            <span
              className="ml-auto text-xs text-slate-500"
              data-ocid="predictions.list"
            >
              Showing {filteredCustomers.length} of {customers.length}
            </span>
          </div>

          {filteredCustomers.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
              }}
              data-ocid="predictions.filter.empty_state"
            >
              <p className="text-sm text-slate-500">
                No customers match the selected filter.
              </p>
            </div>
          ) : (
            filteredCustomers.map((customer, i) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
                index={i}
                isExpanded={expandedId === customer.id}
                onToggle={() => handleToggle(customer.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
