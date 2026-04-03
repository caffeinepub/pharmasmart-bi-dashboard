import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePharmacy } from "@/context/PharmacyContext";
import type { InvoiceItem } from "@/context/PharmacyContext";
import { AlertTriangle, CheckCircle, FileText, User } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export function CreateInvoice() {
  const { medicines, createInvoice, customers } = usePharmacy();
  const [customerName, setCustomerName] = useState("");
  const [customerNameError, setCustomerNameError] = useState("");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [qtyErrors, setQtyErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Autocomplete suggestions from existing customers
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
        errs[it.medicineId] = `Exceeds available stock (${it.maxStock})`;
      }
    }
    return errs;
  }, [selectedItems]);

  const canSubmit =
    selectedItems.length > 0 && Object.keys(overStockErrors).length === 0;

  function handleQtyChange(medicineId: string, value: string) {
    setQuantities((prev) => ({ ...prev, [medicineId]: value }));
    setQtyErrors((prev) => {
      const next = { ...prev };
      delete next[medicineId];
      return next;
    });
  }

  function handleCustomerNameChange(value: string) {
    setCustomerName(value);
    setCustomerNameError("");
    setShowSuggestions(true);
  }

  function handleSelectSuggestion(name: string) {
    setCustomerName(name);
    setShowSuggestions(false);
    nameInputRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim()) {
      setCustomerNameError("Customer name is required.");
      nameInputRef.current?.focus();
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
    setSuccessMsg(
      `Invoice created on ${new Date().toLocaleDateString()}. ${selectedItems.length} item(s) · Total: ${grandTotal.toFixed(2)} EGP`,
    );
    setCustomerName("");
    setQuantities({});
    setCustomerNameError("");
  }

  return (
    <div className="p-6 space-y-6" data-ocid="create_invoice.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
          }}
        >
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Create Invoice</h2>
          <p className="text-sm text-muted-foreground">
            Record a sale — stock is automatically reduced and KPIs updated.
          </p>
        </div>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: "#022C22", border: "1px solid #10B981" }}
          data-ocid="create_invoice.success_state"
        >
          <CheckCircle
            className="w-5 h-5 shrink-0"
            style={{ color: "#10B981" }}
          />
          <span className="text-sm font-medium" style={{ color: "#6EE7B7" }}>
            ✓ {successMsg}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div className="bg-card rounded-xl p-5 border border-border space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="customer-name"
              className="text-sm font-medium text-foreground"
            >
              Customer Name <span className="text-red-400 text-xs">*</span>
            </Label>
            <div className="relative">
              <Input
                id="customer-name"
                ref={nameInputRef}
                data-ocid="create_invoice.input"
                placeholder="e.g. Ahmed Hassan"
                value={customerName}
                onChange={(e) => handleCustomerNameChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => setShowSuggestions(true)}
                className={customerNameError ? "border-red-500" : ""}
                autoComplete="off"
              />
              {/* Autocomplete dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden shadow-lg"
                  style={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #1E293B",
                  }}
                  data-ocid="create_invoice.dropdown_menu"
                >
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40 transition-colors"
                      onMouseDown={() => handleSelectSuggestion(s.name)}
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

            {/* Validation error */}
            {customerNameError && (
              <p
                className="text-xs text-red-400"
                data-ocid="create_invoice.name_error"
              >
                {customerNameError}
              </p>
            )}

            {/* Returning / new customer hint */}
            {customerName.trim() && (
              <div className="mt-1">
                {matchingCustomer ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#1E1B4B", color: "#A78BFA" }}
                  >
                    <User className="w-3 h-3" />
                    Returning customer —{" "}
                    {matchingCustomer.purchaseHistory.length} prior invoice
                    {matchingCustomer.purchaseHistory.length !== 1 ? "s" : ""}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#022C22", color: "#6EE7B7" }}
                  >
                    <User className="w-3 h-3" />
                    New customer
                  </span>
                )}
              </div>
            )}

            {/* At-risk warning banner */}
            {matchingCustomer?.isAtRisk && (
              <div
                className="mt-2 rounded-xl p-3.5 flex items-start gap-3"
                style={{
                  backgroundColor: "#1A0707",
                  border: "1px solid #7F1D1D",
                }}
                data-ocid="create_invoice.at_risk.error_state"
              >
                <AlertTriangle
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "#EF4444" }}
                />
                <p className="text-sm" style={{ color: "#FCA5A5" }}>
                  ⚠️ This customer is flagged as <strong>At Risk</strong> —
                  review their purchase history before proceeding.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Medicine Selection */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Medicine Selection
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="create_invoice.table">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Medicine",
                    "Category",
                    "Unit Price",
                    "Available Stock",
                    "Qty",
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
                {medicines.map((med, i) => {
                  const hasErr =
                    !!overStockErrors[med.id] || !!qtyErrors[med.id];
                  return (
                    <tr
                      key={med.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      data-ocid={`create_invoice.item.${i + 1}`}
                    >
                      <td className="py-2.5 px-3 font-medium text-foreground">
                        {med.name}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground text-xs">
                        {med.category}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-foreground">
                        {med.price.toFixed(2)} EGP
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-mono font-medium ${
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
                      <td className="py-2.5 px-3 w-32">
                        <div className="flex flex-col gap-1">
                          <Input
                            type="number"
                            min="0"
                            max={med.stock}
                            step="1"
                            placeholder="0"
                            disabled={med.stock === 0}
                            value={quantities[med.id] ?? ""}
                            onChange={(e) =>
                              handleQtyChange(med.id, e.target.value)
                            }
                            className={`h-8 w-24 text-sm ${hasErr ? "border-red-500" : ""}`}
                            data-ocid={`create_invoice.qty.input.${i + 1}`}
                          />
                          {(overStockErrors[med.id] || qtyErrors[med.id]) && (
                            <span className="text-xs text-red-400">
                              {overStockErrors[med.id] ?? qtyErrors[med.id]}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Total */}
        {selectedItems.length > 0 && (
          <div
            className="bg-card rounded-xl p-5 border border-border space-y-3"
            data-ocid="create_invoice.panel"
          >
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Invoice Summary
            </h3>
            <div className="space-y-1.5">
              {selectedItems.map((it) => (
                <div
                  key={it.medicineId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {it.medicineName} × {it.qty}
                  </span>
                  <span className="font-mono text-foreground">
                    {it.subtotal.toFixed(2)} EGP
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground">
                Grand Total
              </span>
              <span className="text-lg font-bold" style={{ color: "#10B981" }}>
                {grandTotal.toFixed(2)} EGP
              </span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          data-ocid="create_invoice.submit_button"
          disabled={!canSubmit}
          className="w-full"
          style={{
            background: canSubmit
              ? "linear-gradient(135deg, #10B981 0%, #0D9488 100%)"
              : undefined,
            color: "#fff",
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          {selectedItems.length === 0
            ? "Select at least one medicine"
            : `Create Invoice · ${grandTotal.toFixed(2)} EGP`}
        </Button>
      </form>
    </div>
  );
}
