import type { Invoice, MedicineEntry } from "@/context/PharmacyContext";

const HIGH_DEMAND_THRESHOLD = 20;
const LOW_SALES_THRESHOLD = 5;
const NEAR_EXPIRY_DAYS = 30;

export type TopSellingEntry = {
  medicineId: string;
  medicineName: string;
  totalSold: number;
};

export type SmartRecommendation = {
  type: "high-demand" | "low-sales" | "near-expiry";
  medicineName: string;
  message: string;
};

export function computeTopSelling(
  invoices: Invoice[],
  topN = 5,
): TopSellingEntry[] {
  const totals = invoices
    .flatMap((inv) => inv.items)
    .reduce<Record<string, { name: string; qty: number }>>((acc, item) => {
      if (!acc[item.medicineId]) {
        acc[item.medicineId] = { name: item.medicineName, qty: 0 };
      }
      acc[item.medicineId].qty += item.qty;
      return acc;
    }, {});

  return Object.entries(totals)
    .map(([id, data]) => ({
      medicineId: id,
      medicineName: data.name,
      totalSold: data.qty,
    }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, topN);
}

export function computeTotalProfit(invoices: Invoice[]): number {
  const allItems = invoices.flatMap((inv) => inv.items);
  console.log(
    "[PharmaSmart] computeTotalProfit — invoice count:",
    invoices.length,
    "item count:",
    allItems.length,
  );
  if (allItems.length > 0) {
    console.log("[PharmaSmart] Sample item:", allItems[0]);
  }
  return allItems.reduce((total, item) => {
    const sellingPrice =
      item.unitPrice ?? (item as Record<string, unknown>).sellingPrice ?? 0;
    const costPrice = item.costPrice ?? 0;
    const qty = item.qty ?? 0;
    const profit =
      ((sellingPrice as number) - (costPrice as number)) * (qty as number);
    return total + profit;
  }, 0);
}

export function computeSmartRecommendations(
  medicines: MedicineEntry[],
  invoices: Invoice[],
): SmartRecommendation[] {
  const today = new Date();

  const soldMap = invoices
    .flatMap((inv) => inv.items)
    .reduce<Record<string, number>>((acc, item) => {
      acc[item.medicineId] = (acc[item.medicineId] ?? 0) + item.qty;
      return acc;
    }, {});

  const recommendations: SmartRecommendation[] = [];

  for (const med of medicines) {
    const sold = soldMap[med.id] ?? 0;

    if (sold >= HIGH_DEMAND_THRESHOLD) {
      recommendations.push({
        type: "high-demand",
        medicineName: med.name,
        message: `Increase stock for ${med.name} due to high demand`,
      });
    } else if (sold > 0 && sold <= LOW_SALES_THRESHOLD) {
      recommendations.push({
        type: "low-sales",
        medicineName: med.name,
        message: `Consider promotion for ${med.name} to boost sales`,
      });
    }

    if (med.expiryDate) {
      const daysUntilExpiry = Math.ceil(
        (med.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilExpiry > 0 && daysUntilExpiry <= NEAR_EXPIRY_DAYS) {
        recommendations.push({
          type: "near-expiry",
          medicineName: med.name,
          message: `Apply discount on ${med.name} before expiry (${daysUntilExpiry} days left)`,
        });
      }
    }
  }

  return recommendations;
}
