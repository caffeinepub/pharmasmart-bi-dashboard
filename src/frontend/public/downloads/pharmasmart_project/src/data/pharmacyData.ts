export const monthlyRevenue = [
  { month: "Jan", revenue: 12400, orders: 142 },
  { month: "Feb", revenue: 11800, orders: 135 },
  { month: "Mar", revenue: 13200, orders: 158 },
  { month: "Apr", revenue: 14100, orders: 167 },
  { month: "May", revenue: 15800, orders: 189 },
  { month: "Jun", revenue: 13900, orders: 162 },
  { month: "Jul", revenue: 14600, orders: 174 },
  { month: "Aug", revenue: 16200, orders: 191 },
  { month: "Sep", revenue: 15100, orders: 178 },
  { month: "Oct", revenue: 17300, orders: 203 },
  { month: "Nov", revenue: 18900, orders: 221 },
  { month: "Dec", revenue: 22100, orders: 258 },
];

export const forecastData = [
  { month: "Oct", revenue: 17300, forecast: null, lower: null, upper: null },
  { month: "Nov", revenue: 18900, forecast: null, lower: null, upper: null },
  { month: "Dec", revenue: 22100, forecast: null, lower: null, upper: null },
  {
    month: "Jan 26",
    revenue: null,
    forecast: 19800,
    lower: 18200,
    upper: 21400,
  },
  {
    month: "Feb 26",
    revenue: null,
    forecast: 20500,
    lower: 18800,
    upper: 22200,
  },
  {
    month: "Mar 26",
    revenue: null,
    forecast: 22100,
    lower: 20300,
    upper: 23900,
  },
];

export const topMedicines = [
  {
    name: "Amoxicillin 500mg",
    category: "Antibiotic",
    revenue: 8400,
    units: 1200,
  },
  {
    name: "Paracetamol 500mg",
    category: "Analgesic",
    revenue: 6200,
    units: 2800,
  },
  {
    name: "Metformin 850mg",
    category: "Antidiabetic",
    revenue: 5900,
    units: 980,
  },
  { name: "Vitamin C 1000mg", category: "Vitamin", revenue: 5100, units: 1700 },
  {
    name: "Atorvastatin 20mg",
    category: "Cardiovascular",
    revenue: 4800,
    units: 640,
  },
  {
    name: "Ibuprofen 400mg",
    category: "Analgesic",
    revenue: 4200,
    units: 1400,
  },
  {
    name: "Oseltamivir 75mg",
    category: "Antiviral",
    revenue: 3900,
    units: 390,
  },
  {
    name: "Vitamin D3 5000IU",
    category: "Vitamin",
    revenue: 3600,
    units: 1200,
  },
  {
    name: "Amlodipine 5mg",
    category: "Cardiovascular",
    revenue: 3200,
    units: 640,
  },
  {
    name: "Azithromycin 250mg",
    category: "Antibiotic",
    revenue: 2900,
    units: 290,
  },
  { name: "Augmentin", category: "Antibiotic", revenue: 5600, units: 700 },
  { name: "Panadol Extra", category: "Painkiller", revenue: 4800, units: 1600 },
  { name: "Brufen", category: "Painkiller", revenue: 3000, units: 1200 },
];

export const bottomMedicines = [
  { name: "Codeine Phosphate", category: "Analgesic", revenue: 320, units: 42 },
  { name: "Chloroquine 250mg", category: "Antiviral", revenue: 410, units: 55 },
  { name: "Iron Supplement", category: "Vitamin", revenue: 480, units: 160 },
  {
    name: "Spironolactone 25mg",
    category: "Cardiovascular",
    revenue: 540,
    units: 72,
  },
  {
    name: "Doxycycline 100mg",
    category: "Antibiotic",
    revenue: 620,
    units: 124,
  },
];

export const categoryDistribution = [
  { category: "Antibiotic", revenue: 45500, percentage: 28 },
  { category: "Analgesic", revenue: 35700, percentage: 22 },
  { category: "Antidiabetic", revenue: 29200, percentage: 18 },
  { category: "Cardiovascular", revenue: 22700, percentage: 14 },
  { category: "Vitamin", revenue: 19500, percentage: 12 },
  { category: "Antiviral", revenue: 9700, percentage: 6 },
  { category: "Painkiller", revenue: 7800, percentage: 8 },
];

export const inventoryAlerts = [
  {
    name: "Oseltamivir 75mg",
    category: "Antiviral",
    stock: 15,
    reorder: 50,
    status: "critical",
    daysLeft: 8,
  },
  {
    name: "Azithromycin 250mg",
    category: "Antibiotic",
    stock: 28,
    reorder: 40,
    status: "low",
    daysLeft: 12,
  },
  {
    name: "Atorvastatin 20mg",
    category: "Cardiovascular",
    stock: 35,
    reorder: 45,
    status: "low",
    daysLeft: 19,
  },
  {
    name: "Codeine Phosphate",
    category: "Analgesic",
    stock: 42,
    reorder: 30,
    status: "ok",
    daysLeft: 45,
  },
  {
    name: "Metformin 850mg",
    category: "Antidiabetic",
    stock: 120,
    reorder: 80,
    status: "ok",
    daysLeft: 88,
  },
  {
    name: "Paracetamol 500mg",
    category: "Analgesic",
    stock: 450,
    reorder: 200,
    status: "ok",
    daysLeft: 115,
  },
];

export const stockClassification = [
  {
    name: "Paracetamol 500mg",
    category: "Analgesic",
    monthlySales: 233,
    classification: "fast",
  },
  {
    name: "Amoxicillin 500mg",
    category: "Antibiotic",
    monthlySales: 100,
    classification: "fast",
  },
  {
    name: "Vitamin C 1000mg",
    category: "Vitamin",
    monthlySales: 142,
    classification: "fast",
  },
  {
    name: "Metformin 850mg",
    category: "Antidiabetic",
    monthlySales: 82,
    classification: "fast",
  },
  {
    name: "Ibuprofen 400mg",
    category: "Analgesic",
    monthlySales: 117,
    classification: "fast",
  },
  {
    name: "Atorvastatin 20mg",
    category: "Cardiovascular",
    monthlySales: 53,
    classification: "slow",
  },
  {
    name: "Amlodipine 5mg",
    category: "Cardiovascular",
    monthlySales: 53,
    classification: "slow",
  },
  {
    name: "Azithromycin 250mg",
    category: "Antibiotic",
    monthlySales: 24,
    classification: "slow",
  },
  {
    name: "Oseltamivir 75mg",
    category: "Antiviral",
    monthlySales: 33,
    classification: "slow",
  },
  {
    name: "Codeine Phosphate",
    category: "Analgesic",
    monthlySales: 4,
    classification: "dead",
  },
  {
    name: "Chloroquine 250mg",
    category: "Antiviral",
    monthlySales: 5,
    classification: "dead",
  },
  {
    name: "Iron Supplement",
    category: "Vitamin",
    monthlySales: 13,
    classification: "slow",
  },
];

export const customerSegments = {
  highValue: { count: 12, avgSpent: 12630, label: "High-Value" },
  frequent: { count: 23, avgOrders: 8.4, label: "Frequent" },
  lowEngagement: { count: 15, avgSpent: 1335, label: "Low Engagement" },
  avgOrderValue: 1010,
};

export const topCustomers = [
  {
    name: "Ahmed Hassan",
    orders: 14,
    totalSpent: 18600,
    segment: "high-value",
  },
  {
    name: "Sara Mohamed",
    orders: 11,
    totalSpent: 14700,
    segment: "high-value",
  },
  { name: "Khaled Ali", orders: 9, totalSpent: 12300, segment: "frequent" },
  { name: "Mona Ibrahim", orders: 12, totalSpent: 11400, segment: "frequent" },
  { name: "Omar Youssef", orders: 8, totalSpent: 9600, segment: "frequent" },
];

export const recommendations = [
  {
    priority: "high",
    category: "Sales",
    title: "Promote Antibiotic Bundle Packages",
    description:
      "Bundle Amoxicillin + Azithromycin with a 10% discount to increase basket size and move slow Azithromycin stock.",
    impact: "+12% revenue potential",
    icon: "TrendingUp",
  },
  {
    priority: "high",
    category: "Inventory",
    title: "Emergency Restock: Oseltamivir",
    description:
      "Current stock of 15 units will run out in 8 days. Order 200 units immediately to avoid 3,900 EGP in lost sales.",
    impact: "Prevent 3,900 EGP loss",
    icon: "AlertTriangle",
  },
  {
    priority: "medium",
    category: "Customer",
    title: "Launch Loyalty Program",
    description:
      "Top 20% of customers generate 68% of revenue. A points-based loyalty program will increase their retention.",
    impact: "+8% customer retention",
    icon: "Users",
  },
  {
    priority: "medium",
    category: "Waste",
    title: "FIFO Rotation for Vitamins",
    description:
      "Vitamin D3 and Iron Supplement show near-expiry risk. Implement FIFO stock rotation to minimize waste.",
    impact: "Reduce waste by 30%",
    icon: "RefreshCw",
  },
  {
    priority: "low",
    category: "Inventory",
    title: "Negotiate Bulk Discount: Paracetamol",
    description:
      "High-volume item with 450 units/month sales. Negotiating a bulk purchase contract could yield significant savings.",
    impact: "Save 800 EGP/month",
    icon: "DollarSign",
  },
  {
    priority: "low",
    category: "Sales",
    title: "Chronic Disease Medication Packages",
    description:
      "Antidiabetic and Cardiovascular customers buy monthly. Package deals will lock in recurring revenue.",
    impact: "New revenue stream",
    icon: "Package",
  },
];

export const aiDecisionLog = [
  {
    date: "Nov 2025",
    recommendation: "Restock Amoxicillin before winter flu season",
    action: "Restocked 500 units",
    outcome: "+2,400 EGP revenue",
    status: "success",
  },
  {
    date: "Oct 2025",
    recommendation: "Launch Vitamin bundle promotion",
    action: "Bundle launched at 15% discount",
    outcome: "+18% vitamin sales",
    status: "success",
  },
  {
    date: "Sep 2025",
    recommendation: "Reduce Antiviral safety stock threshold",
    action: "No action taken",
    outcome: "Stockout occurred — 1,200 EGP lost",
    status: "missed",
  },
  {
    date: "Aug 2025",
    recommendation: "Promote Metformin to new diabetic patients",
    action: "Partnered with local clinic",
    outcome: "+22 new customers",
    status: "success",
  },
];

export const aiInsights = [
  {
    type: "alert",
    message:
      "Oseltamivir stock will run out in ~8 days based on current sales velocity. Recommend immediate reorder of 200 units.",
    icon: "AlertTriangle",
  },
  {
    type: "opportunity",
    message:
      "December sales are 17% above forecast. Consider stocking up Antibiotics before flu season peaks.",
    icon: "TrendingUp",
  },
  {
    type: "pattern",
    message:
      "Customers who buy Metformin also purchase Vitamin D3 in 68% of cases. Bundle opportunity detected.",
    icon: "Sparkles",
  },
  {
    type: "risk",
    message:
      "3 medicines show declining 30-day sales trend. Review pricing strategy for Azithromycin.",
    icon: "Zap",
  },
  {
    type: "opportunity",
    message:
      "Top 12 high-value customers haven't purchased in 30+ days. A re-engagement campaign could recover 8,400 EGP.",
    icon: "Users",
  },
];

export const customerPredictions = [
  {
    name: "Ahmed Hassan",
    segment: "high-value",
    repurchaseProb: 94,
    lastPurchaseDays: 3,
    topMedicines: ["Amoxicillin 500mg", "Metformin 850mg"],
    whyHighValue:
      "14 purchases totaling 18,600 EGP. Buys chronic-disease meds monthly with no gap > 8 days.",
    trend: "up",
  },
  {
    name: "Sara Mohamed",
    segment: "high-value",
    repurchaseProb: 88,
    lastPurchaseDays: 7,
    topMedicines: ["Atorvastatin 20mg", "Vitamin C 1000mg"],
    whyHighValue:
      "Consistent high-spend buyer. Average basket 1,335 EGP. No churn signal detected.",
    trend: "stable",
  },
  {
    name: "Khaled Ali",
    segment: "frequent",
    repurchaseProb: 82,
    lastPurchaseDays: 5,
    topMedicines: ["Paracetamol 500mg", "Ibuprofen 400mg"],
    whyHighValue:
      "9 orders with short intervals. Pain-relief repeat buyer suggests chronic need.",
    trend: "up",
  },
  {
    name: "Mona Ibrahim",
    segment: "frequent",
    repurchaseProb: 76,
    lastPurchaseDays: 12,
    topMedicines: ["Metformin 850mg", "Vitamin D3 5000IU"],
    whyHighValue:
      "Diabetic medication refill pattern detected. Monthly purchase cadence.",
    trend: "stable",
  },
  {
    name: "Omar Youssef",
    segment: "frequent",
    repurchaseProb: 71,
    lastPurchaseDays: 14,
    topMedicines: ["Amoxicillin 500mg", "Oseltamivir 75mg"],
    whyHighValue:
      "Seasonal antibiotic buyer. Flu season increases purchase frequency.",
    trend: "up",
  },
  {
    name: "Layla Nasser",
    segment: "at-risk",
    repurchaseProb: 28,
    lastPurchaseDays: 38,
    topMedicines: ["Vitamin C 1000mg"],
    whyHighValue:
      "No purchase in 38 days. Previously bought monthly. Churn risk is high.",
    trend: "down",
  },
  {
    name: "Tarek Samir",
    segment: "at-risk",
    repurchaseProb: 19,
    lastPurchaseDays: 52,
    topMedicines: ["Ibuprofen 400mg"],
    whyHighValue:
      "Last 2 purchases had increasing intervals. Likely switched pharmacy.",
    trend: "down",
  },
  {
    name: "Rania Khalil",
    segment: "at-risk",
    repurchaseProb: 35,
    lastPurchaseDays: 29,
    topMedicines: ["Amlodipine 5mg"],
    whyHighValue:
      "Chronic-disease patient who missed expected monthly refill by 9 days.",
    trend: "down",
  },
];

export const medicineDemandForecast = [
  {
    name: "Amoxicillin 500mg",
    category: "Antibiotic",
    demandTier: "high",
    trend: "up",
    stockDaysLeft: 45,
    forecastUnits: 1380,
    currentStock: 180,
    whyTrend:
      "Flu season demand spike. Sales up 23% vs last month. Winter peak historically in Nov–Dec.",
  },
  {
    name: "Paracetamol 500mg",
    category: "Analgesic",
    demandTier: "high",
    trend: "stable",
    stockDaysLeft: 115,
    forecastUnits: 2800,
    currentStock: 450,
    whyTrend:
      "Consistent year-round demand. No seasonal variation detected. Safe stock level.",
  },
  {
    name: "Metformin 850mg",
    category: "Antidiabetic",
    demandTier: "high",
    trend: "up",
    stockDaysLeft: 88,
    forecastUnits: 1050,
    currentStock: 120,
    whyTrend:
      "Growing diabetic patient base. 3 new chronic patients onboarded this month.",
  },
  {
    name: "Vitamin C 1000mg",
    category: "Vitamin",
    demandTier: "medium",
    trend: "up",
    stockDaysLeft: 60,
    forecastUnits: 1900,
    currentStock: 210,
    whyTrend:
      "Pre-winter immune-boost demand. Social media health trend amplifying sales.",
  },
  {
    name: "Atorvastatin 20mg",
    category: "Cardiovascular",
    demandTier: "medium",
    trend: "stable",
    stockDaysLeft: 19,
    forecastUnits: 680,
    currentStock: 35,
    whyTrend:
      "Stable chronic patient base. Stock days critically low — reorder needed.",
  },
  {
    name: "Ibuprofen 400mg",
    category: "Analgesic",
    demandTier: "medium",
    trend: "stable",
    stockDaysLeft: 72,
    forecastUnits: 1420,
    currentStock: 240,
    whyTrend: "Consistent OTC demand. No major trend shifts detected.",
  },
  {
    name: "Oseltamivir 75mg",
    category: "Antiviral",
    demandTier: "high",
    trend: "up",
    stockDaysLeft: 8,
    forecastUnits: 460,
    currentStock: 15,
    whyTrend:
      "Flu season onset driving demand surge. Current stock critically insufficient.",
  },
  {
    name: "Vitamin D3 5000IU",
    category: "Vitamin",
    demandTier: "medium",
    trend: "up",
    stockDaysLeft: 55,
    forecastUnits: 1300,
    currentStock: 165,
    whyTrend:
      "Winter deficiency awareness campaigns boosting sales 18% vs prior month.",
  },
  {
    name: "Azithromycin 250mg",
    category: "Antibiotic",
    demandTier: "low",
    trend: "down",
    stockDaysLeft: 12,
    forecastUnits: 270,
    currentStock: 28,
    whyTrend:
      "Prescriptions declined after resistance advisories. Doctors switching to alternatives.",
  },
  {
    name: "Chloroquine 250mg",
    category: "Antiviral",
    demandTier: "low",
    trend: "down",
    stockDaysLeft: 110,
    forecastUnits: 45,
    currentStock: 120,
    whyTrend:
      "Demand dropped 40% post-pandemic. Overstocked relative to current need.",
  },
  {
    name: "Codeine Phosphate",
    category: "Analgesic",
    demandTier: "low",
    trend: "down",
    stockDaysLeft: 320,
    forecastUnits: 38,
    currentStock: 180,
    whyTrend:
      "Regulatory prescribing restrictions reduced demand significantly.",
  },
  {
    name: "Amoxicillin",
    category: "Antibiotic",
    demandTier: "high",
    trend: "up",
    stockDaysLeft: 40,
    forecastUnits: 900,
    currentStock: 100,
    whyTrend:
      "High demand antibiotic for bacterial infections. Steady prescription volume.",
  },
  {
    name: "Augmentin",
    category: "Antibiotic",
    demandTier: "high",
    trend: "up",
    stockDaysLeft: 35,
    forecastUnits: 700,
    currentStock: 75,
    whyTrend:
      "Broad-spectrum antibiotic. Increasing prescriptions for resistant infections.",
  },
  {
    name: "Panadol Extra",
    category: "Painkiller",
    demandTier: "high",
    trend: "stable",
    stockDaysLeft: 80,
    forecastUnits: 1600,
    currentStock: 200,
    whyTrend: "Popular OTC painkiller. Consistent demand year-round.",
  },
  {
    name: "Brufen",
    category: "Painkiller",
    demandTier: "medium",
    trend: "stable",
    stockDaysLeft: 70,
    forecastUnits: 1200,
    currentStock: 150,
    whyTrend: "Common anti-inflammatory. Steady prescription and OTC sales.",
  },
];

export const customerMedicineLinks = [
  {
    customerName: "Ahmed Hassan",
    topMedicines: ["Amoxicillin 500mg", "Metformin 850mg"],
    recommended: ["Vitamin D3 5000IU", "Ibuprofen 400mg"],
    linkReason: "Metformin buyers have 68% co-purchase rate with Vitamin D3",
  },
  {
    customerName: "Sara Mohamed",
    topMedicines: ["Atorvastatin 20mg", "Vitamin C 1000mg"],
    recommended: ["Amlodipine 5mg", "Vitamin D3 5000IU"],
    linkReason: "Cardiovascular patients benefit from Amlodipine co-therapy",
  },
  {
    customerName: "Khaled Ali",
    topMedicines: ["Paracetamol 500mg", "Ibuprofen 400mg"],
    recommended: ["Vitamin C 1000mg", "Amoxicillin 500mg"],
    linkReason: "Pain-relief buyers often need antibiotics during flu season",
  },
  {
    customerName: "Mona Ibrahim",
    topMedicines: ["Metformin 850mg", "Vitamin D3 5000IU"],
    recommended: ["Atorvastatin 20mg", "Vitamin C 1000mg"],
    linkReason:
      "Diabetic patients at elevated cardiovascular risk — statin co-prescription common",
  },
  {
    customerName: "Omar Youssef",
    topMedicines: ["Amoxicillin 500mg", "Oseltamivir 75mg"],
    recommended: ["Paracetamol 500mg", "Vitamin C 1000mg"],
    linkReason: "Antiviral buyers pair with fever/pain relief in 74% of cases",
  },
];

export const purchaseHistory = [
  {
    customerName: "Ahmed Hassan",
    totalOrders: 14,
    totalSpent: 18600,
    lastPurchaseDays: 3,
    transactions: [
      {
        month: "Jan",
        medicines: ["Amoxicillin 500mg", "Metformin 850mg"],
        amount: 1470,
      },
      {
        month: "Feb",
        medicines: ["Metformin 850mg", "Vitamin D3 5000IU"],
        amount: 1080,
      },
      {
        month: "Mar",
        medicines: ["Amoxicillin 500mg", "Ibuprofen 400mg", "Metformin 850mg"],
        amount: 2010,
      },
      {
        month: "Apr",
        medicines: ["Metformin 850mg", "Vitamin D3 5000IU", "Vitamin C 1000mg"],
        amount: 1335,
      },
      {
        month: "May",
        medicines: ["Amoxicillin 500mg", "Metformin 850mg"],
        amount: 1470,
      },
    ],
  },
  {
    customerName: "Sara Mohamed",
    totalOrders: 11,
    totalSpent: 14700,
    lastPurchaseDays: 7,
    transactions: [
      {
        month: "Jan",
        medicines: ["Atorvastatin 20mg", "Vitamin C 1000mg"],
        amount: 1380,
      },
      {
        month: "Feb",
        medicines: ["Atorvastatin 20mg", "Amlodipine 5mg"],
        amount: 1320,
      },
      {
        month: "Mar",
        medicines: ["Vitamin C 1000mg", "Vitamin D3 5000IU"],
        amount: 1005,
      },
      {
        month: "Apr",
        medicines: ["Atorvastatin 20mg", "Vitamin C 1000mg", "Amlodipine 5mg"],
        amount: 2145,
      },
    ],
  },
  {
    customerName: "Khaled Ali",
    totalOrders: 9,
    totalSpent: 12300,
    lastPurchaseDays: 5,
    transactions: [
      {
        month: "Feb",
        medicines: ["Paracetamol 500mg", "Ibuprofen 400mg"],
        amount: 810,
      },
      {
        month: "Mar",
        medicines: ["Amoxicillin 500mg", "Paracetamol 500mg"],
        amount: 1170,
      },
      {
        month: "Apr",
        medicines: ["Ibuprofen 400mg", "Vitamin C 1000mg"],
        amount: 915,
      },
      {
        month: "May",
        medicines: [
          "Paracetamol 500mg",
          "Amoxicillin 500mg",
          "Ibuprofen 400mg",
        ],
        amount: 1680,
      },
    ],
  },
  {
    customerName: "Mona Ibrahim",
    totalOrders: 12,
    totalSpent: 11400,
    lastPurchaseDays: 12,
    transactions: [
      {
        month: "Jan",
        medicines: ["Metformin 850mg", "Vitamin D3 5000IU"],
        amount: 1125,
      },
      {
        month: "Feb",
        medicines: ["Metformin 850mg", "Atorvastatin 20mg"],
        amount: 1320,
      },
      {
        month: "Mar",
        medicines: ["Vitamin D3 5000IU", "Vitamin C 1000mg"],
        amount: 780,
      },
      {
        month: "Apr",
        medicines: [
          "Metformin 850mg",
          "Vitamin D3 5000IU",
          "Atorvastatin 20mg",
        ],
        amount: 2145,
      },
    ],
  },
  {
    customerName: "Omar Youssef",
    totalOrders: 8,
    totalSpent: 9600,
    lastPurchaseDays: 14,
    transactions: [
      {
        month: "Feb",
        medicines: ["Amoxicillin 500mg", "Oseltamivir 75mg"],
        amount: 1425,
      },
      {
        month: "Mar",
        medicines: ["Paracetamol 500mg", "Oseltamivir 75mg"],
        amount: 1170,
      },
      {
        month: "Apr",
        medicines: ["Amoxicillin 500mg", "Vitamin C 1000mg"],
        amount: 1005,
      },
      {
        month: "May",
        medicines: [
          "Oseltamivir 75mg",
          "Amoxicillin 500mg",
          "Paracetamol 500mg",
        ],
        amount: 2280,
      },
    ],
  },
  {
    customerName: "Layla Nasser",
    totalOrders: 4,
    totalSpent: 3150,
    lastPurchaseDays: 38,
    transactions: [
      { month: "Jan", medicines: ["Vitamin C 1000mg"], amount: 570 },
      {
        month: "Mar",
        medicines: ["Vitamin C 1000mg", "Vitamin D3 5000IU"],
        amount: 1005,
      },
    ],
  },
  {
    customerName: "Tarek Samir",
    totalOrders: 3,
    totalSpent: 2175,
    lastPurchaseDays: 52,
    transactions: [
      { month: "Feb", medicines: ["Ibuprofen 400mg"], amount: 480 },
      {
        month: "Apr",
        medicines: ["Ibuprofen 400mg", "Paracetamol 500mg"],
        amount: 810,
      },
    ],
  },
  {
    customerName: "Rania Khalil",
    totalOrders: 5,
    totalSpent: 5100,
    lastPurchaseDays: 29,
    transactions: [
      { month: "Jan", medicines: ["Amlodipine 5mg"], amount: 870 },
      {
        month: "Feb",
        medicines: ["Amlodipine 5mg", "Atorvastatin 20mg"],
        amount: 1320,
      },
      {
        month: "Mar",
        medicines: ["Amlodipine 5mg", "Vitamin D3 5000IU"],
        amount: 1170,
      },
    ],
  },
];

export const medicineSimilarity = [
  {
    medicine: "Metformin 850mg",
    similar: ["Atorvastatin 20mg", "Vitamin D3 5000IU", "Amlodipine 5mg"],
    reason:
      "Diabetic patients frequently co-prescribed with cardiovascular & vitamin supplements",
  },
  {
    medicine: "Amoxicillin 500mg",
    similar: ["Azithromycin 250mg", "Paracetamol 500mg", "Vitamin C 1000mg"],
    reason: "Antibiotic therapy paired with fever relief and immune support",
  },
  {
    medicine: "Atorvastatin 20mg",
    similar: ["Amlodipine 5mg", "Metformin 850mg", "Vitamin D3 5000IU"],
    reason:
      "Statin therapy commonly combined with BP medication and supplements",
  },
  {
    medicine: "Ibuprofen 400mg",
    similar: ["Paracetamol 500mg", "Amoxicillin 500mg", "Vitamin C 1000mg"],
    reason: "NSAID buyers often add paracetamol for dual pain management",
  },
  {
    medicine: "Vitamin C 1000mg",
    similar: ["Vitamin D3 5000IU", "Amoxicillin 500mg", "Ibuprofen 400mg"],
    reason:
      "Vitamin supplementation bundle — often purchased together during cold/flu season",
  },
  {
    medicine: "Oseltamivir 75mg",
    similar: ["Amoxicillin 500mg", "Paracetamol 500mg", "Vitamin C 1000mg"],
    reason: "Antiviral treatment requires fever management and immune support",
  },
  {
    medicine: "Amlodipine 5mg",
    similar: ["Atorvastatin 20mg", "Metformin 850mg", "Vitamin D3 5000IU"],
    reason: "Hypertension patients share cardiovascular risk profile",
  },
  {
    medicine: "Vitamin D3 5000IU",
    similar: ["Vitamin C 1000mg", "Metformin 850mg", "Atorvastatin 20mg"],
    reason:
      "Supplement co-buyers — diabetic and cardiovascular patients at high deficiency risk",
  },
];

export const coPurchaseMatrix = [
  {
    medicine: "Amoxicillin",
    withMetformin: 45,
    withParacetamol: 72,
    withVitaminC: 58,
    withIbuprofen: 41,
    withAtorva: 22,
  },
  {
    medicine: "Metformin",
    withMetformin: 0,
    withParacetamol: 31,
    withVitaminC: 44,
    withIbuprofen: 28,
    withAtorva: 65,
  },
  {
    medicine: "Paracetamol",
    withMetformin: 31,
    withParacetamol: 0,
    withVitaminC: 48,
    withIbuprofen: 83,
    withAtorva: 19,
  },
  {
    medicine: "Vitamin C",
    withMetformin: 44,
    withParacetamol: 48,
    withVitaminC: 0,
    withIbuprofen: 39,
    withAtorva: 27,
  },
  {
    medicine: "Ibuprofen",
    withMetformin: 28,
    withParacetamol: 83,
    withVitaminC: 39,
    withIbuprofen: 0,
    withAtorva: 16,
  },
];
