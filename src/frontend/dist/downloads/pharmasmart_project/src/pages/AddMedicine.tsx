import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePharmacy } from "@/context/PharmacyContext";
import { CheckCircle, Package, PlusCircle } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["Antibiotic", "Painkiller", "Vitamin", "Cold & Flu"];

export function AddMedicine() {
  const { addMedicine } = usePharmacy();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Medicine name is required.";
    if (!category) errs.category = "Please select a category.";
    const priceNum = Number.parseFloat(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0)
      errs.price = "Enter a valid price greater than 0.";
    const stockNum = Number.parseInt(stock, 10);
    if (!stock || Number.isNaN(stockNum) || stockNum < 1)
      errs.stock = "Enter a valid quantity (minimum 1).";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    addMedicine({
      name: name.trim(),
      category,
      price: Number.parseFloat(price),
      stock: Number.parseInt(stock, 10),
    });
    setSuccessMsg(
      `${name.trim()} has been added to inventory and is now reflected in all dashboard sections.`,
    );
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setErrors({});
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl" data-ocid="add_medicine.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)",
          }}
        >
          <PlusCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Add New Medicine
          </h2>
          <p className="text-sm text-muted-foreground">
            Add a medicine to inventory — it will appear instantly in all
            analysis, predictions, and dashboards.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: "#091220", border: "1px solid #6366F1" }}
      >
        <Package
          className="w-4 h-4 shrink-0 mt-0.5"
          style={{ color: "#818CF8" }}
        />
        <p className="text-sm" style={{ color: "#A5B4FC" }}>
          Once submitted, the new medicine will automatically appear in the
          Inventory tracker, Predictions forecast table, and Overview dashboard.
          Stock levels and KPIs will update in real time.
        </p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: "#022C22", border: "1px solid #10B981" }}
          data-ocid="add_medicine.success_state"
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl p-6 border border-border space-y-5"
        noValidate
      >
        {/* Medicine Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="medicine-name"
            className="text-sm font-medium text-foreground"
          >
            Medicine Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="medicine-name"
            data-ocid="add_medicine.input"
            placeholder="e.g. Amoxicillin 500mg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p
              className="text-xs text-red-400"
              data-ocid="add_medicine.name_error"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">
            Category <span className="text-red-400">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              data-ocid="add_medicine.select"
              className={errors.category ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p
              className="text-xs text-red-400"
              data-ocid="add_medicine.category_error"
            >
              {errors.category}
            </p>
          )}
        </div>

        {/* Price & Stock row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="medicine-price"
              className="text-sm font-medium text-foreground"
            >
              Price per Unit (EGP) <span className="text-red-400">*</span>
            </Label>
            <Input
              id="medicine-price"
              data-ocid="add_medicine.price.input"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p
                className="text-xs text-red-400"
                data-ocid="add_medicine.price_error"
              >
                {errors.price}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="medicine-stock"
              className="text-sm font-medium text-foreground"
            >
              Quantity in Stock <span className="text-red-400">*</span>
            </Label>
            <Input
              id="medicine-stock"
              data-ocid="add_medicine.stock.input"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 100"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={errors.stock ? "border-red-500" : ""}
            />
            {errors.stock && (
              <p
                className="text-xs text-red-400"
                data-ocid="add_medicine.stock_error"
              >
                {errors.stock}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          data-ocid="add_medicine.submit_button"
          className="w-full"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)",
            color: "#fff",
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add to Inventory
        </Button>
      </form>
    </div>
  );
}
