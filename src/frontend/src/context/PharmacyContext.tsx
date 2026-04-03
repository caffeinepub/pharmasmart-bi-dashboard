import {
  computeTopSelling,
  computeTotalProfit,
} from "@/analytics/businessAnalytics";
import type { TopSellingEntry } from "@/analytics/businessAnalytics";
import { inventoryAlerts, medicineDemandForecast } from "@/data/pharmacyData";
import { createContext, useContext, useMemo, useState } from "react";

export type MedicineEntry = {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  reorderPoint: number;
  daysLeft: number;
  demandTier: "high" | "medium" | "low" | "new";
  trend: "up" | "stable" | "down";
  forecastUnits: number;
  whyTrend: string;
  expiryDate?: Date;
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

export type CustomerPurchase = {
  invoiceId: string;
  medicines: {
    name: string;
    quantity: number;
    price: number;
    costPrice: number;
  }[];
  date: string;
};

export type Customer = {
  id: string;
  name: string;
  isAtRisk: boolean;
  frequentBuyer: boolean;
  purchaseHistory: CustomerPurchase[];
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

const MEDICINE_COST_PRICES: Record<string, number> = {
  "Amoxicillin 500mg": 33,
  "Paracetamol 500mg": 16,
  "Metformin 850mg": 29,
  "Vitamin C 1000mg": 19,
  "Atorvastatin 20mg": 78,
  "Ibuprofen 400mg": 22,
  "Oseltamivir 75mg": 117,
  "Vitamin D3 5000IU": 36,
  "Azithromycin 250mg": 62,
  "Chloroquine 250mg": 26,
  "Codeine Phosphate": 39,
  Amoxicillin: 33,
  Augmentin: 52,
  "Panadol Extra": 19,
  Brufen: 16,
};

function getCostPrice(name: string, price: number): number {
  return MEDICINE_COST_PRICES[name] ?? Math.round(price * 0.65);
}

const MEDICINE_EXPIRY_DATES: Record<string, Date> = {
  "Amoxicillin 500mg": new Date(2026, 7, 15),
  "Paracetamol 500mg": new Date(2027, 0, 10),
  "Metformin 850mg": new Date(2026, 5, 20),
  "Vitamin C 1000mg": new Date(2026, 3, 20),
  "Atorvastatin 20mg": new Date(2026, 3, 15),
  "Ibuprofen 400mg": new Date(2026, 9, 5),
  "Oseltamivir 75mg": new Date(2026, 4, 1),
  "Vitamin D3 5000IU": new Date(2026, 4, 25),
  "Azithromycin 250mg": new Date(2026, 3, 10),
  "Chloroquine 250mg": new Date(2027, 2, 10),
  "Codeine Phosphate": new Date(2027, 5, 30),
  Amoxicillin: new Date(2026, 6, 1),
  Augmentin: new Date(2026, 4, 10),
  "Panadol Extra": new Date(2026, 8, 20),
  Brufen: new Date(2026, 10, 1),
};

function getExpiryDate(name: string): Date {
  return MEDICINE_EXPIRY_DATES[name] ?? new Date(2026, 11, 31);
}

function seedMedicines(): MedicineEntry[] {
  return medicineDemandForecast.map((m) => {
    const alert = inventoryAlerts.find((a) => a.name === m.name);
    const stock = alert ? alert.stock : m.currentStock;
    const reorderPoint = alert ? alert.reorder : Math.round(stock * 0.2);
    const daysLeft = alert ? alert.daysLeft : m.stockDaysLeft;
    const price = MEDICINE_PRICES[m.name] ?? 5;
    return {
      id: `seed-${m.name}`,
      name: m.name,
      category: m.category,
      price,
      costPrice: Math.round(price * 0.65),
      stock,
      reorderPoint,
      daysLeft,
      demandTier: m.demandTier as MedicineEntry["demandTier"],
      trend: m.trend as MedicineEntry["trend"],
      forecastUnits: m.forecastUnits,
      whyTrend: m.whyTrend,
      expiryDate: getExpiryDate(m.name),
    };
  });
}

function seedCustomers(): Customer[] {
  return [
    {
      id: "c1",
      name: "Ahmed Ali",
      isAtRisk: false,
      frequentBuyer: true,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-01",
          medicines: [
            {
              name: "Amoxicillin 500mg",
              quantity: 2,
              price: 50,
              costPrice: 33,
            },
            {
              name: "Paracetamol 500mg",
              quantity: 3,
              price: 25,
              costPrice: 16,
            },
          ],
          date: "3/15/2026",
        },
        {
          invoiceId: "inv-seed-02",
          medicines: [
            { name: "Vitamin C 1000mg", quantity: 1, price: 30, costPrice: 19 },
          ],
          date: "2/20/2026",
        },
        {
          invoiceId: "inv-seed-03",
          medicines: [
            { name: "Ibuprofen 400mg", quantity: 2, price: 35, costPrice: 22 },
          ],
          date: "1/10/2026",
        },
      ],
    },
    {
      id: "c2",
      name: "Sara Mohamed",
      isAtRisk: true,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-04",
          medicines: [
            { name: "Metformin 850mg", quantity: 2, price: 45, costPrice: 29 },
            {
              name: "Atorvastatin 20mg",
              quantity: 1,
              price: 120,
              costPrice: 78,
            },
          ],
          date: "3/20/2026",
        },
        {
          invoiceId: "inv-seed-05",
          medicines: [
            { name: "Metformin 850mg", quantity: 2, price: 45, costPrice: 29 },
          ],
          date: "2/5/2026",
        },
      ],
    },
    {
      id: "c3",
      name: "Mohamed Hassan",
      isAtRisk: false,
      frequentBuyer: true,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-06",
          medicines: [
            {
              name: "Azithromycin 250mg",
              quantity: 1,
              price: 95,
              costPrice: 62,
            },
            {
              name: "Paracetamol 500mg",
              quantity: 2,
              price: 25,
              costPrice: 16,
            },
          ],
          date: "3/25/2026",
        },
        {
          invoiceId: "inv-seed-07",
          medicines: [
            { name: "Ibuprofen 400mg", quantity: 3, price: 35, costPrice: 22 },
          ],
          date: "2/28/2026",
        },
      ],
    },
    {
      id: "c4",
      name: "Laila Samir",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-08",
          medicines: [
            { name: "Vitamin C 1000mg", quantity: 2, price: 30, costPrice: 19 },
          ],
          date: "3/10/2026",
        },
      ],
    },
    {
      id: "c5",
      name: "Omar Khaled",
      isAtRisk: true,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-09",
          medicines: [
            {
              name: "Atorvastatin 20mg",
              quantity: 1,
              price: 120,
              costPrice: 78,
            },
            { name: "Metformin 850mg", quantity: 1, price: 45, costPrice: 29 },
          ],
          date: "3/18/2026",
        },
        {
          invoiceId: "inv-seed-10",
          medicines: [
            {
              name: "Amoxicillin 500mg",
              quantity: 1,
              price: 50,
              costPrice: 33,
            },
          ],
          date: "1/25/2026",
        },
      ],
    },
    {
      id: "c6",
      name: "Nour Adel",
      isAtRisk: false,
      frequentBuyer: true,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-11",
          medicines: [
            {
              name: "Paracetamol 500mg",
              quantity: 2,
              price: 25,
              costPrice: 16,
            },
            { name: "Vitamin C 1000mg", quantity: 1, price: 30, costPrice: 19 },
          ],
          date: "3/22/2026",
        },
        {
          invoiceId: "inv-seed-12",
          medicines: [
            { name: "Ibuprofen 400mg", quantity: 1, price: 35, costPrice: 22 },
          ],
          date: "2/14/2026",
        },
        {
          invoiceId: "inv-seed-13",
          medicines: [
            {
              name: "Amoxicillin 500mg",
              quantity: 1,
              price: 50,
              costPrice: 33,
            },
          ],
          date: "1/30/2026",
        },
      ],
    },
    {
      id: "c7",
      name: "Hany Fouad",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-14",
          medicines: [
            {
              name: "Azithromycin 250mg",
              quantity: 1,
              price: 95,
              costPrice: 62,
            },
          ],
          date: "3/5/2026",
        },
      ],
    },
    {
      id: "c8",
      name: "Mona Youssef",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-15",
          medicines: [
            { name: "Vitamin C 1000mg", quantity: 3, price: 30, costPrice: 19 },
            {
              name: "Vitamin D3 5000IU",
              quantity: 1,
              price: 55,
              costPrice: 36,
            },
          ],
          date: "2/28/2026",
        },
      ],
    },
    {
      id: "c9",
      name: "Tamer Salah",
      isAtRisk: true,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-16",
          medicines: [
            {
              name: "Atorvastatin 20mg",
              quantity: 2,
              price: 120,
              costPrice: 78,
            },
            { name: "Metformin 850mg", quantity: 2, price: 45, costPrice: 29 },
          ],
          date: "3/30/2026",
        },
        {
          invoiceId: "inv-seed-17",
          medicines: [
            { name: "Ibuprofen 400mg", quantity: 2, price: 35, costPrice: 22 },
          ],
          date: "2/10/2026",
        },
      ],
    },
    {
      id: "c10",
      name: "Dina Mostafa",
      isAtRisk: false,
      frequentBuyer: true,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-18",
          medicines: [
            {
              name: "Paracetamol 500mg",
              quantity: 4,
              price: 25,
              costPrice: 16,
            },
            {
              name: "Amoxicillin 500mg",
              quantity: 1,
              price: 50,
              costPrice: 33,
            },
          ],
          date: "3/28/2026",
        },
        {
          invoiceId: "inv-seed-19",
          medicines: [
            { name: "Vitamin C 1000mg", quantity: 2, price: 30, costPrice: 19 },
          ],
          date: "3/1/2026",
        },
        {
          invoiceId: "inv-seed-20",
          medicines: [
            { name: "Ibuprofen 400mg", quantity: 1, price: 35, costPrice: 22 },
          ],
          date: "2/1/2026",
        },
      ],
    },
    {
      id: "c11",
      name: "Yasser Khalil",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
    {
      id: "c12",
      name: "Rania Fathy",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-21",
          medicines: [
            { name: "Metformin 850mg", quantity: 1, price: 45, costPrice: 29 },
          ],
          date: "3/12/2026",
        },
      ],
    },
    {
      id: "c13",
      name: "Karim Farid",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
    {
      id: "c14",
      name: "Fatma Hossam",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-22",
          medicines: [
            {
              name: "Paracetamol 500mg",
              quantity: 2,
              price: 25,
              costPrice: 16,
            },
            { name: "Vitamin C 1000mg", quantity: 1, price: 30, costPrice: 19 },
          ],
          date: "2/22/2026",
        },
      ],
    },
    {
      id: "c15",
      name: "Walid Magdy",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
    {
      id: "c16",
      name: "Amira Samir",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-23",
          medicines: [
            {
              name: "Amoxicillin 500mg",
              quantity: 1,
              price: 50,
              costPrice: 33,
            },
          ],
          date: "3/8/2026",
        },
      ],
    },
    {
      id: "c17",
      name: "Mahmoud Nabil",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
    {
      id: "c18",
      name: "Salma Tarek",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-24",
          medicines: [
            {
              name: "Vitamin D3 5000IU",
              quantity: 1,
              price: 55,
              costPrice: 36,
            },
            { name: "Vitamin C 1000mg", quantity: 2, price: 30, costPrice: 19 },
          ],
          date: "2/17/2026",
        },
      ],
    },
    {
      id: "c19",
      name: "Hazem Fawzy",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
    {
      id: "c20",
      name: "Nada Sherif",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-25",
          medicines: [
            { name: "Ibuprofen 400mg", quantity: 2, price: 35, costPrice: 22 },
          ],
          date: "3/2/2026",
        },
      ],
    },
    {
      id: "c21",
      name: "Sherif Mansour",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
    {
      id: "c22",
      name: "Eman Ramadan",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-26",
          medicines: [
            {
              name: "Azithromycin 250mg",
              quantity: 1,
              price: 95,
              costPrice: 62,
            },
          ],
          date: "3/19/2026",
        },
      ],
    },
    {
      id: "c23",
      name: "Adel Fouad",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
    {
      id: "c24",
      name: "Heba Gamal",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [
        {
          invoiceId: "inv-seed-27",
          medicines: [
            { name: "Metformin 850mg", quantity: 1, price: 45, costPrice: 29 },
            {
              name: "Atorvastatin 20mg",
              quantity: 1,
              price: 120,
              costPrice: 78,
            },
          ],
          date: "1/15/2026",
        },
      ],
    },
    {
      id: "c25",
      name: "Tarek Lotfy",
      isAtRisk: false,
      frequentBuyer: false,
      purchaseHistory: [],
    },
  ];
}

const BASE_REVENUE = 5250000;
const BASE_ORDERS = 2178;

type PharmacyContextType = {
  medicines: MedicineEntry[];
  invoices: Invoice[];
  customers: Customer[];
  totalRevenue: number;
  totalOrders: number;
  totalProfit: number;
  topSelling: TopSellingEntry[];
  criticalMeds: MedicineEntry[];
  addMedicine: (data: {
    name: string;
    category: string;
    price: number;
    stock: number;
    costPrice?: number;
    expiryDate?: Date;
  }) => void;
  createInvoice: (items: InvoiceItem[], customerName: string) => void;
  restockMedicine: (id: string) => void;
  addOrUpdateCustomer: (
    name: string,
    invoiceId: string,
    medicines: {
      name: string;
      quantity: number;
      price: number;
      costPrice: number;
    }[],
  ) => void;
  addCustomerOnly: (name: string) => void;
  deleteCustomer: (id: string) => void;
  toggleAtRisk: (customerId: string) => void;
  toggleFrequentBuyer: (customerId: string) => void;
};

const PharmacyContext = createContext<PharmacyContextType | null>(null);

export function PharmacyProvider({ children }: { children: React.ReactNode }) {
  const [medicines, setMedicines] = useState<MedicineEntry[]>(seedMedicines);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);

  const totalRevenue = useMemo(
    () => BASE_REVENUE + invoices.reduce((s, inv) => s + inv.total, 0),
    [invoices],
  );
  const totalOrders = useMemo(() => BASE_ORDERS + invoices.length, [invoices]);
  const criticalMeds = useMemo(
    () => medicines.filter((m) => m.stock <= m.reorderPoint || m.daysLeft < 15),
    [medicines],
  );

  const totalProfit = useMemo(
    () => computeTotalProfit(invoices, medicines),
    [invoices, medicines],
  );

  const topSelling = useMemo(() => computeTopSelling(invoices, 5), [invoices]);

  function addMedicine(data: {
    name: string;
    category: string;
    price: number;
    stock: number;
    costPrice?: number;
    expiryDate?: Date;
  }) {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const entry: MedicineEntry = {
      id: Date.now().toString(),
      name: data.name,
      category: data.category,
      price: data.price,
      costPrice: data.costPrice ?? Math.round(data.price * 0.65),
      stock: data.stock,
      reorderPoint: Math.round(data.stock * 0.2),
      daysLeft: Math.round(data.stock / 3),
      demandTier: "new",
      trend: "stable",
      forecastUnits: Math.round(data.stock * 0.8),
      whyTrend: "Newly added medicine — demand data will build over time",
      expiryDate: data.expiryDate ?? oneYearFromNow,
      addedAt: new Date(),
      isUserAdded: true,
    };
    setMedicines((prev) => [...prev, entry]);
  }

  function addOrUpdateCustomer(
    name: string,
    invoiceId: string,
    medicineList: {
      name: string;
      quantity: number;
      price: number;
      costPrice: number;
    }[],
  ) {
    if (!name.trim()) return;
    const purchase: CustomerPurchase = {
      invoiceId,
      medicines: medicineList,
      date: new Date().toLocaleDateString(),
    };
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.name.toLowerCase() === name.trim().toLowerCase(),
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? { ...c, purchaseHistory: [...c.purchaseHistory, purchase] }
            : c,
        );
      }
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        isAtRisk: false,
        frequentBuyer: false,
        purchaseHistory: [purchase],
      };
      return [...prev, newCustomer];
    });
  }

  function addCustomerOnly(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = customers.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) return;
    setCustomers((prev) => [
      ...prev,
      {
        id: `cust-${Date.now()}`,
        name: trimmed,
        isAtRisk: false,
        frequentBuyer: false,
        purchaseHistory: [],
      },
    ]);
  }

  function deleteCustomer(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleAtRisk(customerId: string) {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, isAtRisk: !c.isAtRisk } : c,
      ),
    );
  }

  function toggleFrequentBuyer(customerId: string) {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, frequentBuyer: !c.frequentBuyer } : c,
      ),
    );
  }

  function createInvoice(items: InvoiceItem[], customerName: string) {
    const total = items.reduce((s, item) => s + item.subtotal, 0);
    const invoiceId = Date.now().toString();
    const invoice: Invoice = {
      id: invoiceId,
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
    // Update customers after invoice creation — look up costPrice from medicines state
    if (customerName.trim()) {
      const medicineList = items.map((it) => {
        const med = medicines.find((m) => m.id === it.medicineId);
        return {
          name: it.medicineName,
          quantity: it.qty,
          price: it.unitPrice,
          costPrice: med
            ? med.costPrice
            : getCostPrice(it.medicineName, it.unitPrice),
        };
      });
      addOrUpdateCustomer(customerName.trim(), invoiceId, medicineList);
    }
  }

  function restockMedicine(id: string) {
    const RESTOCK_AMOUNT = 50;
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id !== id) return med;
        const prevStock = med.stock;
        const prevDaysLeft = med.daysLeft || 1;
        const newStock = prevStock + RESTOCK_AMOUNT;
        const newDaysLeft = Math.round(newStock / (prevStock / prevDaysLeft));
        return { ...med, stock: newStock, daysLeft: newDaysLeft };
      }),
    );
  }

  return (
    <PharmacyContext.Provider
      value={{
        medicines,
        invoices,
        customers,
        totalRevenue,
        totalOrders,
        totalProfit,
        topSelling,
        criticalMeds,
        addMedicine,
        createInvoice,
        restockMedicine,
        addOrUpdateCustomer,
        addCustomerOnly,
        deleteCustomer,
        toggleAtRisk,
        toggleFrequentBuyer,
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
