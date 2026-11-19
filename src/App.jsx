import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Brain,
  Package,
  ThermometerSnowflake,
  Bell,
  Route,
  CalendarClock,
  Leaf,
  Sparkles,
  FileText,
  Cpu,
  Search,
  Clock,
  ShieldCheck,
  X,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Warehouse,
  Truck,
  Plus,
  RefreshCw,
  Info,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Download,
  Users
} from 'lucide-react';
import {
  AreaChart,
  Area,
  Line,
  LineChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// ============================================================================
// DOMAIN CONSTANTS & CATEGORY-SPECIFIC THRESHOLDS (NO UNIVERSAL THRESHOLD)
// ============================================================================
const CURRENT_REF_DATE = '2026-11-19';

const CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Meat',
  'Seafood',
  'Bakery',
  'Grains',
  'Prepared Foods'
];

const CATEGORY_THRESHOLDS = {
  Seafood: { minTemp: -1, maxTemp: 2, minHum: 80, maxHum: 95, shelfLifeDays: 4, sensitivity: 1.35 },
  Meat: { minTemp: 0, maxTemp: 3, minHum: 75, maxHum: 90, shelfLifeDays: 5, sensitivity: 1.30 },
  Dairy: { minTemp: 1, maxTemp: 4, minHum: 70, maxHum: 85, shelfLifeDays: 10, sensitivity: 1.20 },
  'Prepared Foods': { minTemp: 1, maxTemp: 4, minHum: 65, maxHum: 85, shelfLifeDays: 5, sensitivity: 1.25 },
  Vegetables: { minTemp: 2, maxTemp: 7, minHum: 85, maxHum: 95, shelfLifeDays: 9, sensitivity: 1.10 },
  Fruits: { minTemp: 4, maxTemp: 10, minHum: 80, maxHum: 92, shelfLifeDays: 12, sensitivity: 1.05 },
  Bakery: { minTemp: 15, maxTemp: 22, minHum: 45, maxHum: 65, shelfLifeDays: 6, sensitivity: 0.90 },
  Grains: { minTemp: 12, maxTemp: 22, minHum: 40, maxHum: 60, shelfLifeDays: 180, sensitivity: 0.65 }
};

const TREND_7D = [
  { day: 'Nov 13', avgRisk: 34, tempAvg: 4.1 },
  { day: 'Nov 14', avgRisk: 37, tempAvg: 4.4 },
  { day: 'Nov 15', avgRisk: 41, tempAvg: 4.8 },
  { day: 'Nov 16', avgRisk: 39, tempAvg: 4.5 },
  { day: 'Nov 17', avgRisk: 44, tempAvg: 5.1 },
  { day: 'Nov 18', avgRisk: 42, tempAvg: 4.7 },
  { day: 'Nov 19', avgRisk: 43, tempAvg: 4.9 }
];

const TREND_30D = [
  { day: 'Wk 1 (Oct 22)', avgRisk: 48, tempAvg: 5.4 },
  { day: 'Wk 2 (Oct 29)', avgRisk: 45, tempAvg: 5.0 },
  { day: 'Wk 3 (Nov 05)', avgRisk: 41, tempAvg: 4.6 },
  { day: 'Wk 4 (Nov 12)', avgRisk: 39, tempAvg: 4.3 },
  { day: 'Current', avgRisk: 43, tempAvg: 4.9 }
];

const TEMP_HISTORY_ZONES = [
  { time: '00:00', seafoodVault: 1.6, meatLocker: 1.9, dairyCooler: 2.8, produceBay: 5.4 },
  { time: '04:00', seafoodVault: 1.9, meatLocker: 2.1, dairyCooler: 3.0, produceBay: 5.6 },
  { time: '08:00', seafoodVault: 2.4, meatLocker: 2.5, dairyCooler: 3.4, produceBay: 6.1 },
  { time: '12:00', seafoodVault: 4.1, meatLocker: 3.6, dairyCooler: 4.2, produceBay: 7.3 },
  { time: '16:00', seafoodVault: 5.0, meatLocker: 4.4, dairyCooler: 4.8, produceBay: 7.9 },
  { time: '18:00', seafoodVault: 5.4, meatLocker: 4.9, dairyCooler: 5.1, produceBay: 8.2 }
];

const MODEL_COMPARISON_DATA = [
  { model: 'Gradient Boosting (XGBoost)', accuracy: 95.4, precision: 94.1, recall: 95.8, f1: 94.9, status: 'Primary Candidate' },
  { model: 'Random Forest Classifier', accuracy: 94.2, precision: 92.8, recall: 95.1, f1: 93.9, status: 'Ensemble Backup' },
  { model: 'Decision Tree Classifier', accuracy: 89.1, precision: 87.4, recall: 88.9, f1: 88.1, status: 'Interpretable Baseline' },
  { model: 'Logistic Regression', accuracy: 86.5, precision: 84.2, recall: 85.9, f1: 85.0, status: 'Linear Reference' }
];

const FEATURE_IMPORTANCE_DATA = [
  { feature: 'Thermal Deviation (°C)', importance: 0.36 },
  { feature: 'Storage Age Ratio', importance: 0.24 },
  { feature: 'Relative Humidity Delta', importance: 0.16 },
  { feature: 'Category Perishability', importance: 0.11 },
  { feature: 'Transit Delay Exposure', importance: 0.08 },
  { feature: 'Packaging Containment', importance: 0.05 }
];

const TEAM_MEMBERS = [
  {
    role: 'Member 1 — Data Collection & Preprocessing Lead',
    modules: 'Dataset Schema • Threshold Engineering • EDA',
    deliverables: 'Curates multi-category cold-chain telemetry, defines category-specific thermal/humidity limits, and engineers shelf-life decay ratios.'
  },
  {
    role: 'Member 2 — Machine Learning & Explainability Lead',
    modules: 'AI Risk Predictor • Model Benchmarks • Feature Attribution',
    deliverables: 'Builds Gradient Boosting & Random Forest pipelines, validation confusion matrices, and transparent factor contribution explanations.'
  },
  {
    role: 'Member 3 — Frontend & Command Center UI Lead',
    modules: 'Command Center • Inventory CRUD • Interactive Charts',
    deliverables: 'Architects the responsive SaaS dashboard, dynamic KPI cards, risk gauges, filtering workflows, and real-time state updates.'
  },
  {
    role: 'Member 4 — Integration, Traceability & Analytics Lead',
    modules: 'Alert Center • 7-Stage Traceability • Sustainability & CSV/PDF Reports',
    deliverables: 'Implements FastAPI endpoint contracts, excursion alerting, end-to-end batch provenance timelines, waste metrics, and report exports.'
  }
];

// ============================================================================
// INITIAL 20-BATCH REALISTIC DEMO DATASET
// ============================================================================
const INITIAL_BATCHES = [
  { id: 'FCS-1001', name: 'Atlantic Salmon Fillets', category: 'Seafood', qty: 420, location: 'Cold Vault A1', temp: 5.4, hum: 89, received: '2026-11-16', expiry: '2026-11-20', status: 'Flagged', transport: 'Delayed / Compromised', packaging: 'Vacuum Sealed', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-SEA-01' },
  { id: 'FCS-1002', name: 'Organic Baby Spinach', category: 'Vegetables', qty: 310, location: 'Chill Zone B2', temp: 8.3, hum: 96, received: '2026-11-15', expiry: '2026-11-21', status: 'Flagged', transport: 'Moderate Fluctuation', packaging: 'Modified Atmosphere (MAP)', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-VEG-02' },
  { id: 'FCS-1003', name: 'Pasteurized Whole Milk', category: 'Dairy', qty: 1250, location: 'Dairy Cooler C1', temp: 2.5, hum: 78, received: '2026-11-17', expiry: '2026-11-26', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'HDPE Jugs', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-DRY-03' },
  { id: 'FCS-1004', name: 'Wild Tiger Prawns', category: 'Seafood', qty: 280, location: 'Reefer Fleet #04', temp: 4.9, hum: 91, received: '2026-11-17', expiry: '2026-11-20', status: 'In Transit', transport: 'Delayed / Compromised', packaging: 'Standard Cardboard', storageMethod: 'Reefer Fleet', sensorId: 'IOT-SEA-04' },
  { id: 'FCS-1005', name: 'Roma Vine Tomatoes', category: 'Fruits', qty: 860, location: 'Produce Bay D1', temp: 7.4, hum: 86, received: '2026-11-16', expiry: '2026-11-25', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Ventilated Crates', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-FRT-05' },
  { id: 'FCS-1006', name: 'Free-Range Chicken Breast', category: 'Meat', qty: 640, location: 'Meat Locker A2', temp: 4.8, hum: 84, received: '2026-11-16', expiry: '2026-11-21', status: 'Flagged', transport: 'Moderate Fluctuation', packaging: 'Vacuum Sealed', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-MET-06' },
  { id: 'FCS-1007', name: 'Cavendish Bananas', category: 'Fruits', qty: 1450, location: 'Ripening Chamber D2', temp: 13.6, hum: 90, received: '2026-11-14', expiry: '2026-11-22', status: 'In Storage', transport: 'Moderate Fluctuation', packaging: 'Ventilated Crates', storageMethod: 'Controlled Atmosphere', sensorId: 'IOT-FRT-07' },
  { id: 'FCS-1008', name: 'Greek Probiotic Yogurt', category: 'Dairy', qty: 520, location: 'Dairy Cooler C2', temp: 5.9, hum: 82, received: '2026-11-14', expiry: '2026-11-23', status: 'Flagged', transport: 'Moderate Fluctuation', packaging: 'HDPE Jugs', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-DRY-08' },
  { id: 'FCS-1009', name: 'Honeycrisp Apples', category: 'Fruits', qty: 1900, location: 'Controlled Vault D3', temp: 4.6, hum: 87, received: '2026-11-10', expiry: '2026-12-08', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Ventilated Crates', storageMethod: 'Controlled Atmosphere', sensorId: 'IOT-FRT-09' },
  { id: 'FCS-1010', name: 'Aged Cheddar Blocks', category: 'Dairy', qty: 740, location: 'Dairy Cooler C1', temp: 3.1, hum: 76, received: '2026-11-08', expiry: '2026-12-15', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Vacuum Sealed', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-DRY-10' },
  { id: 'FCS-1011', name: 'Artisan Sourdough Loaves', category: 'Bakery', qty: 380, location: 'Ambient Bay E1', temp: 23.6, hum: 71, received: '2026-11-17', expiry: '2026-11-21', status: 'In Storage', transport: 'Moderate Fluctuation', packaging: 'Modified Atmosphere (MAP)', storageMethod: 'Climate Controlled Dry', sensorId: 'IOT-BKR-11' },
  { id: 'FCS-1012', name: 'Basmati Long-Grain Rice', category: 'Grains', qty: 3200, location: 'Dry Silo F1', temp: 18.2, hum: 50, received: '2026-10-25', expiry: '2027-04-25', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Unsealed / Bulk Crate', storageMethod: 'Climate Controlled Dry', sensorId: 'IOT-GRN-12' },
  { id: 'FCS-1013', name: 'Chilled Quinoa Meal Bowls', category: 'Prepared Foods', qty: 460, location: 'Reefer Fleet #07', temp: 6.5, hum: 83, received: '2026-11-17', expiry: '2026-11-20', status: 'In Transit', transport: 'Delayed / Compromised', packaging: 'Modified Atmosphere (MAP)', storageMethod: 'Reefer Fleet', sensorId: 'IOT-PRP-13' },
  { id: 'FCS-1014', name: 'Bluefin Tuna Loins', category: 'Seafood', qty: 190, location: 'Cold Vault A1', temp: 0.8, hum: 86, received: '2026-11-18', expiry: '2026-11-22', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Vacuum Sealed', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-SEA-14' },
  { id: 'FCS-1015', name: 'Fresh Mozzarella Curds', category: 'Dairy', qty: 340, location: 'Dock Staging B1', temp: 6.8, hum: 88, received: '2026-11-16', expiry: '2026-11-21', status: 'Flagged', transport: 'Delayed / Compromised', packaging: 'Standard Cardboard', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-DRY-15' },
  { id: 'FCS-1016', name: 'Grass-Fed Beef Tenderloin', category: 'Meat', qty: 510, location: 'Meat Locker A2', temp: 1.4, hum: 81, received: '2026-11-17', expiry: '2026-11-24', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Vacuum Sealed', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-MET-16' },
  { id: 'FCS-1017', name: 'Hydroponic Butter Lettuce', category: 'Vegetables', qty: 275, location: 'Chill Zone B3', temp: 5.1, hum: 90, received: '2026-11-16', expiry: '2026-11-22', status: 'In Transit', transport: 'Optimal Cold Chain', packaging: 'Perforated Film', storageMethod: 'Reefer Fleet', sensorId: 'IOT-VEG-17' },
  { id: 'FCS-1018', name: 'Whole Wheat Brioche Buns', category: 'Bakery', qty: 490, location: 'Ambient Bay E2', temp: 19.8, hum: 56, received: '2026-11-18', expiry: '2026-11-24', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Modified Atmosphere (MAP)', storageMethod: 'Climate Controlled Dry', sensorId: 'IOT-BKR-18' },
  { id: 'FCS-1019', name: 'Herb Pasta Ready Kits', category: 'Prepared Foods', qty: 580, location: 'Chill Zone B2', temp: 3.2, hum: 77, received: '2026-11-18', expiry: '2026-11-23', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Modified Atmosphere (MAP)', storageMethod: 'Refrigerated Cold Room', sensorId: 'IOT-PRP-19' },
  { id: 'FCS-1020', name: 'Organic Rolled Oats', category: 'Grains', qty: 2400, location: 'Dry Silo F2', temp: 19.5, hum: 64, received: '2026-11-02', expiry: '2027-03-15', status: 'In Storage', transport: 'Optimal Cold Chain', packaging: 'Unsealed / Bulk Crate', storageMethod: 'Climate Controlled Dry', sensorId: 'IOT-GRN-20' }
];

const INITIAL_ALERTS = [
  { id: 'ALT-901', type: 'Temperature Excursion', batchId: 'FCS-1001', severity: 'Critical', time: '12 mins ago', desc: 'Atlantic Salmon Fillets in Cold Vault A1 reached 5.4°C (+3.4°C above 2.0°C seafood limit).', action: 'Verify Vault A1 evaporator coil and prioritize local QA inspection.', status: 'Unresolved' },
  { id: 'ALT-902', type: 'Critical Spoilage Risk', batchId: 'FCS-1004', severity: 'Critical', time: '28 mins ago', desc: 'Wild Tiger Prawns on Reefer Fleet #04 logged 4.9°C during delayed transit.', action: 'Expedite cold-dock receiving and perform sensory check.', status: 'Unresolved' },
  { id: 'ALT-903', type: 'Temperature Excursion', batchId: 'FCS-1013', severity: 'High', time: '1 hr ago', desc: 'Chilled Quinoa Meal Bowls in Reefer Fleet #07 rose to 6.5°C (4.0°C ceiling exceeded).', action: 'Inspect reefer door seal and prioritize FEFO dispatch.', status: 'Unresolved' },
  { id: 'ALT-904', type: 'Humidity Anomaly', batchId: 'FCS-1002', severity: 'High', time: '2 hrs ago', desc: 'Organic Baby Spinach chamber humidity hit 96% alongside 8.3°C temperature drift.', action: 'Increase airflow circulation in Chill Zone B2.', status: 'Unresolved' },
  { id: 'ALT-905', type: 'Expiry Approaching', batchId: 'FCS-1015', severity: 'High', time: '4 hrs ago', desc: 'Fresh Mozzarella Curds at Dock Staging B1 recorded 6.8°C with 2 days remaining.', action: 'Transfer immediately to Dairy Cooler C1.', status: 'Acknowledged' },
  { id: 'ALT-906', type: 'Humidity Anomaly', batchId: 'FCS-1020', severity: 'Medium', time: '6 hrs ago', desc: 'Dry Silo F2 relative humidity reached 64% (above 60% grain storage ceiling).', action: 'Activate silo dehumidifier cycle.', status: 'Resolved' }
];

// ============================================================================
// DETERMINISTIC MULTI-FACTOR PREDICTION ENGINE & HELPERS
// ============================================================================
function daysDiff(dateStart, dateEnd) {
  const d1 = new Date(dateStart);
  const d2 = new Date(dateEnd);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function getRiskBadgeStyle(level) {
  if (level === 'Critical Risk') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (level === 'High Risk') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (level === 'Moderate Risk') return 'bg-sky-50 text-sky-700 border-sky-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

function computeSpoilagePrediction(params) {
  const category = params.category || 'Fruits';
  const cfg = CATEGORY_THRESHOLDS[category] || CATEGORY_THRESHOLDS.Fruits;
  const temp = Number(params.temperature ?? params.temp ?? 4);
  const hum = Number(params.humidity ?? params.hum ?? 85);
  const storageDays = Number(params.storageDuration ?? 2);
  const transitHours = Number(params.transitDuration ?? 6);
  const transportCondition = params.transportCondition ?? params.transport ?? 'Optimal Cold Chain';
  const packaging = params.packaging ?? 'Vacuum Sealed';

  // 1. Temperature Deviation (max 38 pts)
  let tempImpact = 4;
  let tempDetail = `Within ${cfg.minTemp}–${cfg.maxTemp}°C range`;
  if (temp > cfg.maxTemp) {
    const delta = temp - cfg.maxTemp;
    tempImpact = Math.min(38, Math.round(9 + delta * 4.5 * cfg.sensitivity));
    tempDetail = `+${delta.toFixed(1)}°C over ${cfg.maxTemp}°C limit`;
  } else if (temp < cfg.minTemp) {
    const under = cfg.minTemp - temp;
    tempImpact = Math.min(22, Math.round(6 + under * 3));
    tempDetail = `-${under.toFixed(1)}°C below ${cfg.minTemp}°C floor`;
  }

  // 2. Storage Age Ratio (max 24 pts)
  const ageRatio = storageDays / Math.max(1, cfg.shelfLifeDays);
  const ageImpact = Math.min(24, Math.max(2, Math.round(ageRatio * 22 * cfg.sensitivity)));

  // 3. Relative Humidity Variance (max 18 pts)
  let humImpact = 3;
  let humDetail = `${hum}% RH balanced`;
  if (hum > cfg.maxHum) {
    const excessH = hum - cfg.maxHum;
    humImpact = Math.min(18, Math.round(6 + excessH * 1.3));
    humDetail = `+${excessH}% over ${cfg.maxHum}% limit`;
  } else if (hum < cfg.minHum) {
    const lowH = cfg.minHum - hum;
    humImpact = Math.min(15, Math.round(5 + lowH * 0.7));
    humDetail = `-${lowH}% under ${cfg.minHum}% floor`;
  }

  // 4. Transit & Logistics Exposure (max 15 pts)
  const transportBonus =
    transportCondition === 'Delayed / Compromised'
      ? 9
      : transportCondition === 'Moderate Fluctuation'
      ? 4
      : 0;
  const transitImpact = Math.min(15, Math.max(1, Math.round((transitHours / 24) * 6 + transportBonus)));

  // 5. Packaging Containment Factor (max 10 pts)
  const pkgPenalty =
    packaging === 'Unsealed / Bulk Crate'
      ? 8
      : packaging === 'Standard Cardboard'
      ? 6
      : packaging === 'Ventilated Crates' || packaging === 'Perforated Film'
      ? 4
      : 2;

  const rawScore = tempImpact + ageImpact + humImpact + transitImpact + pkgPenalty;
  const riskScore = Math.min(99, Math.max(5, Math.round(rawScore)));

  let riskLevel = 'Low Risk';
  let priority = 'P4 — Standard Rotation';
  if (riskScore >= 75) {
    riskLevel = 'Critical Risk';
    priority = 'P1 — Immediate QA & Quarantine';
  } else if (riskScore >= 55) {
    riskLevel = 'High Risk';
    priority = 'P2 — Expedited FEFO Dispatch';
  } else if (riskScore >= 30) {
    riskLevel = 'Moderate Risk';
    priority = 'P3 — Enhanced Telemetry Watch';
  }

  const estDaysLeft = Math.max(0.5, cfg.shelfLifeDays * (1 - riskScore / 108));
  const remainingWindow =
    riskScore >= 75
      ? '< 24 hours (Urgent Triage)'
      : `~${Math.max(1, Math.round(estDaysLeft))}–${Math.max(2, Math.round(estDaysLeft) + 2)} days`;

  const recommendations = [];
  if (temp > cfg.maxTemp) {
    recommendations.push(`Lower chamber temperature immediately into ${cfg.minTemp}°C–${cfg.maxTemp}°C range for ${category}.`);
  }
  if (hum > cfg.maxHum || hum < cfg.minHum) {
    recommendations.push(`Stabilize relative humidity between ${cfg.minHum}% and ${cfg.maxHum}% RH.`);
  }
  if (riskScore >= 75) {
    recommendations.push('Perform immediate sensory/microbial QA inspection and trigger local markdown distribution.');
  } else if (riskScore >= 55) {
    recommendations.push('Move lot to front of FEFO outbound queue and verify reefer door seals.');
  } else {
    recommendations.push('Maintain routine 15-minute IoT sensor polling and standard cold-chain handling.');
  }

  return {
    riskScore,
    riskLevel,
    priority,
    remainingWindow,
    envStatus: temp > cfg.maxTemp || temp < cfg.minTemp ? 'Thermal Excursion' : 'Within Thermal Spec',
    summary: `${category} lot assessed at ${riskScore}% spoilage risk (${riskLevel}). Primary driver: ${
      tempImpact >= ageImpact ? `Temperature deviation (${tempDetail})` : `Cumulative storage duration (${storageDays}d)`
    }.`,
    factors: [
      { name: 'Temperature Deviation', impact: tempImpact, max: 38, detail: tempDetail },
      { name: 'Storage Duration Age', impact: ageImpact, max: 24, detail: `${storageDays} days stored` },
      { name: 'Humidity Variance', impact: humImpact, max: 18, detail: humDetail },
      { name: 'Transit Exposure', impact: transitImpact, max: 15, detail: `${transitHours}h • ${transportCondition}` },
      { name: 'Packaging Barrier', impact: pkgPenalty, max: 10, detail: packaging }
    ],
    recommendations
  };
}

// ============================================================================
// MAIN APPLICATION ROOT
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedBatchModal, setSelectedBatchModal] = useState(null);
  const [traceBatchId, setTraceBatchId] = useState('FCS-1001');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Enrich batches with live prediction & remaining expiry days
  const enrichedBatches = useMemo(() => {
    return batches.map((b) => {
      const storageDuration = Math.max(1, daysDiff(b.received, CURRENT_REF_DATE));
      const remainingDays = daysDiff(CURRENT_REF_DATE, b.expiry);
      const prediction = computeSpoilagePrediction({
        category: b.category,
        temp: b.temp,
        hum: b.hum,
        storageDuration,
        transitDuration: b.status === 'In Transit' ? 16 : 6,
        transportCondition: b.transport,
        packaging: b.packaging
      });
      return {
        ...b,
        storageDuration,
        remainingDays,
        riskScore: prediction.riskScore,
        riskLevel: prediction.riskLevel,
        prediction
      };
    });
  }, [batches]);

  // Global KPIs
  const kpis = useMemo(() => {
    const totalBatches = enrichedBatches.length;
    const highRisk = enrichedBatches.filter((b) => b.riskLevel === 'High Risk').length;
    const criticalRisk = enrichedBatches.filter((b) => b.riskLevel === 'Critical Risk').length;
    const avgRisk = totalBatches
      ? Math.round(enrichedBatches.reduce((s, b) => s + b.riskScore, 0) / totalBatches)
      : 0;
    const totalQty = enrichedBatches.reduce((s, b) => s + Number(b.qty), 0);
    const prioritizedQty = enrichedBatches
      .filter((b) => b.riskScore >= 55)
      .reduce((s, b) => s + Number(b.qty), 0);
    const wastePrevented = Math.round(prioritizedQty * 0.72);
    const activeAlerts = alerts.filter((a) => a.status !== 'Resolved').length;
    const inTransit = enrichedBatches.filter((b) => b.status === 'In Transit').length;

    return {
      totalBatches,
      highRisk,
      criticalRisk,
      avgRisk,
      totalQty,
      prioritizedQty,
      wastePrevented,
      activeAlerts,
      inTransit
    };
  }, [enrichedBatches, alerts]);

  const handleAddBatch = (newBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    const pred = computeSpoilagePrediction({
      category: newBatch.category,
      temp: newBatch.temp,
      hum: newBatch.hum,
      storageDuration: 1,
      transitDuration: 6,
      transportCondition: newBatch.transport,
      packaging: newBatch.packaging
    });
    if (pred.riskScore >= 55) {
      const newAlert = {
        id: `ALT-${Math.floor(100 + Math.random() * 899)}`,
        type: pred.riskScore >= 75 ? 'Critical Spoilage Risk' : 'High-Risk Batch',
        batchId: newBatch.id,
        severity: pred.riskScore >= 75 ? 'Critical' : 'High',
        time: 'Just now',
        desc: `${newBatch.name} (${newBatch.category}) registered at ${newBatch.temp}°C with ${pred.riskScore}% predicted risk.`,
        action: pred.recommendations[0],
        status: 'Unresolved'
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
    showToast(`Batch ${newBatch.id} added & synced across dashboard.`);
  };

  const handleUpdateBatch = (updated) => {
    setBatches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    showToast(`Batch ${updated.id} updated.`);
  };

  const handleDeleteBatch = (id) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
    showToast(`Batch ${id} removed from inventory.`);
  };

  const handleSimulateSensorChange = (batchId, newTemp, newHum) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, temp: Number(newTemp), hum: Number(newHum) } : b))
    );
    const target = batches.find((b) => b.id === batchId);
    if (target) {
      const cfg = CATEGORY_THRESHOLDS[target.category];
      if (Number(newTemp) > cfg.maxTemp || Number(newHum) > cfg.maxHum) {
        const alertObj = {
          id: `ALT-${Math.floor(100 + Math.random() * 899)}`,
          type: Number(newTemp) > cfg.maxTemp ? 'Temperature Excursion' : 'Humidity Anomaly',
          batchId,
          severity: Number(newTemp) > cfg.maxTemp + 2 ? 'Critical' : 'High',
          time: 'Simulated Now',
          desc: `Sensor ${target.sensorId} (${target.name}) reported ${newTemp}°C / ${newHum}% RH (Limit: ${cfg.maxTemp}°C / ${cfg.maxHum}%).`,
          action: `Restore ${target.category} storage envelope (${cfg.minTemp}°C–${cfg.maxTemp}°C) immediately.`,
          status: 'Unresolved'
        };
        setAlerts((prev) => [alertObj, ...prev]);
        showToast(`Alert triggered for ${batchId}: threshold exceeded!`);
      } else {
        showToast(`Telemetry updated for ${batchId} within safe limits.`);
      }
    }
  };

  const handleAlertStatus = (id, status) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    showToast(`Alert ${id} marked as ${status}.`);
  };

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'prediction', label: 'AI Risk Predictor', icon: Brain },
    { id: 'inventory', label: 'Inventory & Batches', icon: Package },
    { id: 'coldchain', label: 'Cold-Chain & IoT', icon: ThermometerSnowflake },
    { id: 'alerts', label: 'Alert Center', icon: Bell, badge: kpis.activeAlerts },
    { id: 'traceability', label: 'Traceability', icon: Route },
    { id: 'expiry', label: 'Expiry & Shelf-Life', icon: CalendarClock },
    { id: 'sustainability', label: 'Waste & Sustainability', icon: Leaf },
    { id: 'insights', label: 'AI Decision Insights', icon: Sparkles },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'model', label: 'ML Model & Team', icon: Cpu }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center gap-2.5 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-emerald-950 text-emerald-50 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo */}
        <div className="p-5 border-b border-emerald-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight text-base leading-tight">
                FoodChain Sentinel
              </h1>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Predictive Loss Intelligence
              </p>
            </div>
          </div>
          <button
            className="lg:hidden text-emerald-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Mode Indicator */}
        <div className="p-4 border-t border-emerald-900/80">
          <div className="bg-emerald-900/60 rounded-xl p-3 border border-emerald-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Capstone Demo Engine
            </div>
            <p className="text-[11px] text-emerald-200/70 mt-1 leading-relaxed">
              Multi-factor heuristic scoring active. FastAPI + scikit-learn endpoint ready.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && globalSearch.trim()) {
                    setActiveTab('inventory');
                  }
                }}
                placeholder="Search Batch ID (e.g., FCS-1002), food, or location..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent focus:border-emerald-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Nov 19, 2026 • Live Telemetry
            </span>

            {/* Notification Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {kpis.activeAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {kpis.activeAlerts}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">
                      Active Alerts ({kpis.activeAlerts})
                    </span>
                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        setActiveTab('alerts');
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {alerts
                      .filter((a) => a.status !== 'Resolved')
                      .slice(0, 4)
                      .map((a) => (
                        <div key={a.id} className="p-3.5 hover:bg-slate-50 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">
                              {a.type} • {a.batchId}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full font-semibold ${
                                a.severity === 'Critical'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {a.severity}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2">{a.desc}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Team Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                ML4
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">Capstone Team</p>
                <p className="text-[11px] text-slate-500 mt-0.5">AI & Data Science</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Body */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardModule
              batches={enrichedBatches}
              kpis={kpis}
              alerts={alerts}
              onNavigate={setActiveTab}
              onInspectBatch={setSelectedBatchModal}
              onTraceBatch={(id) => {
                setTraceBatchId(id);
                setActiveTab('traceability');
              }}
            />
          )}
          {activeTab === 'prediction' && (
            <PredictionModule
              onSaveBatchToInventory={handleAddBatch}
              existingCount={batches.length}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryModule
              batches={enrichedBatches}
              initialSearch={globalSearch}
              onAddBatch={handleAddBatch}
              onUpdateBatch={handleUpdateBatch}
              onDeleteBatch={handleDeleteBatch}
              onInspectBatch={setSelectedBatchModal}
              onTraceBatch={(id) => {
                setTraceBatchId(id);
                setActiveTab('traceability');
              }}
            />
          )}
          {activeTab === 'coldchain' && (
            <ColdChainModule
              batches={enrichedBatches}
              onSimulate={handleSimulateSensorChange}
            />
          )}
          {activeTab === 'alerts' && (
            <AlertsModule alerts={alerts} onUpdateStatus={handleAlertStatus} />
          )}
          {activeTab === 'traceability' && (
            <TraceabilityModule
              batches={enrichedBatches}
              selectedId={traceBatchId}
              onSelectId={setTraceBatchId}
            />
          )}
          {activeTab === 'expiry' && (
            <ExpiryModule
              batches={enrichedBatches}
              onInspectBatch={setSelectedBatchModal}
            />
          )}
          {activeTab === 'sustainability' && (
            <SustainabilityModule batches={enrichedBatches} kpis={kpis} />
          )}
          {activeTab === 'insights' && (
            <InsightsModule batches={enrichedBatches} alerts={alerts} onNavigate={setActiveTab} />
          )}
          {activeTab === 'reports' && (
            <ReportsModule
              batches={enrichedBatches}
              alerts={alerts}
              kpis={kpis}
              showToast={showToast}
            />
          )}
          {activeTab === 'model' && <ModelPerformanceModule />}
        </main>
      </div>

      {/* Batch Detail Modal */}
      {selectedBatchModal && (
        <BatchDetailModal
          batch={selectedBatchModal}
          onClose={() => setSelectedBatchModal(null)}
          onTrace={() => {
            setTraceBatchId(selectedBatchModal.id);
            setSelectedBatchModal(null);
            setActiveTab('traceability');
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// 1. DASHBOARD — COMMAND CENTER MODULE
// ============================================================================
function DashboardModule({ batches, kpis, alerts, onNavigate, onInspectBatch, onTraceBatch }) {
  const [trendPeriod, setTrendPeriod] = useState('7d');

  const riskDistribution = useMemo(() => {
    const counts = { 'Low Risk': 0, 'Moderate Risk': 0, 'High Risk': 0, 'Critical Risk': 0 };
    batches.forEach((b) => {
      counts[b.riskLevel] = (counts[b.riskLevel] || 0) + 1;
    });
    return [
      { name: 'Low Risk', value: counts['Low Risk'], color: '#10b981' },
      { name: 'Moderate Risk', value: counts['Moderate Risk'], color: '#f59e0b' },
      { name: 'High Risk', value: counts['High Risk'], color: '#f97316' },
      { name: 'Critical Risk', value: counts['Critical Risk'], color: '#e11d48' }
    ];
  }, [batches]);

  const categoryRiskData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = batches.filter((b) => b.category === cat);
      const avg = items.length
        ? Math.round(items.reduce((s, b) => s + b.riskScore, 0) / items.length)
        : 0;
      return { category: cat, avgRisk: avg, count: items.length };
    });
  }, [batches]);

  const priorityBatches = useMemo(() => {
    return [...batches].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);
  }, [batches]);

  const dynamicInsights = useMemo(() => {
    const crit = batches.filter((b) => b.riskLevel === 'Critical Risk');
    const excursions = batches.filter((b) => b.temp > CATEGORY_THRESHOLDS[b.category].maxTemp);
    const expiringSoon = batches.filter((b) => b.remainingDays <= 3);
    return [
      `${crit.length} critical-risk batch(es) require immediate inspection and FEFO dispatch prioritization.`,
      `Thermal excursions detected across ${excursions.length} monitored batch(es) exceeding category safe limits.`,
      `${expiringSoon.length} batch(es) enter their final 72-hour shelf-life screening window.`
    ];
  }, [batches]);

  const kpiCards = [
    { label: 'Total Monitored Batches', value: kpis.totalBatches, sub: 'Across 8 food categories', trend: '+2 today', good: true, icon: Package },
    { label: 'High-Risk Batches', value: kpis.highRisk, sub: 'Score 55% – 74%', trend: 'Action advised', good: false, icon: AlertTriangle },
    { label: 'Critical-Risk Batches', value: kpis.criticalRisk, sub: 'Score ≥ 75%', trend: 'Immediate QA', good: false, icon: Zap },
    { label: 'Avg Spoilage Risk Score', value: `${kpis.avgRisk}%`, sub: 'Fleet-wide risk index', trend: '-2.4% vs wk', good: true, icon: Activity },
    { label: 'Total Food Monitored', value: `${kpis.totalQty.toLocaleString()} kg`, sub: 'Active cold & dry stock', trend: '99.2% telemetry', good: true, icon: Warehouse },
    { label: 'Est. Waste Prevented', value: `${kpis.wastePrevented.toLocaleString()} kg`, sub: 'Demo FEFO intervention est.', trend: '+14.5% yield', good: true, icon: Leaf },
    { label: 'Active Cold-Chain Alerts', value: kpis.activeAlerts, sub: 'Unresolved & acknowledged', trend: 'Live SLA', good: kpis.activeAlerts === 0, icon: Bell },
    { label: 'Batches In Transit', value: kpis.inTransit, sub: `${kpis.totalBatches - kpis.inTransit} in storage/hub`, trend: 'GPS & Reefer', good: true, icon: Truck }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Enterprise Supply Chain Intelligence
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
            FoodChain Sentinel Command Center
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('prediction')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Brain className="w-4 h-4" />
            Run AI Spoilage Prediction
          </button>
          <button
            onClick={() => onNavigate('inventory')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register Batch
          </button>
        </div>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{card.value}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{card.sub}</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full ${
                    card.good ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 1 Charts: Spoilage Risk Trend & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Spoilage Risk Index Trend</h3>
              <p className="text-xs text-slate-500">
                Average network spoilage risk score & mean cold-chain temperature
              </p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTrendPeriod('7d')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  trendPeriod === '7d' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTrendPeriod('30d')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  trendPeriod === '30d' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendPeriod === '7d' ? TREND_7D : TREND_30D}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="avgRisk"
                  name="Avg Risk Score (%)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fill="url(#riskGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="tempAvg"
                  name="Avg Temp (°C)"
                  stroke="#0284c7"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 text-base">Risk Tier Distribution</h3>
          <p className="text-xs text-slate-500 mb-2">
            Live classification across {batches.length} batches
          </p>
          <div className="h-52 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {riskDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg"
              >
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name.replace(' Risk', '')}
                </span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Category Risk Analysis & Zone Temperature Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base">Food Category Risk Analysis</h3>
          <p className="text-xs text-slate-500 mb-4">
            Mean spoilage risk score (%) by perishable category
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avgRisk" name="Avg Risk Score (%)" fill="#065f46" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base">
            Cold-Chain Zone Temperature Telemetry
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Multi-zone chamber readings (°C) — simulated IoT stream
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TEMP_HISTORY_ZONES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="seafoodVault"
                  name="Seafood Vault (°C)"
                  stroke="#e11d48"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="meatLocker"
                  name="Meat Locker (°C)"
                  stroke="#f97316"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="dairyCooler"
                  name="Dairy Cooler (°C)"
                  stroke="#0284c7"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="produceBay"
                  name="Produce Bay (°C)"
                  stroke="#059669"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: AI Insights Banner & Supply Chain Loss Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <h3 className="font-bold text-base">Rule-Based Predictive Intelligence Brief</h3>
            </div>
            <span className="text-[11px] bg-emerald-800/80 border border-emerald-700 px-2.5 py-1 rounded-full text-emerald-200">
              Live Telemetry Rules
            </span>
          </div>
          <div className="space-y-3">
            {dynamicInsights.map((text, idx) => (
              <div
                key={idx}
                className="bg-white/10 border border-white/10 rounded-xl p-3.5 text-sm flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Supply Chain Loss Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Illustrative screening & intervention impact
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Total Monitored Mass</span>
                  <span className="text-slate-900">{kpis.totalQty.toLocaleString()} kg</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-700 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Vulnerable Stock Flagged</span>
                  <span className="text-amber-700">{kpis.prioritizedQty.toLocaleString()} kg</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((kpis.prioritizedQty / Math.max(1, kpis.totalQty)) * 100)
                      )}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Est. Waste Prevented (FEFO)</span>
                  <span className="text-emerald-700">{kpis.wastePrevented.toLocaleString()} kg</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((kpis.wastePrevented / Math.max(1, kpis.totalQty)) * 100)
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('sustainability')}
            className="mt-5 w-full py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            Open Sustainability Analytics →
          </button>
        </div>
      </div>

      {/* Row 4: Priority Vulnerable Batches & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Priority Vulnerable Batches</h3>
              <p className="text-xs text-slate-500">Ranked by real-time spoilage risk score</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Full Inventory →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Product & Category</th>
                  <th className="py-3 px-4">Temp</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Expiry</th>
                  <th className="py-3 px-4">Suggested Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {priorityBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      <button onClick={() => onInspectBatch(b)} className="hover:underline">
                        {b.id}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{b.name}</div>
                      <div className="text-slate-500">
                        {b.category} • {b.qty} kg
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{b.temp}°C</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold border ${getRiskBadgeStyle(
                          b.riskLevel
                        )}`}
                      >
                        {b.riskScore}% ({b.riskLevel.replace(' Risk', '')})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{b.expiry}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {b.prediction.recommendations[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-1">Recent Supply Chain Activity</h3>
          <p className="text-xs text-slate-500 mb-4">Live telemetry, assessments & dispatch log</p>
          <div className="space-y-3.5">
            {alerts.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 last:border-0"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    a.severity === 'Critical'
                      ? 'bg-rose-500'
                      : a.severity === 'High'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{a.type}</span>
                    <span className="text-slate-400 font-normal">{a.time}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{a.desc}</p>
                  <button
                    onClick={() => onTraceBatch(a.batchId)}
                    className="text-emerald-700 font-semibold mt-1 hover:underline"
                  >
                    Trace {a.batchId} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. AI SPOILAGE RISK PREDICTION MODULE
// ============================================================================
function PredictionModule({ onSaveBatchToInventory, existingCount }) {
  const [form, setForm] = useState({
    foodName: 'Fresh Atlantic Cod',
    category: 'Seafood',
    batchId: `FCS-${1021 + existingCount}`,
    quantity: 350,
    harvestDate: '2026-11-16',
    expiryDate: '2026-11-21',
    temperature: 5.5,
    humidity: 88,
    storageDuration: 3,
    transitDuration: 10,
    packaging: 'Vacuum Sealed',
    storageMethod: 'Refrigerated Cold Room',
    transportCondition: 'Moderate Fluctuation',
    stage: 'Cold Storage Warehouse'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(() => computeSpoilagePrediction(form));

  const runPrediction = (e) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(computeSpoilagePrediction(form));
      setIsAnalyzing(false);
    }, 450);
  };

  const applyPreset = (preset) => {
    setForm((prev) => ({ ...prev, ...preset }));
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(computeSpoilagePrediction({ ...form, ...preset }));
      setIsAnalyzing(false);
    }, 350);
  };

  const handleSaveToInventory = () => {
    onSaveBatchToInventory({
      id: form.batchId,
      name: form.foodName,
      category: form.category,
      qty: Number(form.quantity),
      location: form.stage,
      temp: Number(form.temperature),
      hum: Number(form.humidity),
      received: form.harvestDate,
      expiry: form.expiryDate,
      status: result.riskScore >= 55 ? 'Flagged' : 'In Storage',
      transport: form.transportCondition,
      packaging: form.packaging,
      storageMethod: form.storageMethod,
      sensorId: `IOT-${form.category.slice(0, 3).toUpperCase()}-99`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Predictive Inference & Explainability
          </span>
          <h2 className="text-2xl font-bold text-slate-900">AI Spoilage Risk Prediction Studio</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              applyPreset({
                foodName: 'King Prawns Export Lot',
                category: 'Seafood',
                temperature: 7.2,
                humidity: 93,
                storageDuration: 4,
                transitDuration: 18,
                transportCondition: 'Delayed / Compromised',
                packaging: 'Standard Cardboard'
              })
            }
            className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-100"
          >
            Preset: Critical Cold Breach
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                foodName: 'Organic Strawberries',
                category: 'Fruits',
                temperature: 13.5,
                humidity: 91,
                storageDuration: 6,
                transitDuration: 12,
                transportCondition: 'Moderate Fluctuation',
                packaging: 'Perforated Film'
              })
            }
            className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100"
          >
            Preset: Moderate Transit Drift
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                foodName: 'Pasteurized Whole Milk',
                category: 'Dairy',
                temperature: 2.5,
                humidity: 76,
                storageDuration: 2,
                transitDuration: 4,
                transportCondition: 'Optimal Cold Chain',
                packaging: 'HDPE Jugs'
              })
            }
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100"
          >
            Preset: Optimal Cold Chain
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-900 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Demo Inference Engine Active:</strong> Scores are dynamically computed from
          thermal deviation, shelf-life elapsed ratio, humidity delta, and transit exposure. Ready
          to connect to a trained Python scikit-learn / FastAPI endpoint.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <form
          onSubmit={runPrediction}
          className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Batch & Environmental Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Food Product Name
              </label>
              <input
                type="text"
                required
                value={form.foodName}
                onChange={(e) => setForm({ ...form, foodName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Food Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Batch ID</label>
              <input
                type="text"
                required
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Quantity (kg)
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Current Storage Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Relative Humidity (%)
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={form.humidity}
                onChange={(e) => setForm({ ...form, humidity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Storage Duration (Days)
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.storageDuration}
                onChange={(e) => setForm({ ...form, storageDuration: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Est. Transit Duration (Hours)
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.transitDuration}
                onChange={(e) => setForm({ ...form, transitDuration: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Packaging Type
              </label>
              <select
                value={form.packaging}
                onChange={(e) => setForm({ ...form, packaging: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option>Vacuum Sealed</option>
                <option>Modified Atmosphere (MAP)</option>
                <option>Perforated Film</option>
                <option>HDPE Jugs</option>
                <option>Ventilated Crates</option>
                <option>Standard Cardboard</option>
                <option>Unsealed / Bulk Crate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Storage Method
              </label>
              <select
                value={form.storageMethod}
                onChange={(e) => setForm({ ...form, storageMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option>Refrigerated Cold Room</option>
                <option>Controlled Atmosphere</option>
                <option>Reefer Fleet</option>
                <option>Climate Controlled Dry</option>
                <option>Ambient / Uncontrolled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Transportation Condition
              </label>
              <select
                value={form.transportCondition}
                onChange={(e) => setForm({ ...form, transportCondition: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option>Optimal Cold Chain</option>
                <option>Moderate Fluctuation</option>
                <option>Delayed / Compromised</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Supply Chain Stage
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option>Cold Storage Warehouse</option>
                <option>Refrigerated Transit</option>
                <option>Regional Distribution Hub</option>
                <option>Retail Backroom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Production / Harvest Date
              </label>
              <input
                type="date"
                value={form.harvestDate}
                onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Expiry Date
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex-1 py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Multi-Factor Inference...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Assess Spoilage Risk
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSaveToInventory}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Save to Inventory
            </button>
          </div>
        </form>

        {/* Prediction Results & Explainability Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Prediction Output • {form.batchId}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeStyle(
                  result.riskLevel
                )}`}
              >
                {result.riskLevel}
              </span>
            </div>

            {/* Gauge Visual */}
            <div className="flex items-center gap-5 my-4">
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center border-8 border-slate-100 shrink-0"
                style={{
                  borderColor:
                    result.riskScore >= 75
                      ? '#e11d48'
                      : result.riskScore >= 55
                      ? '#f59e0b'
                      : result.riskScore >= 30
                      ? '#eab308'
                      : '#10b981'
                }}
              >
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {result.riskScore}%
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase">
                    Risk Score
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500">Priority Tier:</span>{' '}
                  <span className="font-bold text-slate-900">{result.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500">Est. Quality Window:</span>{' '}
                  <span className="font-bold text-emerald-800">{result.remainingWindow}</span>
                  <span className="block text-[10px] text-slate-400">
                    (Screening estimate only)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Environment Check:</span>{' '}
                  <span className="font-semibold text-slate-800">{result.envStatus}</span>
                </div>
              </div>
            </div>

            <p className="text-xs bg-slate-50 p-3 rounded-xl text-slate-700 border border-slate-100">
              {result.summary}
            </p>

            {/* Factor Contribution Explainability Bars */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Feature Attribution Breakdown
              </h4>
              <div className="space-y-2.5">
                {result.factors.map((f) => (
                  <div key={f.name} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">{f.name}</span>
                      <span className="text-slate-500">
                        {f.detail} (+{f.impact} pts)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((f.impact / f.max) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptive Recommendations */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Recommended Operational Actions
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. INVENTORY MANAGEMENT MODULE
// ============================================================================
function InventoryModule({
  batches,
  initialSearch,
  onAddBatch,
  onUpdateBatch,
  onDeleteBatch,
  onInspectBatch,
  onTraceBatch
}) {
  const [search, setSearch] = useState(initialSearch || '');
  const [catFilter, setCatFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState('riskDesc');
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  const [formState, setFormState] = useState({
    id: '',
    name: '',
    category: 'Vegetables',
    qty: 500,
    location: 'Chill Zone B1',
    temp: 4.5,
    hum: 88,
    received: '2026-11-18',
    expiry: '2026-11-25',
    status: 'In Storage',
    transport: 'Optimal Cold Chain',
    packaging: 'Ventilated Crates',
    storageMethod: 'Refrigerated Cold Room',
    sensorId: 'IOT-NEW-01'
  });

  const filteredBatches = useMemo(() => {
    return batches
      .filter((b) => {
        const matchesSearch =
          b.id.toLowerCase().includes(search.toLowerCase()) ||
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.location.toLowerCase().includes(search.toLowerCase());
        const matchesCat = catFilter === 'All' || b.category === catFilter;
        const matchesRisk = riskFilter === 'All' || b.riskLevel === riskFilter;
        return matchesSearch && matchesCat && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'riskDesc') return b.riskScore - a.riskScore;
        if (sortBy === 'qtyDesc') return b.qty - a.qty;
        if (sortBy === 'expiryAsc') return new Date(a.expiry) - new Date(b.expiry);
        return new Date(b.received) - new Date(a.received);
      });
  }, [batches, search, catFilter, riskFilter, sortBy]);

  const openAdd = () => {
    setEditingBatch(null);
    setFormState({
      id: `FCS-${1021 + batches.length}`,
      name: '',
      category: 'Vegetables',
      qty: 400,
      location: 'Cold Vault A2',
      temp: 4.0,
      hum: 88,
      received: '2026-11-19',
      expiry: '2026-11-26',
      status: 'In Storage',
      transport: 'Optimal Cold Chain',
      packaging: 'Vacuum Sealed',
      storageMethod: 'Refrigerated Cold Room',
      sensorId: `IOT-${100 + batches.length}`
    });
    setShowModal(true);
  };

  const openEdit = (batch) => {
    setEditingBatch(batch);
    setFormState({ ...batch });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingBatch) onUpdateBatch(formState);
    else onAddBatch(formState);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Batch & Cold Storage Registry
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm self-start"
        >
          <Plus className="w-4 h-4" />
          Add New Batch
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, food, zone..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none"
        >
          <option value="All">All Food Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none"
        >
          <option value="All">All Risk Levels</option>
          <option value="Critical Risk">Critical Risk (≥75%)</option>
          <option value="High Risk">High Risk (55–74%)</option>
          <option value="Moderate Risk">Moderate Risk (30–54%)</option>
          <option value="Low Risk">Low Risk (&lt;30%)</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none"
        >
          <option value="riskDesc">Sort: Highest Risk First</option>
          <option value="expiryAsc">Sort: Earliest Expiry</option>
          <option value="qtyDesc">Sort: Largest Quantity</option>
          <option value="recent">Sort: Newly Received</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Temp / RH</th>
                <th className="py-3.5 px-4">Expiry</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBatches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{b.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{b.name}</div>
                    <div className="text-slate-500">{b.category}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{b.qty} kg</td>
                  <td className="py-3.5 px-4 text-slate-600">{b.location}</td>
                  <td className="py-3.5 px-4 font-medium">
                    {b.temp}°C • {b.hum}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{b.expiry}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold border ${getRiskBadgeStyle(
                        b.riskLevel
                      )}`}
                    >
                      {b.riskScore}% • {b.riskLevel.replace(' Risk', '')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onInspectBatch(b)}
                        title="Inspect Batch"
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onTraceBatch(b.id)}
                        title="Trace Journey"
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      >
                        <Route className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(b)}
                        title="Edit Batch"
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBatch(b.id)}
                        title="Delete Batch"
                        className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">
                {editingBatch ? `Edit Batch ${editingBatch.id}` : 'Register New Inventory Batch'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Batch ID</label>
                <input
                  required
                  disabled={!!editingBatch}
                  value={formState.id}
                  onChange={(e) => setFormState({ ...formState, id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Category</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="font-semibold text-slate-600 block mb-1">Product Name</label>
                <input
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g., Fresh Atlantic Salmon"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  required
                  value={formState.qty}
                  onChange={(e) => setFormState({ ...formState, qty: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Storage Location</label>
                <input
                  required
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formState.temp}
                  onChange={(e) => setFormState({ ...formState, temp: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Humidity (%)</label>
                <input
                  type="number"
                  required
                  value={formState.hum}
                  onChange={(e) => setFormState({ ...formState, hum: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Date Received</label>
                <input
                  type="date"
                  required
                  value={formState.received}
                  onChange={(e) => setFormState({ ...formState, received: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={formState.expiry}
                  onChange={(e) => setFormState({ ...formState, expiry: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
                >
                  {editingBatch ? 'Save Changes' : 'Register Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. COLD CHAIN & IOT MONITORING MODULE (CATEGORY-SPECIFIC THRESHOLDS)
// ============================================================================
function ColdChainModule({ batches, onSimulate }) {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'FCS-1001');
  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const [simTemp, setSimTemp] = useState(activeBatch?.temp ?? 4);
  const [simHum, setSimHum] = useState(activeBatch?.hum ?? 85);

  const handleSelectBatch = (id) => {
    setSelectedBatchId(id);
    const found = batches.find((b) => b.id === id);
    if (found) {
      setSimTemp(found.temp);
      setSimHum(found.hum);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Simulated IoT Telemetry & Excursion Detection
        </span>
        <h2 className="text-2xl font-bold text-slate-900">
          Cold-Chain & Environmental Monitoring
        </h2>
      </div>

      {/* Category-Specific Safe Threshold Reference Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Category-Specific Thermal & Humidity Thresholds (Demo Policy)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {CATEGORIES.map((cat) => {
            const cfg = CATEGORY_THRESHOLDS[cat];
            return (
              <div
                key={cat}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="font-bold text-slate-800">{cat}</div>
                <div className="text-emerald-700 font-semibold mt-1">
                  {cfg.minTemp}°C – {cfg.maxTemp}°C
                </div>
                <div className="text-slate-500 text-[11px]">
                  {cfg.minHum}% – {cfg.maxHum}% RH
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive IoT Excursion Simulator */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Capstone Demo Simulator
            </span>
            <h3 className="text-lg font-bold">Simulate Sensor Excursion</h3>
            <p className="text-xs text-slate-300">
              Adjust temperature or humidity for any batch to demonstrate real-time violation
              alerts and dynamic spoilage recalculation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                Target Batch
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => handleSelectBatch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs outline-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id} className="text-slate-900">
                    {b.id} — {b.name} ({b.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                Simulated Temp (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={simTemp}
                onChange={(e) => setSimTemp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                Simulated Humidity (%)
              </label>
              <input
                type="number"
                value={simHum}
                onChange={(e) => setSimHum(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs outline-none"
              />
            </div>
            <button
              onClick={() => onSimulate(selectedBatchId, simTemp, simHum)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition-colors"
            >
              Push Sensor Reading
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((b) => {
          const cfg = CATEGORY_THRESHOLDS[b.category];
          const tempViolation = b.temp > cfg.maxTemp || b.temp < cfg.minTemp;
          const humViolation = b.hum > cfg.maxHum || b.hum < cfg.minHum;
          const isAlert = tempViolation || humViolation;

          return (
            <div
              key={b.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${
                isAlert ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">
                  {b.sensorId} • {b.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isAlert ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isAlert ? 'Threshold Breach' : 'Nominal'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
              <p className="text-xs text-slate-500 mb-4">
                {b.category} • {b.location}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    tempViolation ? 'bg-rose-50 text-rose-900' : 'bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="text-[11px] text-slate-500">Current Temp</div>
                  <div className="text-lg font-extrabold">{b.temp}°C</div>
                  <div className="text-[10px] text-slate-500">
                    Safe: {cfg.minTemp}–{cfg.maxTemp}°C
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    humViolation ? 'bg-amber-50 text-amber-900' : 'bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="text-[11px] text-slate-500">Humidity</div>
                  <div className="text-lg font-extrabold">{b.hum}%</div>
                  <div className="text-[10px] text-slate-500">
                    Safe: {cfg.minHum}–{cfg.maxHum}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 5. ALERT & NOTIFICATION CENTER
// ============================================================================
function AlertsModule({ alerts, onUpdateStatus }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = alerts.filter((a) => {
    const matchStatus = filter === 'All' || a.status === filter || a.severity === filter;
    const matchText =
      a.batchId.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchText;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Real-Time Exception Workflow
        </span>
        <h2 className="text-2xl font-bold text-slate-900">Alert & Notification Center</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap gap-2">
          {['All', 'Unresolved', 'Acknowledged', 'Resolved', 'Critical'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === tab
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by batch or alert type..."
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none w-64"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">{a.id}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    a.severity === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : a.severity === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {a.severity}
                </span>
                <span className="font-bold text-slate-900 text-sm">{a.type}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Batch {a.batchId}
                </span>
                <span className="text-xs text-slate-400">• {a.time}</span>
              </div>
              <p className="text-xs text-slate-700">{a.desc}</p>
              <p className="text-xs font-medium text-emerald-800">
                Recommended Action: {a.action}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  a.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-700'
                    : a.status === 'Acknowledged'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {a.status}
              </span>
              {a.status !== 'Acknowledged' && a.status !== 'Resolved' && (
                <button
                  onClick={() => onUpdateStatus(a.id, 'Acknowledged')}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800"
                >
                  Acknowledge
                </button>
              )}
              {a.status !== 'Resolved' && (
                <button
                  onClick={() => onUpdateStatus(a.id, 'Resolved')}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 rounded-xl text-white"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. SUPPLY CHAIN TRACEABILITY MODULE
// ============================================================================
function TraceabilityModule({ batches, selectedId, onSelectId }) {
  const batch = batches.find((b) => b.id === selectedId) || batches[0];

  const stages = [
    {
      stage: '1. Harvesting / Production',
      loc: 'Origin Farm / Processing Plant (Demo Node)',
      time: `${batch.received} 05:30`,
      temp: `${Math.max(1, batch.temp - 1.5).toFixed(1)}°C`,
      hum: `${batch.hum}%`,
      status: 'Verified',
      note: 'Quality grade A certified at origin.'
    },
    {
      stage: '2. Primary Packaging',
      loc: 'Automated Packing Line 02 (Demo)',
      time: `${batch.received} 08:15`,
      temp: `${Math.max(1, batch.temp - 1.2).toFixed(1)}°C`,
      hum: `${batch.hum - 2}%`,
      status: 'Completed',
      note: `Sealed using ${batch.packaging}.`
    },
    {
      stage: '3. Warehouse Receiving',
      loc: 'Regional Cold Intake Gate (Demo)',
      time: `${batch.received} 13:40`,
      temp: `${(batch.temp - 0.5).toFixed(1)}°C`,
      hum: `${batch.hum}%`,
      status: 'Logged',
      note: 'Barcode & IoT sensor paired.'
    },
    {
      stage: '4. Cold / Controlled Storage',
      loc: batch.location,
      time: 'Active Storage Phase',
      temp: `${batch.temp}°C`,
      hum: `${batch.hum}%`,
      status: batch.status,
      note: `Method: ${batch.storageMethod}.`
    },
    {
      stage: '5. Refrigerated Transportation',
      loc: 'Highway Corridor Fleet (Demo)',
      time: 'Scheduled / Active Leg',
      temp: `${batch.temp}°C`,
      hum: `${batch.hum}%`,
      status: batch.transport,
      note: 'Continuous GPS + thermal logging.'
    },
    {
      stage: '6. Distribution Hub',
      loc: 'Metro Consolidation Center (Demo)',
      time: 'Pending / Next Checkpoint',
      temp: 'Target Safe',
      hum: 'Target Safe',
      status: 'Scheduled',
      note: 'FEFO sorting queue assigned.'
    },
    {
      stage: '7. Retail / Final Destination',
      loc: 'Partner Retail Outlet (Demo)',
      time: `Prior to ${batch.expiry}`,
      temp: 'Display Chiller',
      hum: 'Standard',
      status: 'Target Window',
      note: 'Consumer shelf-life window enforced.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Farm-to-Fork Digital Twin (Simulated Journey Data)
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Supply Chain Batch Traceability</h2>
        </div>
        <select
          value={batch.id}
          onChange={(e) => onSelectId(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 outline-none"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.id} — {b.name} ({b.riskLevel})
            </option>
          ))}
        </select>
      </div>

      {/* Batch Journey Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
        <div>
          <span className="text-slate-500 block">Batch Identifier</span>
          <span className="text-base font-bold text-emerald-800">{batch.id}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Product & Mass</span>
          <span className="text-sm font-bold text-slate-900">
            {batch.name} ({batch.qty} kg)
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Current Telemetry</span>
          <span className="text-sm font-bold text-slate-900">
            {batch.temp}°C • {batch.hum}% RH
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Predicted Risk</span>
          <span
            className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full font-bold border ${getRiskBadgeStyle(
              batch.riskLevel
            )}`}
          >
            {batch.riskScore}% ({batch.riskLevel})
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Expiry Target</span>
          <span className="text-sm font-bold text-slate-900">{batch.expiry}</span>
        </div>
      </div>

      {/* 7-Stage Visual Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
          {stages.map((s, idx) => (
            <div key={idx} className="relative pl-11">
              <div className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-emerald-50">
                {idx + 1}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.stage}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    {s.loc} • <span className="text-slate-400">{s.time}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{s.note}</p>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-semibold">
                    {s.temp} / {s.hum}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                    {s.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. EXPIRY FORECAST & SHELF-LIFE INTELLIGENCE
// ============================================================================
function ExpiryModule({ batches, onInspectBatch }) {
  const [windowFilter, setWindowFilter] = useState('all');

  const filtered = useMemo(() => {
    return batches
      .filter((b) => {
        if (windowFilter === 'today') return b.remainingDays <= 1;
        if (windowFilter === '3d') return b.remainingDays <= 3;
        if (windowFilter === '7d') return b.remainingDays <= 7;
        if (windowFilter === 'high') return b.riskScore >= 55;
        return true;
      })
      .sort((a, b) => a.remainingDays - b.remainingDays);
  }, [batches, windowFilter]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          FEFO Screening & Prioritization Indicator
        </span>
        <h2 className="text-2xl font-bold text-slate-900">
          Expiry Forecast & Shelf-Life Intelligence
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Note: Estimated shelf-life windows serve as operational screening indicators and do not
          replace laboratory microbiological safety testing.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Monitored Stock' },
          { id: 'today', label: 'Expiring ≤ 24h' },
          { id: '3d', label: 'Within 3 Days' },
          { id: '7d', label: 'Within 7 Days' },
          { id: 'high', label: 'High & Critical Risk' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setWindowFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              windowFilter === f.id
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800">{b.id}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRiskBadgeStyle(
                    b.riskLevel
                  )}`}
                >
                  {b.riskScore}% Risk
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
              <p className="text-xs text-slate-500">
                {b.category} • {b.qty} kg
              </p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Target Expiry</span>
                  <span className="font-bold text-slate-800">{b.expiry}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Est. Window</span>
                  <span
                    className={`font-extrabold ${
                      b.remainingDays <= 2 ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {b.remainingDays <= 0 ? 'Immediate' : `${b.remainingDays} days`}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onInspectBatch(b)}
              className="mt-4 w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Inspect Shelf-Life Factors
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 8. FOOD WASTE PREVENTION & SUSTAINABILITY MODULE
// ============================================================================
function SustainabilityModule({ batches, kpis }) {
  const wasteByCategory = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = batches.filter((b) => b.category === cat);
      const totalKg = items.reduce((s, b) => s + b.qty, 0);
      const highRiskKg = items.filter((b) => b.riskScore >= 55).reduce((s, b) => s + b.qty, 0);
      return {
        category: cat,
        monitoredKg: totalKg,
        interceptedKg: Math.round(highRiskKg * 0.72)
      };
    });
  }, [batches]);

  const estCo2Saved = Math.round(kpis.wastePrevented * 2.5);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Loss Prevention & Resource Efficiency
        </span>
        <h2 className="text-2xl font-bold text-slate-900">
          Food Waste Prevention & Sustainability
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Note: Waste avoidance and CO₂e figures below are illustrative demo projections based on
          early FEFO intervention modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Monitored Food Mass</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {kpis.totalQty.toLocaleString()} kg
          </p>
          <p className="text-xs text-emerald-700 mt-1">100% digital batch coverage</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            High-Risk Stock Intercepted
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-2">
            {kpis.prioritizedQty.toLocaleString()} kg
          </p>
          <p className="text-xs text-slate-500 mt-1">Flagged prior to spoilage</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Est. Avoidable Waste Saved
          </p>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {kpis.wastePrevented.toLocaleString()} kg
          </p>
          <p className="text-xs text-slate-500 mt-1">Illustrative 72% recovery rate</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Est. CO₂e Offset (Demo)
          </p>
          <p className="text-2xl font-bold text-teal-700 mt-2">
            {estCo2Saved.toLocaleString()} kg
          </p>
          <p className="text-xs text-slate-500 mt-1">Illustrative lifecycle factor (2.5x)</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-1">
          Monitored Mass vs. Intercepted Loss by Category (kg)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Comparison of total inventory volume and early-intervention salvage volume
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wasteByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="monitoredKg"
                name="Total Monitored (kg)"
                fill="#065f46"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="interceptedKg"
                name="Est. Waste Prevented (kg)"
                fill="#34d399"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. AI INSIGHTS & DECISION SUPPORT MODULE
// ============================================================================
function InsightsModule({ batches, alerts, onNavigate }) {
  const insightsList = useMemo(() => {
    const byCat = CATEGORIES.map((c) => {
      const list = batches.filter((b) => b.category === c);
      const avg = list.length
        ? Math.round(list.reduce((s, b) => s + b.riskScore, 0) / list.length)
        : 0;
      return { cat: c, avg };
    }).sort((a, b) => b.avg - a.avg);

    const topCat = byCat[0];
    const delayed = batches.filter((b) => b.transport === 'Delayed / Compromised');
    const unresolved = alerts.filter((a) => a.status === 'Unresolved');

    return [
      {
        title: `${topCat.cat} Inventory Shows Highest Mean Spoilage Risk (${topCat.avg}%)`,
        detail: `Thermal sensitivity in ${topCat.cat} requires tighter evaporator tolerance and priority dock-to-stock turnaround.`,
        action: 'Inspect Inventory',
        target: 'inventory'
      },
      {
        title: `${delayed.length} Batch(es) Experiencing Transit Delays`,
        detail: `Batches ${
          delayed.map((d) => d.id).join(', ') || 'None'
        } logged delayed/compromised transit conditions, elevating cumulative thermal load.`,
        action: 'Open Traceability',
        target: 'traceability'
      },
      {
        title: `${unresolved.length} Unresolved Cold-Chain Alerts Pending Action`,
        detail:
          'Immediate acknowledgment and QA verification reduce downstream retail rejection rates.',
        action: 'Review Alerts',
        target: 'alerts'
      }
    ];
  }, [batches, alerts]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Rule-Based Decision Support Engine
        </span>
        <h2 className="text-2xl font-bold text-slate-900">AI Operational Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insightsList.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Rule-Based Insight #{i + 1}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.detail}</p>
            </div>
            <button
              onClick={() => onNavigate(item.target)}
              className="mt-5 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl"
            >
              {item.action} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 10. REPORTS & EXPORT MODULE (FUNCTIONAL CSV DOWNLOAD + PRINTABLE PREVIEW)
// ============================================================================
function ReportsModule({ batches, kpis, showToast }) {
  const [reportType, setReportType] = useState('Inventory & Spoilage Risk Summary');
  const [catFilter, setCatFilter] = useState('All');

  const reportRows = useMemo(() => {
    return batches.filter((b) => catFilter === 'All' || b.category === catFilter);
  }, [batches, catFilter]);

  const exportCSV = () => {
    const headers = [
      'Batch ID',
      'Product Name',
      'Category',
      'Quantity (kg)',
      'Location',
      'Temp (C)',
      'Humidity (%)',
      'Expiry Date',
      'Risk Score (%)',
      'Risk Classification',
      'Status'
    ];
    const csvLines = [
      headers.join(','),
      ...reportRows.map((b) =>
        [
          b.id,
          `"${b.name}"`,
          b.category,
          b.qty,
          `"${b.location}"`,
          b.temp,
          b.hum,
          b.expiry,
          b.riskScore,
          `"${b.riskLevel}"`,
          `"${b.status}"`
        ].join(',')
      )
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FoodChain_Sentinel_${reportType.replace(/\s+/g, '_')}_2026-11-19.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV report exported successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Compliance & Audit Documentation
          </span>
          <h2 className="text-2xl font-bold text-slate-900">Reports & Data Export</h2>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download CSV Report
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Report Template</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
          >
            <option>Inventory & Spoilage Risk Summary</option>
            <option>High-Risk & Critical Quarantine Audit</option>
            <option>Cold-Chain Telemetry Compliance Log</option>
            <option>Expiry Forecast & FEFO Dispatch Sheet</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Filter by Category
          </label>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Report Preview Sheet */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              FoodChain Sentinel — {reportType}
            </h3>
            <p className="text-xs text-slate-500">
              Generated: November 19, 2026 • Scope: {catFilter} ({reportRows.length} batches)
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Avg Risk: {kpis.avgRisk}% • {kpis.activeAlerts} Active Alerts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Qty (kg)</th>
                <th className="py-2.5 px-3">Temp / RH</th>
                <th className="py-2.5 px-3">Expiry</th>
                <th className="py-2.5 px-3">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportRows.map((r) => (
                <tr key={r.id}>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{r.id}</td>
                  <td className="py-2.5 px-3">{r.name}</td>
                  <td className="py-2.5 px-3">{r.category}</td>
                  <td className="py-2.5 px-3">{r.qty}</td>
                  <td className="py-2.5 px-3">
                    {r.temp}°C / {r.hum}%
                  </td>
                  <td className="py-2.5 px-3">{r.expiry}</td>
                  <td className="py-2.5 px-3 font-bold">
                    {r.riskScore}% ({r.riskLevel})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. ML MODEL PERFORMANCE & 4-MEMBER CAPSTONE ARCHITECTURE MODULE
// ============================================================================
function ModelPerformanceModule() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Machine Learning Architecture & Capstone Governance
        </span>
        <h2 className="text-2xl font-bold text-slate-900">
          Model Benchmarks & 4-Member Project Split
        </h2>
      </div>

      {/* Illustrative Metrics Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-900 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Illustrative Benchmark Metrics:</strong> The evaluation metrics below represent
          reference validation benchmarks for the planned scikit-learn classification pipeline
          (Gradient Boosting vs. Random Forest, Decision Tree, Logistic Regression).
        </span>
      </div>

      {/* Model Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-base">
            Candidate Classifier Comparison (Illustrative Reference)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MODEL_COMPARISON_DATA.map((m) => (
                <tr key={m.model} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.model}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">{m.accuracy}%</td>
                  <td className="py-3.5 px-4">{m.precision}%</td>
                  <td className="py-3.5 px-4">{m.recall}%</td>
                  <td className="py-3.5 px-4 font-bold">{m.f1}%</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Global Feature Importance (Illustrative)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Relative predictive weight across engineered supply-chain features
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEATURE_IMPORTANCE_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 0.4]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" width={165} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="importance"
                  name="Relative Weight"
                  fill="#059669"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Illustrative Confusion Matrix (Binary Spoilage Risk)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Validation split n = 400 synthetic + historical batch records
            </p>
            <div className="grid grid-cols-2 gap-3 text-center my-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 block">
                  True Negative (Safe)
                </span>
                <span className="text-2xl font-extrabold text-emerald-950">218</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-800 block">
                  False Positive (Caution)
                </span>
                <span className="text-2xl font-extrabold text-amber-950">12</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-rose-800 block">
                  False Negative (Missed)
                </span>
                <span className="text-2xl font-extrabold text-rose-950">11</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300">
                <span className="text-xs font-bold text-emerald-900 block">
                  True Positive (Caught)
                </span>
                <span className="text-2xl font-extrabold text-emerald-950">159</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto">
            POST /api/v1/predict → FastAPI + joblib.load(&quot;spoilage_gb_model.pkl&quot;)
          </div>
        </div>
      </div>

      {/* 4-Member Team Division Showcase */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-slate-900 text-base">
            4-Member Capstone Team Responsibility Matrix
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEAM_MEMBERS.map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-emerald-900 text-sm">{m.role}</h4>
              <p className="text-xs font-semibold text-slate-700 mt-1">{m.modules}</p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{m.deliverables}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BATCH DETAIL INSPECTION MODAL
// ============================================================================
function BatchDetailModal({ batch, onClose, onTrace }) {
  const cfg = CATEGORY_THRESHOLDS[batch.category];
  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-700">
              {batch.id} • {batch.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900">{batch.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Spoilage Risk</span>
            <span className="text-base font-extrabold text-slate-900">
              {batch.riskScore}% ({batch.riskLevel})
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Est. Quality Window</span>
            <span className="text-sm font-bold text-emerald-800">
              {batch.prediction.remainingWindow}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">
              Temperature (Safe: {cfg.minTemp}–{cfg.maxTemp}°C)
            </span>
            <span className="font-bold text-slate-900">{batch.temp}°C</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">
              Humidity (Safe: {cfg.minHum}–{cfg.maxHum}%)
            </span>
            <span className="font-bold text-slate-900">{batch.hum}% RH</span>
          </div>
        </div>

        <div className="text-xs space-y-1.5">
          <h4 className="font-bold text-slate-700 uppercase">AI Explanation & Action</h4>
          <p className="text-slate-600">{batch.prediction.summary}</p>
          <p className="text-emerald-800 font-semibold">→ {batch.prediction.recommendations[0]}</p>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onTrace}
            className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800"
          >
            View 7-Stage Traceability
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}