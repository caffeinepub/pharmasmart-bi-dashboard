# PharmaSmart BI Dashboard — Customer & Invoice Management + Dashboard Analytics Integration

## Current State

- `Customer` type has `purchaseHistory[].medicines[{ name, quantity, price }]` — **missing `costPrice` per medicine item**
- `CustomerInvoice` component calculates `approxTotalSpend` using `price * quantity`, but cannot compute profit margin since `costPrice` is not stored in `CustomerPurchase`
- Overview dashboard uses **static data** for several analytics sections (topMedicines, customerPredictions, inventoryAlerts) instead of live customer/invoice data
- Customer Insights on Overview uses static `customerPredictions` data, not live `customers` array
- `SalesAnalysis` page uses mostly static `monthlyRevenue`/`topMedicines` data, only `totalRevenue` and `invoices.length` are live
- No profit-per-customer or revenue-per-customer breakdown on Overview or any analytics page
- No customer revenue contribution visible on dashboard KPIs
- Dashboard Analytics (top selling, profit) are partially live but don't show customer-segmented data
- No link between Invoice data and Customer data on the Overview dashboard
- No dashboard section showing top customers by revenue, spend, or profit
- Predictions page uses static `customerPredictions` from pharmacyData, not live customer context data for segment distribution charts

## Requested Changes (Diff)

### Add
- `costPrice: number` field to `CustomerPurchase.medicines[]` items in the `Customer` type
- When `createInvoice` / `addOrUpdateCustomer` is called, store `costPrice` (looked up from `medicines` state) alongside `price` in the purchase history
- Seed customers' pre-existing `purchaseHistory` should also carry `costPrice` values (use reasonable static values)
- New **Dashboard Analytics** section on Overview: "Customer & Invoice Analytics" panel that shows:
  - Top 5 customers by total revenue (name + revenue EGP)
  - Top 5 customers by invoice count
  - Total at-risk customer count (live)
  - Customer revenue contribution % of total revenue
  - Profit margin per customer (revenue - cost, using stored costPrice)
- Update `CustomerInvoice` component to use `costPrice` for profit calculation and display profit margin per customer
- New stat in CustomerInvoice at-risk panel: "Profit Margin" (revenue - cost across all purchases)
- `CustomerPredictions` page: show per-customer profit margin in expanded detail row
- Enhance `SalesAnalysis` page with a live **"Customer Revenue Breakdown"** section: table of top 10 customers by revenue (name, total spend, invoice count, profit, profit margin %)

### Modify
- `Customer` type: add `costPrice` to `CustomerPurchase.medicines[]` items
- `addOrUpdateCustomer(name, invoiceId, medicines)` — `medicines` param now accepts `{name, quantity, price, costPrice}[]`
- `createInvoice` — when calling `addOrUpdateCustomer`, pass `costPrice` from each `InvoiceItem`'s corresponding `MedicineEntry` (looked up via `medicineId`)
- `CustomerInvoice` component — add Profit column to invoice table, and a "Profit Margin" insight in Customer Insights row
- Overview page — add a new "Customer Analytics" row/section that uses live `customers` array data
- `SalesAnalysis` page — add live customer revenue table section, replacing or augmenting the static top/bottom performers

### Remove
- No features removed; static analytics sections on Overview stay but get supplemented with a new live customer analytics panel

## Implementation Plan

1. **Update `Customer` type** in `PharmacyContext.tsx`:
   - `CustomerPurchase.medicines[]` items: add `costPrice: number`
   - Update seed data `purchaseHistory` entries with `costPrice` values

2. **Update `addOrUpdateCustomer`** function signature:
   - Accept `medicines: {name, quantity, price, costPrice}[]`
   - Store `costPrice` in the purchase history medicine items

3. **Update `createInvoice`**:
   - When building the array passed to `addOrUpdateCustomer`, look up each item's `MedicineEntry` by `medicineId` to get `costPrice`, then pass it along

4. **Update `CustomerInvoice` component**:
   - Add `costPrice` field to display per-item profit in invoice table (Profit = `(price - costPrice) * quantity`)
   - Add "Profit Margin" stat to Customer Insights row
   - Add "Total Profit" to at-risk warning panel

5. **Update `Overview.tsx`**:
   - Add new "Customer & Invoice Analytics" section below the existing Business Intelligence row
   - Derive top 5 customers by revenue from `customers` array
   - Derive top 5 customers by invoice count
   - Show live customer KPIs: total revenue from customers, at-risk count, avg revenue per customer

6. **Update `SalesAnalysis.tsx`**:
   - Add a live "Customer Revenue Breakdown" table section
   - Derive per-customer revenue, profit, profit margin from `customers` array using stored `costPrice`
   - Show top 10 customers by revenue

7. **Update `CustomerPredictions.tsx`**:
   - Show profit margin in each customer row/expanded detail
   - Ensure KPI strip uses live `customers` data (it already does for counts)

8. **Validate and build** — typecheck, lint, ensure no regressions
