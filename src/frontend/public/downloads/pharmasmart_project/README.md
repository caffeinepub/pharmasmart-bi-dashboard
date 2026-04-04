# PharmaSmart — AI-Powered Pharmacy Management & BI Dashboard

A full-featured React (TypeScript) pharmacy management system with real-time analytics, AI-powered recommendations, customer & invoice management, and role-based access.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Admin Credentials

- **Password:** `pharm123`

## Project Structure

```
src/
  analytics/
    businessAnalytics.ts       # computeTotalProfit, computeTopSelling, computeSmartRecommendations
  components/
    Sidebar.tsx
    AIInsightsPanel.tsx
    AlertBox.tsx
    LowStockAlert.tsx
    NearExpiryAlert.tsx
    TopSellingMedicines.tsx
    CustomerInvoice.tsx
    CustomerList.tsx
    ActivityLog.tsx
    ProfitSummaryCard.tsx
    SmartRecommendations.tsx
    ui/                        # shadcn/ui base components
  context/
    PharmacyContext.tsx        # Global state: medicines, customers, invoices
  data/
    pharmacyData.ts            # Seed data for charts and AI insights
  lib/
    utils.ts
  pages/
    Overview.tsx
    SalesAnalysis.tsx
    Inventory.tsx
    Customers.tsx
    Predictions.tsx
    CustomerPredictions.tsx
    Recommendations.tsx
    RecommendationEngine.tsx
    AddMedicine.tsx
    CreateInvoice.tsx
    CustomerInvoicePage.tsx
  App.tsx
  main.tsx
  index.css
```

## Features

- **Mode Selector** — Admin or Customer access on launch
- **Admin Dashboard** — Full analytics, inventory, customer management, AI insights
- **Customer Portal** — Invoice creation with live totals and stock validation
- **Analytics** — Top Selling Medicines, Total Profit, Profit per Invoice (EGP)
- **Alerts** — Low Stock (< 10 units), Near Expiry (< 30 days)
- **AI Recommendations** — High demand, low sales, near expiry signals
- **Customer Predictions** — At-risk, Frequent Buyer, Promotion Candidate tags
- **Recommendation Engine** — Collaborative + content-based scoring
- **Export / Print** — CSV export and browser print
- **25+ Sample Customers** preloaded

## Currency

All values displayed in **EGP (Egyptian Pound)**.

## Firebase Integration (Future)

All state is in `PharmacyContext.tsx`. Replace `useState` initializers with Firestore `onSnapshot` listeners and write functions with `setDoc`/`addDoc`. All UI components use `usePharmacy()` hook — no UI changes needed.

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Vite
- Lucide React
- Framer Motion / motion
- Recharts
- shadcn/ui
