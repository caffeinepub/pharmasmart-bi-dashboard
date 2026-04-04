import type { Customer, Invoice } from "@/context/PharmacyContext";
import { FileText, Package, Users } from "lucide-react";

interface Props {
  invoices: Invoice[];
  customers: Customer[];
}

type ActivityEvent = {
  id: string;
  icon: React.ElementType;
  description: string;
  time: string;
  timestamp: number;
  color: string;
};

export function ActivityLog({ invoices, customers }: Props) {
  const invoiceEvents: ActivityEvent[] = invoices.map((inv) => ({
    id: `inv-${inv.id}`,
    icon: FileText,
    description: `Invoice #${inv.id.slice(-6)} created for ${
      inv.customerName || "Walk-in"
    } — ${inv.items.length} item${inv.items.length !== 1 ? "s" : ""}, ${inv.total.toFixed(2)} EGP`,
    time: inv.date.toLocaleString(),
    timestamp: inv.date.getTime(),
    color: "#6366F1",
  }));

  const customerEvents: ActivityEvent[] = customers
    .filter((c) => c.purchaseHistory.length > 0)
    .map((c) => {
      // Use the date string from first purchase as registration time
      const firstDate = c.purchaseHistory[0].date;
      // Parse the date string to a timestamp; fall back to 0 if unparseable
      const ts = new Date(firstDate).getTime();
      return {
        id: `cust-${c.id}`,
        icon: Users,
        description: `Customer "${c.name}" registered`,
        time: firstDate,
        timestamp: Number.isNaN(ts) ? 0 : ts,
        color: "#6366F1",
      };
    });

  const events: ActivityEvent[] = [...invoiceEvents, ...customerEvents];

  const sorted = [...events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return (
    <div
      className="bg-card rounded-xl p-6 border border-border shadow-xs"
      data-ocid="overview.activity.panel"
    >
      <div className="flex items-center gap-2 mb-4">
        <Package style={{ width: "18px", height: "18px", color: "#F59E0B" }} />
        <h3 className="text-base font-semibold text-foreground">
          Recent Activity
        </h3>
        {sorted.length > 0 && (
          <span
            className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: "#1C1400", color: "#F59E0B" }}
          >
            {sorted.length} event{sorted.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div
          className="text-center py-8 text-sm text-muted-foreground"
          data-ocid="overview.activity.empty_state"
        >
          No recent activity
        </div>
      ) : (
        <div className="space-y-3" data-ocid="overview.activity.list">
          {sorted.map((event) => {
            const Icon = event.icon;
            const isCustomerEvent = event.id.startsWith("cust-");
            const iconColor = isCustomerEvent ? "#6366F1" : event.color;
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/20"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
