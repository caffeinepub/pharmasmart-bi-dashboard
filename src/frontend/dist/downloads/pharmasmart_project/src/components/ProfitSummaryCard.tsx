type ProfitSummaryCardProps = {
  totalProfit: number;
  invoiceCount: number;
};

export function ProfitSummaryCard({
  totalProfit,
  invoiceCount,
}: ProfitSummaryCardProps) {
  const avgProfit = invoiceCount > 0 ? totalProfit / invoiceCount : 0;

  const profitColor =
    totalProfit > 0 ? "#10B981" : totalProfit < 0 ? "#EF4444" : "#64748B";

  const profitBg =
    totalProfit > 0 ? "#022C22" : totalProfit < 0 ? "#1A0707" : "#0F172A";

  const profitBorder =
    totalProfit > 0 ? "#064E3B" : totalProfit < 0 ? "#7F1D1D" : "#1E293B";

  return (
    <div
      className="bg-card rounded-xl border border-border shadow-xs flex flex-col"
      data-ocid="profit.panel"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">💰</span>
          <h3 className="text-base font-semibold text-foreground">
            Total Profit
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Selling price minus cost price
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-4">
        {invoiceCount === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-8 text-center"
            data-ocid="profit.empty_state"
          >
            <span className="text-3xl mb-2">🧾</span>
            <p className="text-sm text-muted-foreground">
              No invoices yet — profit will appear here after sales.
            </p>
          </div>
        ) : (
          <>
            {/* Total profit */}
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: profitBg,
                border: `1px solid ${profitBorder}`,
              }}
              data-ocid="profit.success_state"
            >
              <div
                className="text-xs font-medium uppercase tracking-wide mb-1"
                style={{ color: profitColor }}
              >
                Total Net Profit
              </div>
              <div
                className="text-3xl font-bold"
                style={{ color: profitColor }}
              >
                {totalProfit >= 0 ? "+" : ""}
                {totalProfit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EGP
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: profitColor, opacity: 0.7 }}
              >
                Across {invoiceCount} invoice{invoiceCount !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Avg per invoice */}
            <div className="rounded-xl p-4 bg-muted/20 border border-border">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                Avg Profit / Invoice
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: avgProfit >= 0 ? "#A78BFA" : "#EF4444" }}
              >
                {avgProfit >= 0 ? "+" : ""}
                {avgProfit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EGP
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Per transaction average
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
