import { Button } from "@/components/ui/button";
import {
  coPurchaseMatrix,
  customerPredictions,
  medicineDemandForecast,
  medicineSimilarity,
  purchaseHistory,
} from "@/data/pharmacyData";
import {
  CheckCircle2,
  Clock,
  GitMerge,
  Layers,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Antibiotic: { bg: "#1A2E1A", text: "#4ADE80" },
  Analgesic: { bg: "#1A1A2E", text: "#818CF8" },
  Antidiabetic: { bg: "#2E1A1A", text: "#F87171" },
  Cardiovascular: { bg: "#1A2430", text: "#38BDF8" },
  Vitamin: { bg: "#2E2A0A", text: "#FBBF24" },
  Antiviral: { bg: "#2E1A2E", text: "#C084FC" },
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? { bg: "#1E293B", text: "#94A3B8" };
}

function getMedicineCategory(name: string): string {
  const cats: Record<string, string> = {
    "Amoxicillin 500mg": "Antibiotic",
    "Azithromycin 250mg": "Antibiotic",
    "Paracetamol 500mg": "Analgesic",
    "Ibuprofen 400mg": "Analgesic",
    "Codeine Phosphate": "Analgesic",
    "Metformin 850mg": "Antidiabetic",
    "Vitamin C 1000mg": "Vitamin",
    "Vitamin D3 5000IU": "Vitamin",
    "Iron Supplement": "Vitamin",
    "Atorvastatin 20mg": "Cardiovascular",
    "Amlodipine 5mg": "Cardiovascular",
    "Spironolactone 25mg": "Cardiovascular",
    "Oseltamivir 75mg": "Antiviral",
    "Chloroquine 250mg": "Antiviral",
  };
  return cats[name] ?? "General";
}

type AlgorithmTag = "Collaborative" | "Content-Based" | "Trending";

interface Recommendation {
  medicineName: string;
  category: string;
  confidenceScore: number;
  algorithmTag: AlgorithmTag;
  reason: string;
}

function computeRecommendations(
  customerName: string,
  simulationSeed: number,
): Recommendation[] {
  const customer = purchaseHistory.find((c) => c.customerName === customerName);
  if (!customer) return [];

  // All medicines this customer has bought
  const purchased = new Set(customer.transactions.flatMap((t) => t.medicines));

  // Get customer's segment
  const prediction = customerPredictions.find((p) => p.name === customerName);
  const segment = prediction?.segment ?? "frequent";

  // Collect similar-segment customers' top medicines for collaborative filtering
  const segmentPeers = customerPredictions
    .filter((p) => p.segment === segment && p.name !== customerName)
    .flatMap((p) => p.topMedicines);
  const peerFrequency: Record<string, number> = {};
  for (const m of segmentPeers) {
    peerFrequency[m] = (peerFrequency[m] ?? 0) + 1;
  }

  // Score candidates
  const scores: Record<
    string,
    {
      score: number;
      contentBased: number;
      collaborative: number;
      trending: number;
      reason: string;
    }
  > = {};

  for (const sim of medicineSimilarity) {
    if (!purchased.has(sim.medicine)) continue;
    for (const candidate of sim.similar) {
      if (purchased.has(candidate)) continue;
      if (!scores[candidate]) {
        scores[candidate] = {
          score: 0,
          contentBased: 0,
          collaborative: 0,
          trending: 0,
          reason: sim.reason,
        };
      }
      // Content-based: +40
      scores[candidate].contentBased += 40;
      scores[candidate].score += 40;
      scores[candidate].reason = sim.reason;
    }
  }

  // Collaborative: +20 if peer segment buys it
  for (const [med, freq] of Object.entries(peerFrequency)) {
    if (purchased.has(med)) continue;
    if (!scores[med]) {
      scores[med] = {
        score: 0,
        contentBased: 0,
        collaborative: 0,
        trending: 0,
        reason: "Frequently purchased by customers in your segment",
      };
    }
    scores[med].collaborative += 20 * Math.min(freq, 2);
    scores[med].score += 20 * Math.min(freq, 2);
  }

  // Trending: +10 if high-demand
  for (const [med, data] of Object.entries(scores)) {
    const demandEntry = medicineDemandForecast.find((d) => d.name === med);
    if (demandEntry?.demandTier === "high") {
      data.trending += 10;
      data.score += 10;
      if (!data.reason) {
        data.reason = demandEntry.whyTrend;
      }
    }
  }

  // Apply simulation seed variation
  const multiplier = 0.85 + simulationSeed * 0.003;

  return Object.entries(scores)
    .map(([name, data]) => {
      const rawScore = Math.min(100, Math.round(data.score * multiplier));
      // Determine dominant algorithm
      let algorithmTag: AlgorithmTag;
      if (
        data.contentBased >= data.collaborative &&
        data.contentBased >= data.trending
      ) {
        algorithmTag = "Content-Based";
      } else if (data.collaborative >= data.trending) {
        algorithmTag = "Collaborative";
      } else {
        algorithmTag = "Trending";
      }
      return {
        medicineName: name,
        category: getMedicineCategory(name),
        confidenceScore: Math.max(10, rawScore),
        algorithmTag,
        reason: data.reason,
      };
    })
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 5);
}

function ConfidenceRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#6366F1";

  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      role="img"
      aria-label={`Confidence score: ${score}%`}
    >
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="#1E293B"
        strokeWidth="6"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={color}
      >
        {score}
      </text>
    </svg>
  );
}

const ALGO_STYLES: Record<
  AlgorithmTag,
  { bg: string; text: string; border: string }
> = {
  Collaborative: { bg: "#0F2040", text: "#60A5FA", border: "#1D4ED8" },
  "Content-Based": { bg: "#2D1B69", text: "#C4B5FD", border: "#7C3AED" },
  Trending: { bg: "#2D1B00", text: "#FCD34D", border: "#B45309" },
};

function AlgoIcon({ tag }: { tag: AlgorithmTag }) {
  if (tag === "Collaborative") return <GitMerge className="w-3 h-3" />;
  if (tag === "Content-Based") return <Layers className="w-3 h-3" />;
  return <TrendingUp className="w-3 h-3" />;
}

function SegmentBadge({ segment }: { segment: string }) {
  const cfg: Record<string, { bg: string; text: string; label: string }> = {
    "high-value": { bg: "#3B0764", text: "#E879F9", label: "High-Value" },
    frequent: { bg: "#0C2A4A", text: "#38BDF8", label: "Frequent" },
    "at-risk": { bg: "#450A0A", text: "#FCA5A5", label: "At-Risk" },
  };
  const s = cfg[segment] ?? { bg: "#1E293B", text: "#94A3B8", label: segment };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

const HEATMAP_COLS = [
  "withMetformin",
  "withParacetamol",
  "withVitaminC",
  "withIbuprofen",
  "withAtorva",
] as const;
const HEATMAP_LABELS = [
  "Metformin",
  "Paracetamol",
  "Vitamin C",
  "Ibuprofen",
  "Atorvastatin",
];

export function RecommendationEngine() {
  const [selectedCustomer, setSelectedCustomer] = useState(
    purchaseHistory[0].customerName,
  );
  const [simulationRound, setSimulationRound] = useState(1);
  const [suggested, setSuggested] = useState<Set<string>>(new Set());

  const customer = purchaseHistory.find(
    (c) => c.customerName === selectedCustomer,
  )!;
  const prediction = customerPredictions.find(
    (p) => p.name === selectedCustomer,
  );

  const recommendations = useMemo(
    () => computeRecommendations(selectedCustomer, simulationRound),
    [selectedCustomer, simulationRound],
  );

  function handleRerun() {
    setSimulationRound((r) => Math.min(r + 1, 99));
    setSuggested(new Set());
  }

  function handleCustomerChange(name: string) {
    setSelectedCustomer(name);
    setSuggested(new Set());
  }

  function handleSuggest(med: string) {
    setSuggested((prev) => new Set([...prev, med]));
  }

  return (
    <div className="p-6 space-y-6" data-ocid="rec_engine.page">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              Medicine Recommendation Engine
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Simulated AI-powered suggestions based on collaborative filtering
              &amp; purchase patterns
            </p>
          </div>
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-xs font-bold self-start mt-1"
          style={{
            backgroundColor: "#2D1B00",
            color: "#FCD34D",
            border: "1px solid #B45309",
          }}
        >
          ⚗️ Simulation Mode
        </span>
      </div>

      {/* ── Customer Selector ── */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium">
          Select Customer
        </p>
        <div className="flex flex-wrap gap-3">
          {purchaseHistory.map((c, idx) => {
            const pred = customerPredictions.find(
              (p) => p.name === c.customerName,
            );
            const isActive = c.customerName === selectedCustomer;
            return (
              <button
                key={c.customerName}
                type="button"
                data-ocid={`rec_engine.customer.item.${idx + 1}`}
                onClick={() => handleCustomerChange(c.customerName)}
                className="flex flex-col items-start px-4 py-3 rounded-xl transition-all duration-200 border text-left"
                style={{
                  backgroundColor: isActive ? "#1A1035" : "#0F172A",
                  borderColor: isActive ? "#7C3AED" : "#1E293B",
                  boxShadow: isActive
                    ? "0 0 16px rgba(124,58,237,0.3)"
                    : "none",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User
                    className="w-3.5 h-3.5"
                    style={{ color: isActive ? "#A78BFA" : "#475569" }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isActive ? "#E2E8F0" : "#94A3B8" }}
                  >
                    {c.customerName}
                  </span>
                </div>
                {pred && <SegmentBadge segment={pred.segment} />}
                <span className="text-xs mt-1" style={{ color: "#475569" }}>
                  {c.totalOrders} orders
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Customer Profile Card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCustomer}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl p-5 border border-border"
          style={{ backgroundColor: "#0A0F1E" }}
          data-ocid="rec_engine.profile.card"
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #6366F1)",
                color: "white",
              }}
            >
              {customer.customerName[0]}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {customer.customerName}
              </h3>
              {prediction && <SegmentBadge segment={prediction.segment} />}
            </div>
            <div className="flex gap-6 ml-auto flex-wrap">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">
                  {customer.totalOrders}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Orders
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: "#10B981" }}>
                  ${customer.totalSpent.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Clock className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#F59E0B" }}
                  >
                    {customer.lastPurchaseDays}d
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Since Last Purchase
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
              Purchase History
            </p>
            <div className="flex flex-wrap gap-3">
              {customer.transactions.map((tx) => (
                <div
                  key={tx.month}
                  className="rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: "#111827",
                    border: "1px solid #1E293B",
                  }}
                >
                  <div className="text-xs font-bold text-muted-foreground mb-1.5">
                    {tx.month} ·{" "}
                    <span style={{ color: "#10B981" }}>${tx.amount}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tx.medicines.map((m) => (
                      <span
                        key={m}
                        className="inline-block px-2 py-0.5 rounded-full text-xs"
                        style={{ backgroundColor: "#1E293B", color: "#94A3B8" }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Recommendation Panel ── */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ backgroundColor: "#080D1A" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: "#A78BFA" }} />
            <h3 className="text-base font-bold text-foreground">
              AI Recommendations
            </h3>
            <span className="text-xs text-muted-foreground">
              for {selectedCustomer}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "#475569" }}>
              Simulation Round #{simulationRound}
            </span>
            <Button
              size="sm"
              onClick={handleRerun}
              data-ocid="rec_engine.rerun.button"
              className="flex items-center gap-1.5 text-xs"
              style={{
                backgroundColor: "#1E1B4B",
                color: "#A78BFA",
                border: "1px solid #4338CA",
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-run Simulation
            </Button>
          </div>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCustomer}-${simulationRound}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, staggerChildren: 0.05 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-4"
            >
              {recommendations.map((rec, idx) => {
                const isSuggested = suggested.has(rec.medicineName);
                const catColor = getCategoryColor(rec.category);
                const algoStyle = ALGO_STYLES[rec.algorithmTag];
                const isLast =
                  idx === recommendations.length - 1 &&
                  recommendations.length % 2 !== 0;
                return (
                  <motion.div
                    key={rec.medicineName}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className={`rounded-xl p-4 border hover:border-violet-700 transition-all duration-200 ${isLast ? "xl:col-span-2" : ""}`}
                    style={{
                      backgroundColor: "#0F172A",
                      borderColor: "#1E293B",
                    }}
                    data-ocid={`rec_engine.rec.item.${idx + 1}`}
                  >
                    <div className="flex items-start gap-4">
                      <ConfidenceRing score={rec.confidenceScore} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-base font-bold text-foreground">
                            {rec.medicineName}
                          </h4>
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: catColor.bg,
                              color: catColor.text,
                            }}
                          >
                            {rec.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: algoStyle.bg,
                              color: algoStyle.text,
                              border: `1px solid ${algoStyle.border}`,
                            }}
                          >
                            <AlgoIcon tag={rec.algorithmTag} />
                            {rec.algorithmTag}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · Confidence: {rec.confidenceScore}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {rec.reason}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSuggest(rec.medicineName)}
                          disabled={isSuggested}
                          data-ocid={`rec_engine.suggest.button.${idx + 1}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                          style={{
                            backgroundColor: isSuggested
                              ? "#052E16"
                              : "#2D1B69",
                            color: isSuggested ? "#4ADE80" : "#C4B5FD",
                            border: `1px solid ${isSuggested ? "#15803D" : "#7C3AED"}`,
                            cursor: isSuggested ? "default" : "pointer",
                          }}
                        >
                          {isSuggested ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Suggested
                              ✓
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" /> Suggest to
                              Customer
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {recommendations.length === 0 && (
                <div
                  className="xl:col-span-2 py-12 text-center"
                  data-ocid="rec_engine.rec.empty_state"
                >
                  <Sparkles
                    className="w-10 h-10 mx-auto mb-3"
                    style={{ color: "#334155" }}
                  />
                  <p className="text-muted-foreground text-sm">
                    No recommendations available for this customer.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Co-Purchase Heatmap ── */}
      <div
        className="rounded-xl border border-border p-5"
        style={{ backgroundColor: "#080D1A" }}
      >
        <h3 className="text-base font-bold text-foreground mb-1">
          Co-Purchase Frequency Matrix
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          Percentage of transactions where two medicines were bought together.
          Darker = stronger correlation.
        </p>
        <div className="overflow-x-auto">
          <table
            className="w-full text-xs"
            data-ocid="rec_engine.heatmap.table"
          >
            <thead>
              <tr>
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium w-28">
                  Medicine
                </th>
                {HEATMAP_LABELS.map((l) => (
                  <th
                    key={l}
                    className="py-2 px-2 text-center text-muted-foreground font-medium"
                  >
                    {l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coPurchaseMatrix.map((row, ri) => (
                <tr
                  key={row.medicine}
                  data-ocid={`rec_engine.heatmap.row.${ri + 1}`}
                >
                  <td className="py-1.5 pr-4 font-semibold text-foreground">
                    {row.medicine}
                  </td>
                  {HEATMAP_COLS.map((col) => {
                    const val = row[col] as number;
                    const alpha = val === 0 ? 0 : 0.08 + (val / 100) * 0.82;
                    return (
                      <td
                        key={col}
                        className="py-1.5 px-2 text-center font-mono rounded"
                        style={{
                          backgroundColor:
                            val === 0
                              ? "transparent"
                              : `rgba(124,58,237,${alpha})`,
                          color:
                            val > 60
                              ? "#E2E8F0"
                              : val > 30
                                ? "#94A3B8"
                                : "#475569",
                          minWidth: "80px",
                        }}
                      >
                        {val > 0 ? `${val}%` : "–"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Algorithm Explainer ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {[
          {
            tag: "Collaborative" as AlgorithmTag,
            icon: GitMerge,
            title: "Collaborative Filtering",
            desc: "Recommends medicines bought by similar customers with the same purchase segment and behavior patterns.",
            ...ALGO_STYLES.Collaborative,
          },
          {
            tag: "Content-Based" as AlgorithmTag,
            icon: Layers,
            title: "Content-Based Filtering",
            desc: "Suggests medicines with therapeutic similarity — same disease area, co-prescribed combinations, known drug interactions.",
            ...ALGO_STYLES["Content-Based"],
          },
          {
            tag: "Trending" as AlgorithmTag,
            icon: TrendingUp,
            title: "Trending Boost",
            desc: "Amplifies recommendations for high-demand medicines currently trending in the pharmacy's sales data.",
            ...ALGO_STYLES.Trending,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl p-5 border"
              style={{ backgroundColor: card.bg, borderColor: card.border }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  className="w-4.5 h-4.5"
                  style={{ color: card.text, width: "18px", height: "18px" }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: card.text }}
                >
                  {card.title}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
