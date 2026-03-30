import { inventoryAlerts, medicineDemandForecast } from "@/data/pharmacyData";
import { createContext, useContext, useMemo, useState } from "react";

export type MedicineEntry = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  daysLeft: number;
  demandTier: "high" | "medium" | "low" | "new";
  trend: "up" | "stable" | "down";
  forecastUnits: number;
  whyTrend: string;
  addedAt?: Date;
  isUserAdded?: boolean;
};

export type InvoiceItem = {
  medicineId: string;
  medicineName: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
};

export type Invoice = {
  id: string;
  date: Date;
  customerName: string;
  items: InvoiceItem[];
  total: number;
};

const MEDICINE_PRICES: Record<string, number> = {
  "Amoxicillin 500mg": 50,
  "Paracetamol 500mg": 25,
  "Metformin 850mg": 45,
  "Vitamin C 1000mg": 30,
  "Atorvastatin 20mg": 120,
  "Ibuprofen 400mg": 35,
  "Oseltamivir 75mg": 180,
  "Vitamin D3 5000IU": 55,
  "Azithromycin 250mg": 95,
  "Chloroquine 250mg": 40,
  "Codeine Phosphate": 60,
  Amoxicillin: 50,
  Augmentin: 80,
  "Panadol Extra": 30,
  Brufen: 25,
};

function seedMedicines(): MedicineEntry[] {
  return medicineDemandForecast.map((m) => {
    const alert = inventoryAlerts.find((a) => a.name === m.name);
    const stock = alert ? alert.stock : m.currentStock;
    const reorderPoint = alert ? alert.reorder : Math.round(stock * 0.2);
    const daysLeft = alert ? alert.daysLeft : m.stockDaysLeft;
    return {
      id: `seed-${m.name}`,
      name: m.name,
      category: m.category,
      price: MEDICINE_PRICES[m.name] ?? 5,
      stock,
      reorderPoint,
      daysLeft,
      demandTier: m.demandTier as MedicineEntry["demandTier"],
      trend: m.trend as MedicineEntry["trend"],
      forecastUnits: m.forecastUnits,
      whyTrend: m.whyTrend,
    };
  });
}

const BASE_REVENUE = 5250000;
const BASE_ORDERS = 2178;

type PharmacyContextType = {
  medicines: MedicineEntry[];
  invoices: Invoice[];
  totalRevenue: number;
  totalOrders: number;
  criticalMeds: MedicineEntry[];
  addMedicine: (data: {
    name: string;
    category: string;
    price: number;
    stock: number;
  }) => void;
  createInvoice: (items: InvoiceItem[], customerName: string) => void;
};

const PharmacyContext = createContext<PharmacyContextType | null>(null);

export function PharmacyProvider({ children }: { children: React.ReactNode }) {
  const [medicines, setMedicines] = useState<MedicineEntry[]>(seedMedicines);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const totalRevenue = useMemo(
    () => BASE_REVENUE + invoices.reduce((s, inv) => s + inv.total, 0),
    [invoices],
  );
  const totalOrders = useMemo(() => BASE_ORDERS + invoices.length, [invoices]);
  const criticalMeds = useMemo(
    () => medicines.filter((m) => m.stock <= m.reorderPoint || m.daysLeft < 15),
    [medicines],
  );

  function addMedicine(data: {
    name: string;
    category: string;
    price: number;
    stock: number;
  }) {
    const entry: MedicineEntry = {
      id: Date.now().toString(),
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
      reorderPoint: Math.round(data.stock * 0.2),
      daysLeft: Math.round(data.stock / 3),
      demandTier: "new",
      trend: "stable",
      forecastUnits: Math.round(data.stock * 0.8),
      whyTrend: "Newly added medicine — demand data will build over time",
      addedAt: new Date(),
      isUserAdded: true,
    };
    setMedicines((prev) => [...prev, entry]);
  }

  function createInvoice(items: InvoiceItem[], customerName: string) {
    const total = items.reduce((s, item) => s + item.subtotal, 0);
    const invoice: Invoice = {
      id: Date.now().toString(),
      date: new Date(),
      customerName,
      items,
      total,
    };
    setInvoices((prev) => [...prev, invoice]);
    setMedicines((prev) =>
      prev.map((med) => {
        const soldItem = items.find((it) => it.medicineId === med.id);
        if (!soldItem) return med;
        const prevStock = med.stock;
        const prevDaysLeft = med.daysLeft;
        const newStock = Math.max(0, prevStock - soldItem.qty);
        const velocity = prevStock / (prevDaysLeft || 1);
        const newDaysLeft = Math.round(newStock / (velocity || 1));
        return { ...med, stock: newStock, daysLeft: newDaysLeft };
      }),
    );
  }

  return (
    <PharmacyContext.Provider
      value={{
        medicines,
        invoices,
        totalRevenue,
        totalOrders,
        criticalMeds,
        addMedicine,
        createInvoice,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const ctx = useContext(PharmacyContext);
  if (!ctx) throw new Error("usePharmacy must be used within PharmacyProvider");
  return ctx;
}
