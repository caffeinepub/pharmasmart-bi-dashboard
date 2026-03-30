import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePharmacy } from "@/context/PharmacyContext";
import type { InvoiceItem } from "@/context/PharmacyContext";
import { CheckCircle, FileText } from "lucide-react";
import { useMemo, useState } from "react";

export function CreateInvoice() {
  const { medicines, createInvoice } = usePharmacy();
  const [customerName, setCustomerName] = useState("");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [qtyErrors, setQtyErrors] = useState<Record<string, string>>({});

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
              Customer Name{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="customer-name"
              data-ocid="create_invoice.input"
              placeholder="e.g. Ahmed Hassan (leave blank for walk-in)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
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
