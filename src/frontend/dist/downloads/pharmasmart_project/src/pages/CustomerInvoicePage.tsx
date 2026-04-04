import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePharmacy } from "@/context/PharmacyContext";
import type { InvoiceItem } from "@/context/PharmacyContext";
import { CheckCircle, FileText, Pill } from "lucide-react";
import { useMemo, useState } from "react";

interface CustomerInvoicePageProps {
  onBack: () => void;
}

export function CustomerInvoicePage({ onBack }: CustomerInvoicePageProps) {
  const { medicines, createInvoice } = usePharmacy();
  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
          costPrice: med.costPrice ?? Math.round(med.price * 0.65),
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
        errs[it.medicineId] = `Max available: ${it.maxStock}`;
      }
    }
    return errs;
  }, [selectedItems]);

  const canSubmit =
    customerName.trim().length > 0 &&
    selectedItems.length > 0 &&
    Object.keys(overStockErrors).length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim()) {
      setNameError("Please enter your name to continue.");
      return;
    }
    if (!canSubmit) return;
    createInvoice(
      selectedItems.map(
        ({
          medicineId,
          medicineName,
          qty,
          unitPrice,
          costPrice,
          subtotal,
        }) => ({
          medicineId,
          medicineName,
          qty,
          unitPrice,
          costPrice,
          subtotal,
        }),
      ),
      customerName.trim(),
    );
    setSuccessMsg(
      `Invoice created for ${customerName.trim()} — ${selectedItems.length} item(s) · Total: ${grandTotal.toFixed(2)} EGP`,
    );
    setSubmitted(true);
    setQuantities({});
  }

  function handleNewInvoice() {
    setSuccessMsg("");
    setSubmitted(false);
    setCustomerName("");
    setQuantities({});
    setNameError("");
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "#1E293B", backgroundColor: "#0F172A" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            }}
          >
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">
              PharmaSmart
            </div>
            <div className="text-xs" style={{ color: "#64748B" }}>
              Customer Portal
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "#64748B", border: "1px solid #1E293B" }}
        >
          ← Back
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          {/* Welcome card */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: "linear-gradient(135deg, #1E3A5F 0%, #1E293B 100%)",
              border: "1px solid #3B82F6",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
              }}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              Welcome to PharmaSmart
            </h1>
            <p style={{ color: "#94A3B8" }} className="text-sm">
              Enter your name to create your invoice
            </p>
          </div>

          {/* Success state */}
          {submitted && (
            <div
              className="rounded-xl p-5 space-y-4"
              style={{ background: "#022C22", border: "1px solid #10B981" }}
            >
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: "#10B981" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#6EE7B7" }}
                  >
                    Invoice created successfully!
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#4ADE80" }}>
                    {successMsg}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleNewInvoice}
                className="w-full"
                style={{
                  background:
                    "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
                  color: "#fff",
                }}
              >
                Create Another Invoice
              </Button>
            </div>
          )}

          {!submitted && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Name */}
              <div
                className="rounded-xl p-5 border space-y-3"
                style={{
                  backgroundColor: "#1E293B",
                  borderColor: nameError ? "#EF4444" : "#334155",
                }}
              >
                <Label
                  htmlFor="cust-name"
                  className="text-sm font-semibold"
                  style={{ color: "#E2E8F0" }}
                >
                  Your Name <span style={{ color: "#EF4444" }}>*</span>
                </Label>
                <Input
                  id="cust-name"
                  placeholder="e.g. Ahmed Hassan"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                  }}
                  className="text-sm"
                  style={{
                    backgroundColor: "#0F172A",
                    borderColor: nameError ? "#EF4444" : "#334155",
                    color: "#F1F5F9",
                  }}
                />
                {nameError && (
                  <p className="text-xs" style={{ color: "#FCA5A5" }}>
                    {nameError}
                  </p>
                )}
              </div>

              {/* Medicine Table */}
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  backgroundColor: "#1E293B",
                  borderColor: "#334155",
                }}
              >
                <div
                  className="px-5 py-3 border-b"
                  style={{ borderColor: "#334155" }}
                >
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "#E2E8F0" }}
                  >
                    Select Medicines
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                    Enter quantity for the medicines you want to purchase
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="border-b"
                        style={{ borderColor: "#334155" }}
                      >
                        {["Medicine", "Category", "Price", "Stock", "Qty"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left py-2.5 px-4 text-xs font-medium uppercase tracking-wide"
                              style={{ color: "#64748B" }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((med) => {
                        const hasErr = !!overStockErrors[med.id];
                        return (
                          <tr
                            key={med.id}
                            className="border-b transition-colors"
                            style={{
                              borderColor: "#1E293B",
                            }}
                          >
                            <td
                              className="py-3 px-4 font-medium"
                              style={{ color: "#F1F5F9" }}
                            >
                              {med.name}
                            </td>
                            <td
                              className="py-3 px-4 text-xs"
                              style={{ color: "#64748B" }}
                            >
                              {med.category}
                            </td>
                            <td
                              className="py-3 px-4 font-mono"
                              style={{ color: "#E2E8F0" }}
                            >
                              {med.price.toFixed(2)} EGP
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className="font-mono font-medium text-sm"
                                style={{
                                  color:
                                    med.stock === 0
                                      ? "#F87171"
                                      : med.stock <= med.reorderPoint
                                        ? "#FBBF24"
                                        : "#34D399",
                                }}
                              >
                                {med.stock === 0 ? "Out of stock" : med.stock}
                              </span>
                            </td>
                            <td className="py-3 px-4 w-28">
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
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [med.id]: e.target.value,
                                    }))
                                  }
                                  className="h-8 w-20 text-sm"
                                  style={{
                                    backgroundColor: "#0F172A",
                                    borderColor: hasErr ? "#EF4444" : "#334155",
                                    color: "#F1F5F9",
                                  }}
                                />
                                {hasErr && (
                                  <span
                                    className="text-xs"
                                    style={{ color: "#FCA5A5" }}
                                  >
                                    {overStockErrors[med.id]}
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

              {/* Invoice Summary */}
              {selectedItems.length > 0 && (
                <div
                  className="rounded-xl p-5 border space-y-3"
                  style={{
                    backgroundColor: "#1E293B",
                    borderColor: "#334155",
                  }}
                >
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "#E2E8F0" }}
                  >
                    Invoice Summary
                  </h3>
                  {customerName.trim() && (
                    <div
                      className="text-xs pb-2 border-b"
                      style={{ color: "#94A3B8", borderColor: "#334155" }}
                    >
                      Customer:{" "}
                      <span
                        className="font-semibold"
                        style={{ color: "#E2E8F0" }}
                      >
                        {customerName.trim()}
                      </span>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {selectedItems.map((it) => (
                      <div
                        key={it.medicineId}
                        className="flex justify-between text-sm"
                      >
                        <span style={{ color: "#94A3B8" }}>
                          {it.medicineName} × {it.qty}
                        </span>
                        <span
                          className="font-mono"
                          style={{ color: "#E2E8F0" }}
                        >
                          {it.subtotal.toFixed(2)} EGP
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="border-t pt-3 flex justify-between items-center"
                    style={{ borderColor: "#334155" }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#E2E8F0" }}
                    >
                      Grand Total
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#10B981" }}
                    >
                      {grandTotal.toFixed(2)} EGP
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3 text-sm font-semibold"
                style={{
                  background: canSubmit
                    ? "linear-gradient(135deg, #10B981 0%, #0D9488 100%)"
                    : undefined,
                  color: "#fff",
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                {!customerName.trim()
                  ? "Enter your name to continue"
                  : selectedItems.length === 0
                    ? "Select at least one medicine"
                    : `Generate Invoice · ${grandTotal.toFixed(2)} EGP`}
              </Button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-4 text-xs border-t"
        style={{ borderColor: "#1E293B", color: "#334155" }}
      >
        PharmaSmart — Pharmacy Management System · Graduation Project 2025
      </footer>
    </div>
  );
}
