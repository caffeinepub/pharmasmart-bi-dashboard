import type { MedicineEntry } from "@/context/PharmacyContext";
import { PackagePlus } from "lucide-react";
import { AlertBox } from "./AlertBox";

const NEAR_EXPIRY_DAYS = 30;

type NearExpiryAlertProps = {
  medicines: MedicineEntry[];
  onRestock: (id: string) => void;
};

export function NearExpiryAlert({
  medicines,
  onRestock,
}: NearExpiryAlertProps) {
  const today = new Date();
  const thresholdMs = NEAR_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  const nearExpiryItems = medicines
    .filter((m) => {
      if (!m.expiryDate) return false;
      const diff = m.expiryDate.getTime() - today.getTime();
      return diff > 0 && diff <= thresholdMs;
    })
    .map((m) => ({
      ...m,
      daysRemaining: Math.ceil(
        (m.expiryDate!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      ),
    }));

  return (
    <AlertBox
      type="danger"
      title="Near Expiry Medicines"
      count={nearExpiryItems.length}
      emptyMessage="All medicines have adequate expiry dates ✅"
    >
      {nearExpiryItems.map((medicine, i) => (
        <li
          key={medicine.id}
          className="flex items-center justify-between px-5 py-3"
          data-ocid={`near-expiry.item.${i + 1}`}
        >
          <div className="flex items-center gap-3">
            <PackagePlus
              className="w-4 h-4 shrink-0"
              style={{ color: "#EF4444" }}
            />
            <div>
              <span
                className="text-sm font-semibold"
                style={{ color: "#FEE2E2" }}
              >
                {medicine.name}
              </span>
              <div className="text-xs mt-0.5" style={{ color: "#FCA5A5" }}>
                {medicine.expiryDate
                  ? `Expiry: ${medicine.expiryDate.toLocaleDateString()} `
                  : ""}
                <span className="font-semibold">
                  ({medicine.daysRemaining} days left)
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRestock(medicine.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              border: "1px solid #EF4444",
              color: "#FCA5A5",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#EF4444";
              (e.currentTarget as HTMLButtonElement).style.color = "#1A0707";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#FCA5A5";
            }}
            data-ocid={`near-expiry.restock.button.${i + 1}`}
          >
            <PackagePlus className="w-3 h-3" />
            Restock +50
          </button>
        </li>
      ))}
    </AlertBox>
  );
}
