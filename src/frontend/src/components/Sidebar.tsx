import {
  Brain,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Package,
  Pill,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export type Page =
  | "overview"
  | "sales"
  | "inventory"
  | "customers"
  | "predictions"
  | "customerPredictions"
  | "recommendations"
  | "recommendationEngine"
  | "addMedicine"
  | "createInvoice";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const analyticsItems: {
  id: Page;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Dashboard KPIs",
  },
  {
    id: "sales",
    label: "Sales Analysis",
    icon: TrendingUp,
    description: "Revenue trends",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    description: "Stock management",
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    description: "Segmentation",
  },
  {
    id: "predictions",
    label: "AI Predictions",
    icon: Brain,
    description: "Demand forecasting",
  },
  {
    id: "customerPredictions",
    label: "Customer Predictions",
    icon: Users,
    description: "Behavioral AI",
  },
  {
    id: "recommendations",
    label: "Recommendations",
    icon: Lightbulb,
    description: "Action items",
  },
  {
    id: "recommendationEngine",
    label: "Rec. Engine",
    icon: Sparkles,
    description: "Medicine Recommendations",
  },
];

const operationsItems: {
  id: Page;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    id: "addMedicine",
    label: "Add Medicine",
    icon: PlusCircle,
    description: "Add new stock",
  },
  {
    id: "createInvoice",
    label: "Create Invoice",
    icon: FileText,
    description: "Record a sale",
  },
];

function NavButton({
  item,
  isActive,
  onNavigate,
}: {
  item: {
    id: Page;
    label: string;
    icon: React.ElementType;
    description: string;
  };
  isActive: boolean;
  onNavigate: (page: Page) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      data-ocid={`nav.${item.id}.link`}
      onClick={() => onNavigate(item.id)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group"
      style={{
        backgroundColor: isActive ? "#1E3A5F" : "transparent",
        border: isActive ? "1px solid #3B82F6" : "1px solid transparent",
      }}
    >
      <Icon
        className="shrink-0 transition-colors"
        style={{
          color: isActive ? "#60A5FA" : "#64748B",
          width: "18px",
          height: "18px",
        }}
      />
      <div>
        <div
          className="text-sm font-medium leading-tight transition-colors"
          style={{ color: isActive ? "#E2E8F0" : "#94A3B8" }}
        >
          {item.label}
        </div>
        <div className="text-xs" style={{ color: "#475569" }}>
          {item.description}
        </div>
      </div>
      {isActive && (
        <div
          className="ml-auto w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#60A5FA" }}
        />
      )}
    </button>
  );
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ backgroundColor: "#0F172A", borderRight: "1px solid #1E293B" }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "#1E293B" }}>
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
            <div
              className="text-white font-bold text-base leading-tight"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              PharmaSmart
            </div>
            <div className="text-xs" style={{ color: "#64748B" }}>
              BI Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 px-3 py-4 overflow-y-auto"
        aria-label="Main navigation"
      >
        {/* Analytics section */}
        <div className="mb-2">
          <div className="px-3 mb-1.5">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#334155" }}
            >
              Analytics
            </span>
          </div>
          <div className="space-y-1">
            {analyticsItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={activePage === item.id}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        {/* Separator */}
        <div
          className="my-3 mx-3 h-px"
          style={{ backgroundColor: "#1E293B" }}
        />

        {/* Operations section */}
        <div>
          <div className="px-3 mb-1.5">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#334155" }}
            >
              Operations
            </span>
          </div>
          <div className="space-y-1">
            {operationsItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={activePage === item.id}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "#1E293B" }}>
        <div className="text-xs" style={{ color: "#475569" }}>
          Graduation Project 2025
        </div>
        <div className="text-xs mt-0.5" style={{ color: "#334155" }}>
          {today}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-xs" style={{ color: "#6EE7B7" }}>
            System Online
          </span>
        </div>
      </div>
    </aside>
  );
}
