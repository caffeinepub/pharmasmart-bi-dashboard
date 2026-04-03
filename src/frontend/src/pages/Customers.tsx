import { CustomerInvoice } from "@/components/CustomerInvoice";
import { CustomerList } from "@/components/CustomerList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePharmacy } from "@/context/PharmacyContext";
import type { InvoiceItem } from "@/context/PharmacyContext";
import {
  BookUser,
  ChevronDown,
  ChevronUp,
  FileText,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─── Inline Invoice Form ─────────────────────────────────────────────────────
interface InlineInvoiceFormProps {
  prefilledName?: string;
  onSuccess: (name: string, total: number) => void;
  onCancel: () => void;
}

function InlineInvoiceForm({
  prefilledName = "",
  onSuccess,
  onCancel,
}: InlineInvoiceFormProps) {
  const { medicines, customers, createInvoice } = usePharmacy();
  const [customerName, setCustomerName] = useState(prefilledName);
  const [customerNameError, setCustomerNameError] = useState("");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [nameError, setNameError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const q = customerName.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return customers
      .filter((c) => c.name.toLowerCase().startsWith(q))
      .slice(0, 5);
  }, [customers, customerName]);

  const matchingCustomer = useMemo(() => {
    const q = customerName.trim().toLowerCase();
    if (!q) return null;
    return customers.find((c) => c.name.toLowerCase() === q) ?? null;
  }, [customers, customerName]);

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
    if (!customerName.trim()) {
      setNameError("Customer name is required.");
      setCustomerNameError("Customer name is required.");
      return;
    }
    if (!canSubmit) return;
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
      customerName.trim(),
    );
    onSuccess(customerName.trim(), grandTotal);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer name */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-foreground">
          Customer Name <span className="text-red-400">*</span>
        </Label>
        <div className="relative">
          <Input
            placeholder="e.g. Ahmed Hassan"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setNameError("");
              setCustomerNameError("");
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
            className={nameError || customerNameError ? "border-red-500" : ""}
            data-ocid="customers.add_form.input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute z-20 w-full mt-1 rounded-lg overflow-hidden shadow-lg"
              style={{
                backgroundColor: "#0F172A",
                border: "1px solid #1E293B",
              }}
            >
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40 transition-colors"
                  onMouseDown={() => {
                    setCustomerName(s.name);
                    setShowSuggestions(false);
                  }}
                >
                  <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground">{s.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {s.purchaseHistory.length} invoice
                    {s.purchaseHistory.length !== 1 ? "s" : ""}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        {(nameError || customerNameError) && (
          <p
            className="text-xs text-red-400"
            data-ocid="customers.add_form.name_error"
          >
            {nameError || customerNameError}
          </p>
        )}
        {customerName.trim() && (
          <div className="mt-1">
            {matchingCustomer ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "#0F2744", color: "#6EE7B7" }}
              >
                <User className="w-3 h-3" />
                Returning customer — {matchingCustomer.purchaseHistory.length}{" "}
                prior invoice
                {matchingCustomer.purchaseHistory.length !== 1 ? "s" : ""}
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "#0F2744", color: "#93C5FD" }}
              >
                <UserPlus className="w-3 h-3" />
                New customer
              </span>
            )}
            {matchingCustomer?.isAtRisk && (
              <span
                className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#7F1D1D", color: "#FCA5A5" }}
              >
                <ShieldAlert className="w-3 h-3" />
                At Risk
              </span>
            )}
          </div>
        )}
      </div>

      {/* Medicine table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: "1px solid #1E293B" }}
      >
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            data-ocid="customers.add_form.table"
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #1E293B",
                  backgroundColor: "#0D1B34",
                }}
              >
                {["Medicine", "Price", "Stock", "Qty"].map((h) => (
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
              {medicines.map((med, i) => {
                const hasErr = !!overStockErrors[med.id];
                return (
                  <tr
                    key={med.id}
                    className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                    data-ocid={`customers.add_form.item.${i + 1}`}
                  >
                    <td className="py-2 px-3 font-medium text-foreground text-xs">
                      {med.name}
                    </td>
                    <td className="py-2 px-3 font-mono text-xs text-muted-foreground">
                      {med.price} EGP
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`font-mono text-xs font-medium ${
                          med.stock === 0
                            ? "text-red-400"
                            : med.stock <= med.reorderPoint
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {med.stock}
                      </span>
                    </td>
                    <td className="py-2 px-3 w-24">
                      <Input
                        type="number"
                        min="0"
                        max={med.stock}
                        step="1"
                        placeholder="0"
                        disabled={med.stock === 0}
                        value={quantities[med.id] ?? ""}
                        onChange={(e) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [med.id]: e.target.value,
                          }))
                        }
                        className={`h-7 w-20 text-xs ${
                          hasErr ? "border-red-500" : ""
                        }`}
                        data-ocid={`customers.add_form.qty.input.${i + 1}`}
                      />
                      {overStockErrors[med.id] && (
                        <span className="text-xs text-red-400 block mt-0.5">
                          {overStockErrors[med.id]}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total */}
      {selectedItems.length > 0 && (
        <div
          className="rounded-lg p-3 flex items-center justify-between text-sm"
          style={{ backgroundColor: "#0A1F16", border: "1px solid #064E3B" }}
        >
          <span className="text-muted-foreground">
            {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <span className="font-bold font-mono" style={{ color: "#10B981" }}>
            {grandTotal.toFixed(2)} EGP
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: canSubmit
              ? "linear-gradient(135deg, #10B981 0%, #0D9488 100%)"
              : "#1E293B",
            color: canSubmit ? "#fff" : "#475569",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
          data-ocid="customers.add_form.submit_button"
        >
          <FileText className="w-4 h-4" />
          {selectedItems.length === 0
            ? "Select medicines to continue"
            : `Create Invoice · ${grandTotal.toFixed(2)} EGP`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted/30"
          style={{ border: "1px solid #1E293B", color: "#94A3B8" }}
          data-ocid="customers.add_form.cancel_button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main Customers Page ──────────────────────────────────────────────────────
export function Customers() {
  const { customers, toggleAtRisk, deleteCustomer } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormPrefilledName, setAddFormPrefilledName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // Inline invoice forms per customer
  const [inlineFormCustomerId, setInlineFormCustomerId] = useState<
    string | null
  >(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, searchQuery]);

  const atRiskCount = customers.filter((c) => c.isAtRisk).length;

  const avgInvoices =
    customers.length > 0
      ? (
          customers.reduce((s, c) => s + c.purchaseHistory.length, 0) /
          customers.length
        ).toFixed(1)
      : "0";

  function getLastPurchase(customerId: string): string {
    const c = customers.find((x) => x.id === customerId);
    if (!c || c.purchaseHistory.length === 0) return "—";
    return c.purchaseHistory[c.purchaseHistory.length - 1].date;
  }

  function getTotalQty(customerId: string): number {
    const c = customers.find((x) => x.id === customerId);
    if (!c) return 0;
    return c.purchaseHistory.reduce(
      (sum, p) => sum + p.medicines.reduce((s, m) => s + m.quantity, 0),
      0,
    );
  }

  function handleAddFormSuccess(name: string, total: number) {
    setSuccessMsg(
      `✓ Invoice created for ${name} · Total: ${total.toFixed(2)} EGP`,
    );
    setShowAddForm(false);
    setAddFormPrefilledName("");
    setTimeout(() => setSuccessMsg(""), 5000);
  }

  function handleInlineSuccess(name: string, total: number) {
    setSuccessMsg(
      `✓ Invoice added for ${name} · Total: ${total.toFixed(2)} EGP`,
    );
    setInlineFormCustomerId(null);
    setTimeout(() => setSuccessMsg(""), 5000);
  }

  function openAddFormWithName(name: string) {
    setAddFormPrefilledName(name);
    setShowAddForm(true);
    setSearchQuery("");
  }

  return (
    <div className="p-6 space-y-6" data-ocid="customers.page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Customer Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Track purchase history, at-risk status, and customer insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          {atRiskCount > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: "#7F1D1D",
                color: "#FCA5A5",
                border: "1px solid #991B1B",
              }}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {atRiskCount} at-risk customer{atRiskCount !== 1 ? "s" : ""}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setShowAddForm((prev) => !prev);
              setAddFormPrefilledName("");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: showAddForm
                ? "#1E293B"
                : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              color: showAddForm ? "#94A3B8" : "#fff",
            }}
            data-ocid="customers.add_form.open_modal_button"
          >
            {showAddForm ? (
              <>
                <X className="w-4 h-4" />
                Close
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Customer / Invoice
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div
          className="rounded-xl p-3.5 flex items-center gap-3"
          style={{ background: "#022C22", border: "1px solid #10B981" }}
          data-ocid="customers.success_state"
        >
          <span className="text-sm font-medium" style={{ color: "#6EE7B7" }}>
            {successMsg}
          </span>
        </div>
      )}

      {/* Add Customer / Invoice Panel */}
      {showAddForm && (
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ backgroundColor: "#0D1B34", border: "1px solid #1E3A5F" }}
          data-ocid="customers.add_form.panel"
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              }}
            >
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Add Customer / Invoice
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter existing customer name to add invoice, or new name to
                create customer
              </p>
            </div>
          </div>
          <InlineInvoiceForm
            prefilledName={addFormPrefilledName}
            onSuccess={handleAddFormSuccess}
            onCancel={() => {
              setShowAddForm(false);
              setAddFormPrefilledName("");
            }}
          />
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#0D1B34", border: "1px solid #1E3A5F" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#1E3A5F" }}
          >
            <Users className="w-5 h-5" style={{ color: "#60A5FA" }} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Total Customers
            </div>
            <div className="text-2xl font-bold text-foreground">
              {customers.length}
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            backgroundColor: atRiskCount > 0 ? "#1A0707" : "#0A1F16",
            border: `1px solid ${atRiskCount > 0 ? "#7F1D1D" : "#064E3B"}`,
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: atRiskCount > 0 ? "#7F1D1D" : "#064E3B" }}
          >
            <ShieldAlert
              className="w-5 h-5"
              style={{ color: atRiskCount > 0 ? "#FCA5A5" : "#6EE7B7" }}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              At-Risk
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: atRiskCount > 0 ? "#EF4444" : "#10B981" }}
            >
              {atRiskCount}
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#13091F", border: "1px solid #4C1D95" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#4C1D95" }}
          >
            <Users className="w-5 h-5" style={{ color: "#C4B5FD" }} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Avg Invoices
            </div>
            <div className="text-2xl font-bold" style={{ color: "#A78BFA" }}>
              {avgInvoices}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          data-ocid="customers.search_input"
        />
      </div>

      {/* Customer List */}
      {customers.length === 0 ? (
        <div
          className="bg-card rounded-xl p-12 border border-border text-center"
          data-ocid="customers.empty_state"
        >
          <Users
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "#334155" }}
          />
          <p className="text-base font-semibold text-foreground mb-1">
            No customers yet.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Create an invoice to get started — customers are tracked
            automatically.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              color: "#fff",
            }}
            data-ocid="customers.empty.add_button"
          >
            <Plus className="w-4 h-4" />
            Add First Customer
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="bg-card rounded-xl p-8 border border-border text-center space-y-3"
          data-ocid="customers.search.empty_state"
        >
          <p className="text-sm text-muted-foreground">
            No customers found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => openAddFormWithName(searchQuery)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              color: "#fff",
            }}
            data-ocid="customers.create_new.button"
          >
            <UserPlus className="w-4 h-4" />
            Create customer &quot;{searchQuery}&quot;
          </button>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="customers.list">
          {filtered.map((customer, idx) => {
            const isExpanded = expandedId === customer.id;
            const totalQty = getTotalQty(customer.id);
            const lastPurchase = getLastPurchase(customer.id);
            const showInlineForm = inlineFormCustomerId === customer.id;
            return (
              <div
                key={customer.id}
                className="rounded-xl overflow-hidden border transition-all"
                style={{
                  borderColor: customer.isAtRisk ? "#7F1D1D" : "var(--border)",
                  backgroundColor: customer.isAtRisk
                    ? "rgba(127, 29, 29, 0.08)"
                    : "var(--card)",
                }}
                data-ocid={`customers.item.${idx + 1}`}
              >
                {/* Customer Row */}
                <button
                  type="button"
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                  data-ocid={`customers.expand.button.${idx + 1}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{
                      background: customer.isAtRisk
                        ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)"
                        : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                    }}
                  >
                    {customer.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">
                        {customer.name}
                      </span>
                      {customer.isAtRisk && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: "#7F1D1D",
                            color: "#FCA5A5",
                          }}
                        >
                          <ShieldAlert className="w-3 h-3" />
                          At Risk
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Last purchase: {lastPurchase}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">
                        {customer.purchaseHistory.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Invoices
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">
                        {totalQty}
                      </div>
                      <div className="text-xs text-muted-foreground">Units</div>
                    </div>
                  </div>

                  {/* Expand icon */}
                  <div className="shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div
                    className="px-5 pb-5 border-t border-border"
                    style={{
                      borderColor: customer.isAtRisk
                        ? "rgba(127, 29, 29, 0.4)"
                        : undefined,
                    }}
                  >
                    <div className="pt-4 space-y-4">
                      <CustomerInvoice
                        customer={customer}
                        onToggleAtRisk={toggleAtRisk}
                      />

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {/* Add Invoice button / inline form */}
                        {showInlineForm ? (
                          <div
                            className="w-full rounded-xl p-4 space-y-3"
                            style={{
                              backgroundColor: "#0D1B34",
                              border: "1px solid #1E3A5F",
                            }}
                            data-ocid={`customers.inline_invoice_form.${idx + 1}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-foreground">
                                Add New Invoice for {customer.name}
                              </h4>
                              <button
                                type="button"
                                onClick={() => setInlineFormCustomerId(null)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                data-ocid={`customers.inline_invoice_form.close_button.${idx + 1}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <InlineInvoiceForm
                              prefilledName={customer.name}
                              onSuccess={handleInlineSuccess}
                              onCancel={() => setInlineFormCustomerId(null)}
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setInlineFormCustomerId(customer.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                            style={{
                              background:
                                "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
                              color: "#fff",
                            }}
                            data-ocid={`customers.add_invoice.button.${idx + 1}`}
                          >
                            <Plus className="w-4 h-4" />
                            Add Invoice
                          </button>
                        )}

                        {/* Delete Customer button */}
                        {!showInlineForm && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteCustomer(customer.id);
                              setExpandedId(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                            style={{
                              background: "#1A0707",
                              border: "1px solid #7F1D1D",
                              color: "#FCA5A5",
                            }}
                            data-ocid={`customers.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Customer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Customer Directory Section ─────────────────────────────────── */}
      <div className="pt-2">
        <div className="border-t border-border mb-6" />
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
            }}
          >
            <BookUser className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Customer Directory
            </h3>
            <p className="text-xs text-muted-foreground">
              Standalone reference list — add, search, or remove directory
              entries
            </p>
          </div>
        </div>
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#0D1B34", border: "1px solid #1E3A5F" }}
          data-ocid="customer_directory.panel"
        >
          <CustomerList />
        </div>
      </div>
    </div>
  );
}
