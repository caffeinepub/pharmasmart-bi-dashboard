import type { MedicineEntry } from "@/context/PharmacyContext";
import { PackagePlus } from "lucide-react";
import { AlertBox } from "./AlertBox";

const THRESHOLD = 10;

type LowStockAlertProps = {
  medicines: MedicineEntry[];
  onRestock: (id: string) => void;
};

export function LowStockAlert({ medicines, onRestock }: LowStockAlertProps) {
  const lowStockItems = medicines.filter((m) => m.stock < THRESHOLD);

  return (
    <AlertBox
      type="warning"
      title="Low Stock Medicines"
      count={lowStockItems.length}
      emptyMessage="All medicines are sufficiently stocked ✅"
    >
      {lowStockItems.map((medicine, i) => (
        <li
          key={medicine.id}
          className="flex items-center justify-between px-5 py-3"
          data-ocid={`low-stock.item.${i + 1}`}
        >
          <div className="flex items-center gap-3">
            <PackagePlus
              className="w-4 h-4 shrink-0"
              style={{ color: "#D97706" }}
            />
            <div>
              <span
                className="text-sm font-semibold"
                style={{ color: "#FEF3C7" }}
              >
                {medicine.name}
              </span>
              <span className="ml-2 text-xs" style={{ color: "#FCD34D" }}>
                (Qty: {medicine.stock})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRestock(medicine.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              border: "1px solid #D97706",
              color: "#FCD34D",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#D97706";
              (e.currentTarget as HTMLButtonElement).style.color = "#1C1400";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#FCD34D";
            }}
            data-ocid={`low-stock.restock.button.${i + 1}`}
          >
            <PackagePlus className="w-3 h-3" />
            Restock +50
          </button>
        </li>
      ))}
    </AlertBox>
  );
}
