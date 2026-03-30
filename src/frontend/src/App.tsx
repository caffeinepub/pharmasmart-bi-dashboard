import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { Sidebar } from "@/components/Sidebar";
import type { Page } from "@/components/Sidebar";
import { PharmacyProvider } from "@/context/PharmacyContext";
import { AddMedicine } from "@/pages/AddMedicine";
import { CreateInvoice } from "@/pages/CreateInvoice";
import { CustomerInvoicePage } from "@/pages/CustomerInvoicePage";
import { CustomerPredictions } from "@/pages/CustomerPredictions";
import { Customers } from "@/pages/Customers";
import { Inventory } from "@/pages/Inventory";
import { Overview } from "@/pages/Overview";
import { Predictions } from "@/pages/Predictions";
import { RecommendationEngine } from "@/pages/RecommendationEngine";
import { Recommendations } from "@/pages/Recommendations";
import { SalesAnalysis } from "@/pages/SalesAnalysis";
import {
  FileText,
  LayoutDashboard,
  Pill,
  ShieldCheck,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type AppMode = "select" | "admin" | "customer";

const pageComponents: Record<Page, React.ComponentType> = {
  overview: Overview,
  sales: SalesAnalysis,
  inventory: Inventory,
  customers: Customers,
  predictions: Predictions,
  customerPredictions: CustomerPredictions,
  recommendations: Recommendations,
  recommendationEngine: RecommendationEngine,
  addMedicine: AddMedicine,
  createInvoice: CreateInvoice,
};

const pageTitles: Record<Page, string> = {
  overview: "Dashboard Overview",
  sales: "Sales Analysis",
  inventory: "Inventory Management",
  customers: "Customer Intelligence",
  predictions: "AI Predictions",
  customerPredictions: "Customer Predictions",
  recommendations: "Recommendations",
  recommendationEngine: "Recommendation Engine",
  addMedicine: "Add Medicine",
  createInvoice: "Create Invoice",
};

function ModeSelectorScreen({
  onSelect,
}: { onSelect: (mode: AppMode) => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          }}
        >
          <Pill className="w-6 h-6 text-white" />
        </div>
        <div>
          <div
            className="text-white font-bold text-xl leading-tight"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            PharmaSmart
          </div>
          <div className="text-xs" style={{ color: "#64748B" }}>
            Pharmacy Management System
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-white mb-2 text-center">
        How would you like to access the system?
      </h2>
      <p className="text-sm mb-8 text-center" style={{ color: "#64748B" }}>
        Select your access type to continue
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        {/* Admin Card */}
        <button
          type="button"
          onClick={() => onSelect("admin")}
          className="flex-1 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          style={{
            background: "linear-gradient(135deg, #1E3A5F 0%, #1E293B 100%)",
            border: "1px solid #3B82F6",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
            }}
          >
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-white text-base mb-1">
            Admin Access
          </div>
          <div className="text-xs" style={{ color: "#64748B" }}>
            Full dashboard, analytics, inventory management, and all admin
            features
          </div>
          <div
            className="mt-4 text-xs font-semibold flex items-center gap-1"
            style={{ color: "#60A5FA" }}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Enter Dashboard →
          </div>
        </button>

        {/* Customer Card */}
        <button
          type="button"
          onClick={() => onSelect("customer")}
          className="flex-1 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          style={{
            background: "linear-gradient(135deg, #022C22 0%, #1E293B 100%)",
            border: "1px solid #10B981",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
            }}
          >
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-white text-base mb-1">
            Customer Access
          </div>
          <div className="text-xs" style={{ color: "#64748B" }}>
            Create your invoice — select medicines, enter quantities, and
            generate your receipt
          </div>
          <div
            className="mt-4 text-xs font-semibold flex items-center gap-1"
            style={{ color: "#34D399" }}
          >
            <FileText className="w-3.5 h-3.5" />
            Create Invoice →
          </div>
        </button>
      </div>

      <p className="mt-10 text-xs" style={{ color: "#334155" }}>
        Graduation Project 2025 · PharmaSmart AI Dashboard
      </p>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<AppMode>("select");
  const [activePage, setActivePage] = useState<Page>("overview");

  return (
    <PharmacyProvider>
      <AnimatePresence mode="wait">
        {mode === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ModeSelectorScreen onSelect={setMode} />
          </motion.div>
        )}

        {mode === "customer" && (
          <motion.div
            key="customer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CustomerInvoicePage onBack={() => setMode("select")} />
          </motion.div>
        )}

        {mode === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-screen bg-background"
          >
            <div className="flex min-h-screen bg-background w-full">
              <Sidebar activePage={activePage} onNavigate={setActivePage} />

              <div
                className="flex-1 flex flex-col"
                style={{ marginLeft: "240px" }}
              >
                {/* Top Header */}
                <header
                  className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3 border-b border-border"
                  style={{
                    backgroundColor: "oklch(var(--background))",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div>
                    <h1 className="text-base font-bold text-foreground">
                      PharmaSmart
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      AI-Powered Decision Support System
                    </p>
                  </div>
                  <div className="h-6 w-px bg-border mx-2" />
                  <span className="text-sm text-muted-foreground">
                    {pageTitles[activePage]}
                  </span>
                  <div className="ml-auto flex items-center gap-3">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: "#13091F",
                        border: "1px solid #7C3AED",
                        color: "#A78BFA",
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-violet-400 pulse-dot" />
                      AI-Powered
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "#1E293B", color: "#64748B" }}
                    >
                      Graduation Project 2025
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode("select")}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:bg-muted"
                      style={{ color: "#64748B", border: "1px solid #1E293B" }}
                    >
                      ← Exit
                    </button>
                  </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePage}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {(() => {
                        const PageComponent = pageComponents[activePage];
                        return <PageComponent />;
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </main>

                {/* Footer */}
                <footer className="px-6 py-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    PharmaSmart AI Dashboard — Pharmacy Management System
                    Graduation Project 2025
                  </span>
                  <span className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()}. Built with love using{" "}
                    <a
                      href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground transition-colors"
                    >
                      caffeine.ai
                    </a>
                  </span>
                </footer>
              </div>

              <AIInsightsPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PharmacyProvider>
  );
}
