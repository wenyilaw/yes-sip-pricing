import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Save, FileText, Settings, Calculator, Shield, Phone, Server, Globe, AlertTriangle, CheckCircle, Edit, X, Users, Lock, LogOut, Printer, Download, Upload, UserPlus, RefreshCw, Eye, Key, Copy, Search, ChevronLeft } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PALETTE
// ═══════════════════════════════════════════════════════════════
const BG = '#F8F9FA';
const SURFACE = '#FFFFFF';
const INK = '#0F172A';
const INK2 = '#334155';
const INK3 = '#64748B';
const BORDER = '#E2E8F0';
const ACCENT = '#2563EB';
const ACCENT2 = '#7C3AED';
const ACCENT_SOFT = '#EFF6FF';
const GREEN = '#16A34A';
const GREEN_SOFT = '#F0FDF4';
const RED = '#DC2626';
const RED_SOFT = '#FEF2F2';
const AMBER = '#D97706';

const SI = ({ c: C, ...p }) => (C ? <C {...p} /> : null);

// ═══════════════════════════════════════════════════════════════
// DEFAULT COST DATABASE
// ═══════════════════════════════════════════════════════════════
const DEFAULT_COST_DB = {
  sipTrunk: {
    setupFee: { internal: 500, external: 0, label: 'SIP Trunk Setup Fee', unit: 'one-time' },
    monthlyAccess: { internal: 200, external: 0, label: 'SIP Trunk Monthly Access', unit: 'per trunk/month' },
    redundantLinkSetup: { internal: 800, external: 0, label: 'Redundant Link Setup', unit: 'one-time' },
    redundantLinkMonthly: { internal: 150, external: 0, label: 'Redundant Link Monthly', unit: 'per link/month' },
  },
  channels: {
    perChannelMonthly: { internal: 30, external: 0, label: 'Per Channel (Concurrent Call)', unit: 'per channel/month' },
  },
  numbers: {
    didLocal: { internal: 5, external: 0, label: 'Local DID Number', unit: 'per number/month' },
    didTollFree: { internal: 15, external: 0, label: 'Toll-Free (1-800) Number', unit: 'per number/month' },
    didMobile: { internal: 10, external: 0, label: 'Mobile DID Number', unit: 'per number/month' },
    numberPorting: { internal: 50, external: 0, label: 'Number Porting Fee', unit: 'per number/one-time' },
    numberActivation: { internal: 20, external: 0, label: 'Number Activation Fee', unit: 'per number/one-time' },
    didInternational: { internal: 25, external: 0, label: 'International DID Number', unit: 'per number/month' },
  },
  integration: {
    certifiedPBXSetup: { internal: 1500, external: 0, label: 'Certified IP-PBX Integration', unit: 'one-time' },
    nonCertifiedPBXSetup: { internal: 3500, external: 0, label: 'Non-Certified IP-PBX Integration', unit: 'one-time' },
    legacyPBXSetup: { internal: 5000, external: 0, label: 'Legacy PBX Integration (via Media GW)', unit: 'one-time' },
    mediaGatewayRental: { internal: 200, external: 0, label: 'Media Gateway Rental', unit: 'per unit/month' },
    mediaGatewaySetup: { internal: 1500, external: 0, label: 'Media Gateway Setup & Config', unit: 'one-time' },
    sipTestingCertified: { internal: 800, external: 0, label: 'SIP Testing & Certification (Certified)', unit: 'one-time' },
    sipTestingNonCertified: { internal: 2500, external: 0, label: 'SIP Testing & Certification (Non-Certified)', unit: 'one-time' },
    interoperabilityTest: { internal: 1200, external: 0, label: 'Interoperability Testing', unit: 'one-time' },
    customSIPDev: { internal: 4000, external: 0, label: 'Custom SIP Development / Debugging', unit: 'one-time' },
  },
  cloudPBX: {
    cloudPBXPerUser: { internal: 25, external: 0, label: 'Cloud PBX Per User/Seat', unit: 'per user/month' },
    cloudPBXSetup: { internal: 1000, external: 0, label: 'Cloud PBX Tenant Setup', unit: 'one-time' },
    cloudPBXIntegration: { internal: 2000, external: 0, label: 'Cloud PBX SIP Integration', unit: 'one-time' },
    cloudPBXTraining: { internal: 500, external: 0, label: 'Cloud PBX Admin Training', unit: 'per session' },
    cloudPBXCallRecording: { internal: 5, external: 0, label: 'Call Recording Add-on', unit: 'per user/month' },
    cloudPBXAutoAttendant: { internal: 50, external: 0, label: 'Auto-Attendant / IVR Setup', unit: 'one-time' },
  },
  professionalServices: {
    projectManagement: { internal: 300, external: 0, label: 'Project Management', unit: 'per day' },
    siteSurvey: { internal: 500, external: 0, label: 'Site Survey & Assessment', unit: 'per site/one-time' },
    networkAssessment: { internal: 800, external: 0, label: 'Network Readiness Assessment', unit: 'per site/one-time' },
    installationService: { internal: 600, external: 0, label: 'On-Site Installation', unit: 'per day' },
    trainingPerSession: { internal: 400, external: 0, label: 'End-User Training', unit: 'per session' },
    supportBasic: { internal: 0, external: 0, label: 'Basic Support (8x5)', unit: 'included/month' },
    supportPremium: { internal: 500, external: 0, label: 'Premium Support (24x7)', unit: 'per month' },
    slaUptime: { internal: 800, external: 0, label: 'SLA Uptime Guarantee (99.99%)', unit: 'per month' },
  },
  callRates: {
    localFixed: { internal: 0.04, external: 0, label: 'Local Fixed Line', unit: 'per minute' },
    localMobile: { internal: 0.08, external: 0, label: 'Local Mobile', unit: 'per minute' },
    nationalFixed: { internal: 0.06, external: 0, label: 'National Fixed Line', unit: 'per minute' },
    international: { internal: 0.30, external: 0, label: 'International (Avg)', unit: 'per minute' },
    tollFreeInbound: { internal: 0.05, external: 0, label: 'Toll-Free Inbound', unit: 'per minute' },
    mobileSMS: { internal: 0.05, external: 0, label: 'SMS via SIP', unit: 'per message' },
  },
};

// ═══════════════════════════════════════════════════════════════
// DEFAULT USERS
// ═══════════════════════════════════════════════════════════════
const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', displayName: 'Administrator' },
];

const DEFAULT_BUNDLE_RULES = {
  channelDidLink: {
    enabled: true,
    channelItem: 'channels.perChannelMonthly',
    didItem: 'numbers.didLocal',
    didPerChannel: 1,
    label: 'SIP Channel to DID Rule',
  },
};

const ROLE_LABELS = { admin: 'Administrator', editor: 'Engineering', sales: 'Sales' };
const ROLE_COLORS = { admin: ACCENT, editor: ACCENT2, sales: GREEN };

// ═══════════════════════════════════════════════════════════════
// SCENARIOS
// ═══════════════════════════════════════════════════════════════
const DEFAULT_SCENARIOS = [
  {
    id: 'new-certified-ippbx', scenarioType: 'certified', name: 'New SIP Trunk + Certified IP-PBX',
    desc: 'Standard deployment with a pre-certified IP-PBX (e.g. Avaya, Cisco, Yeastar). Lowest integration risk.',
    icon: CheckCircle, color: GREEN, colorSoft: GREEN_SOFT,
    items: ['sipTrunk.setupFee', 'sipTrunk.monthlyAccess', 'channels.perChannelMonthly', 'numbers.didLocal', 'numbers.numberActivation', 'integration.certifiedPBXSetup', 'integration.sipTestingCertified', 'professionalServices.siteSurvey', 'professionalServices.installationService', 'professionalServices.projectManagement'],
  },
  {
    id: 'new-noncertified-ippbx', scenarioType: 'certified', name: 'New SIP Trunk + Non-Certified IP-PBX',
    desc: 'Deployment with an untested IP-PBX. Requires full interoperability testing and potential customisation.',
    icon: AlertTriangle, color: AMBER, colorSoft: '#FFFBEB',
    items: ['sipTrunk.setupFee', 'sipTrunk.monthlyAccess', 'channels.perChannelMonthly', 'numbers.didLocal', 'numbers.numberActivation', 'integration.nonCertifiedPBXSetup', 'integration.sipTestingNonCertified', 'integration.interoperabilityTest', 'professionalServices.siteSurvey', 'professionalServices.installationService', 'professionalServices.projectManagement', 'professionalServices.networkAssessment'],
  },
  {
    id: 'legacy-pbx-mediagw', scenarioType: 'certified', name: 'Legacy PBX + Media Gateway',
    desc: 'Connecting a traditional TDM/E1 PBX via a media gateway. Higher setup complexity, gateway rental applies.',
    icon: Server, color: ACCENT2, colorSoft: '#F5F3FF',
    items: ['sipTrunk.setupFee', 'sipTrunk.monthlyAccess', 'channels.perChannelMonthly', 'numbers.didLocal', 'numbers.numberActivation', 'integration.legacyPBXSetup', 'integration.mediaGatewaySetup', 'integration.mediaGatewayRental', 'integration.sipTestingNonCertified', 'integration.interoperabilityTest', 'professionalServices.siteSurvey', 'professionalServices.installationService', 'professionalServices.projectManagement', 'professionalServices.networkAssessment'],
  },
  {
    id: 'redundant-sip', scenarioType: 'managed', name: 'SIP Trunk with Redundant Link',
    desc: 'Primary + secondary SIP trunk for high availability. Includes redundant link setup and monthly charges.',
    icon: Shield, color: ACCENT, colorSoft: ACCENT_SOFT,
    items: ['sipTrunk.setupFee', 'sipTrunk.monthlyAccess', 'sipTrunk.redundantLinkSetup', 'sipTrunk.redundantLinkMonthly', 'channels.perChannelMonthly', 'numbers.didLocal', 'numbers.numberActivation', 'integration.certifiedPBXSetup', 'integration.sipTestingCertified', 'professionalServices.siteSurvey', 'professionalServices.installationService', 'professionalServices.projectManagement'],
  },
  {
    id: 'cloud-pbx-partner', scenarioType: 'managed', name: 'Partner Cloud PBX + SIP Trunk',
    desc: "Utilising a partner's cloud PBX platform (white-label UCaaS). Per-user seat model with SIP trunk backhaul.",
    icon: Globe, color: '#0891B2', colorSoft: '#ECFEFF',
    items: ['sipTrunk.setupFee', 'sipTrunk.monthlyAccess', 'channels.perChannelMonthly', 'numbers.didLocal', 'numbers.numberActivation', 'cloudPBX.cloudPBXPerUser', 'cloudPBX.cloudPBXSetup', 'cloudPBX.cloudPBXIntegration', 'cloudPBX.cloudPBXTraining', 'professionalServices.projectManagement', 'professionalServices.trainingPerSession'],
  },
  {
    id: 'full-stack', scenarioType: 'addon', name: 'Full Stack: Redundant SIP + Cloud PBX + Legacy GW',
    desc: 'Maximum complexity: redundant SIP, cloud PBX for new sites, media gateway for legacy PBX. Full migration scenario.',
    icon: Phone, color: INK, colorSoft: '#F1F5F9',
    items: ['sipTrunk.setupFee', 'sipTrunk.monthlyAccess', 'sipTrunk.redundantLinkSetup', 'sipTrunk.redundantLinkMonthly', 'channels.perChannelMonthly', 'numbers.didLocal', 'numbers.didTollFree', 'numbers.numberActivation', 'numbers.numberPorting', 'integration.legacyPBXSetup', 'integration.mediaGatewaySetup', 'integration.mediaGatewayRental', 'integration.sipTestingNonCertified', 'integration.interoperabilityTest', 'cloudPBX.cloudPBXPerUser', 'cloudPBX.cloudPBXSetup', 'cloudPBX.cloudPBXIntegration', 'cloudPBX.cloudPBXTraining', 'professionalServices.siteSurvey', 'professionalServices.networkAssessment', 'professionalServices.installationService', 'professionalServices.projectManagement', 'professionalServices.trainingPerSession', 'professionalServices.supportPremium'],
  },
];


const SCENARIO_ICON_MAP = { CheckCircle, AlertTriangle, Server, Shield, Globe, Phone, Calculator, Settings, FileText };
const SCENARIO_ICON_OPTIONS = Object.keys(SCENARIO_ICON_MAP);
const SCENARIO_COLOR_OPTIONS = [
  { name: 'Green', color: GREEN, colorSoft: GREEN_SOFT },
  { name: 'Amber', color: AMBER, colorSoft: '#FFFBEB' },
  { name: 'Purple', color: ACCENT2, colorSoft: '#F5F3FF' },
  { name: 'Blue', color: ACCENT, colorSoft: ACCENT_SOFT },
  { name: 'Cyan', color: '#0891B2', colorSoft: '#ECFEFF' },
  { name: 'Dark', color: INK, colorSoft: '#F1F5F9' },
];

const DEFAULT_SCENARIO_SECTIONS = [
  { id: 'certified', label: 'Certified IP-PBX / SBC / MGW', desc: 'Certified customer-owned IP-PBX, SBC or MGW deployment scenarios.' },
  { id: 'managed', label: 'Managed IP-PBX / SBC / MGW', desc: 'YES-managed voice platform, managed SBC, managed MGW and recurring support scenarios.' },
  { id: 'addon', label: 'Add-On to Existing Scenario', desc: 'Optional add-ons that can be attached to a selected certified or managed scenario.' },
];


const LINE_ITEM_SECTION_OPTIONS = [
  'Installation Charges (OTC)',
  'Managed Services',
  'Professional Services',
  'Monthly Rental Charges (Recurring)',
  'SIP DIDs',
  'SIP Channels',
  'Add-ons',
  'Call Charges',
];

const defaultLineItemSection = (dotPath = '') => {
  const category = dotPath.split('.')[0];
  if (category === 'integration') return 'Installation Charges (OTC)';
  if (category === 'sipTrunk') return 'Monthly Rental Charges (Recurring)';
  if (category === 'numbers') return 'SIP DIDs';
  if (category === 'channels') return 'SIP Channels';
  if (category === 'cloudPBX') return 'Managed Services';
  if (category === 'professionalServices') return 'Professional Services';
  if (category === 'callRates') return 'Call Charges';
  return 'Add-ons';
};

const normaliseScenario = (scenario, fallback = {}) => {
  const fallbackIconKey = fallback.iconKey || Object.keys(SCENARIO_ICON_MAP).find(k => SCENARIO_ICON_MAP[k] === fallback.icon) || 'CheckCircle';
  return {
    ...fallback,
    ...scenario,
    iconKey: scenario.iconKey || Object.keys(SCENARIO_ICON_MAP).find(k => SCENARIO_ICON_MAP[k] === scenario.icon) || fallbackIconKey,
    scenarioType: scenario.scenarioType || fallback.scenarioType || 'certified',
    color: scenario.color || fallback.color || ACCENT,
    colorSoft: scenario.colorSoft || fallback.colorSoft || ACCENT_SOFT,
    items: Array.isArray(scenario.items) ? scenario.items : [],
    itemSettings: Object.fromEntries(Object.entries(scenario.itemSettings || fallback.itemSettings || {}).map(([path, setting]) => [path, {
      defaultQty: setting.defaultQty ?? 1,
      quantityEditable: setting.quantityEditable ?? true,
      minQty: setting.minQty ?? 0,
      maxQty: setting.maxQty ?? 9999,
      mandatory: setting.mandatory ?? false,
      lineSection: setting.lineSection || defaultLineItemSection(path),
    }])),
  };
};

const prepareScenarioForStorage = (scenario) => {
  const { icon, ...safeScenario } = scenario;
  return safeScenario;
};

const getScenarioIcon = (scenario) => SCENARIO_ICON_MAP[scenario?.iconKey] || scenario?.icon || CheckCircle;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const getCostItem = (db, dotPath) => {
  const parts = dotPath.split('.');
  return db[parts[0]]?.[parts[1]] || null;
};

const formatMYR = (n) => {
  if (n === 0) return '\u2014';
  return 'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: n < 1 ? 2 : 0, maximumFractionDigits: n < 1 ? 2 : 0 });
};

const isRecurring = (unit) => unit.includes('month') || unit.includes('per minute') || unit.includes('per message') || unit.includes('per day') || unit.includes('per session') || unit.includes('included');

const catLabels = {
  sipTrunk: 'SIP Trunk',
  channels: 'Channels',
  numbers: 'Numbers / DID',
  integration: 'Integration & Testing',
  cloudPBX: 'Cloud PBX',
  professionalServices: 'Professional Services',
  callRates: 'Call Rates',
};

const catOrder = ['sipTrunk', 'channels', 'numbers', 'integration', 'cloudPBX', 'professionalServices', 'callRates'];

const unitOptions = ['one-time', 'per month', 'per trunk/month', 'per link/month', 'per channel/month', 'per number/month', 'per number/one-time', 'per user/month', 'per unit/month', 'per day', 'per session', 'per site/one-time', 'per minute', 'per message', 'included/month'];

const isRemovedBundlePath = (dotPath = '') => {
  const value = String(dotPath).toLowerCase();
  return value.includes('sipdidbundle') || value.includes('sipchanneldidbundle') || value.includes('channel+dids') || value.includes('bundle.sip');
};

const isRemovedBundleItem = (item, key = '') => {
  const value = (String(key) + ' ' + String(item?.label || '')).toLowerCase();
  return value.includes('sip channel + local did bundle') || value.includes('sip channel + did bundle') || value.includes('sipdidbundle') || value.includes('sipchanneldidbundle');
};

const sanitizeCostDB = (db) => {
  const next = { ...db, channels: { ...(db.channels || {}) } };
  delete next.channels.channelBundle20;
  delete next.channels.channelBundle50;
  delete next.bundles;
  Object.keys(next).forEach(cat => {
    if (!next[cat] || typeof next[cat] !== 'object') return;
    next[cat] = Object.fromEntries(
      Object.entries(next[cat]).filter(([key, item]) => !isRemovedBundleItem(item, key))
    );
  });
  return next;
};

const sanitizeScenario = (scenario) => {
  const itemSettings = { ...(scenario.itemSettings || {}) };
  Object.keys(itemSettings).forEach(key => {
    if (isRemovedBundlePath(key)) delete itemSettings[key];
  });
  return {
    ...scenario,
    items: (scenario.items || []).filter(item => !isRemovedBundlePath(item)),
    itemSettings,
  };
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SIPPricingPlaybook() {
  // ─── AUTH STATE ──────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('sipUsers_v3');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (e) { return DEFAULT_USERS; }
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // ─── COST DB STATE ──────────────────────────────────────
  const [costDB, setCostDB] = useState(() => {
    try {
      const saved = localStorage.getItem('sipCostDB_v3');
      if (!saved) return sanitizeCostDB(DEFAULT_COST_DB);
      const parsed = JSON.parse(saved);
      // Merge saved database with new built-in categories so new sections appear after upgrades.
      return sanitizeCostDB({ ...DEFAULT_COST_DB, ...parsed, channels: { ...(DEFAULT_COST_DB.channels || {}), ...((parsed || {}).channels || {}) } });
    } catch (e) { return sanitizeCostDB(DEFAULT_COST_DB); }
  });
  const [scenarios, setScenarios] = useState(() => {
    try {
      const saved = localStorage.getItem('sipScenarios_v3');
      const base = saved ? JSON.parse(saved) : DEFAULT_SCENARIOS;
      return base.map((sc, idx) => normaliseScenario(sanitizeScenario(sc), DEFAULT_SCENARIOS[idx] || {}));
    } catch (e) { return DEFAULT_SCENARIOS.map(sc => normaliseScenario(sanitizeScenario(sc))); }
  });
  const [scenarioSections, setScenarioSections] = useState(() => {
    try {
      const saved = localStorage.getItem('sipScenarioSections_v1');
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return DEFAULT_SCENARIO_SECTIONS;
    } catch (e) { return DEFAULT_SCENARIO_SECTIONS; }
  });
  const [sectionForm, setSectionForm] = useState({ id: '', label: '', desc: '' });
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [bundleRules, setBundleRules] = useState(() => {
    try {
      const saved = localStorage.getItem('sipBundleRules_v1');
      const parsed = saved ? JSON.parse(saved) : {};
      // Support both the old flat format and the new nested channelDidLink format.
      const savedChannelDidLink = parsed.channelDidLink || (
        parsed.channelItem || parsed.didItem || parsed.didPerChannel !== undefined || parsed.enabled !== undefined
          ? parsed
          : {}
      );
      return {
        ...DEFAULT_BUNDLE_RULES,
        ...parsed,
        channelDidLink: {
          ...DEFAULT_BUNDLE_RULES.channelDidLink,
          ...savedChannelDidLink,
        },
      };
    } catch (e) {
      return DEFAULT_BUNDLE_RULES;
    }
  });
  const blankScenario = {
    id: '', name: '', desc: '', scenarioType: 'certified', iconKey: 'CheckCircle', color: GREEN, colorSoft: GREEN_SOFT, items: [], itemSettings: {}
  };
  const [scenarioForm, setScenarioForm] = useState(blankScenario);
  const [editingScenarioId, setEditingScenarioId] = useState(null);
  const [showScenarioForm, setShowScenarioForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [expandedCats, setExpandedCats] = useState(() => Object.fromEntries(catOrder.map(cat => [cat, true])));
  const [showAddItem, setShowAddItem] = useState(null);
  const [newItem, setNewItem] = useState({ key: '', label: '', internal: 0, external: 0, unit: 'per month' });
  const [dbSearch, setDbSearch] = useState('');

  // ─── CALCULATOR STATE ───────────────────────────────────
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [customItems, setCustomItems] = useState({});
  const [qtyInputs, setQtyInputs] = useState({});
  const [marginPct, setMarginPct] = useState(35);
  const [customerName, setCustomerName] = useState('');
  const [quoteRef, setQuoteRef] = useState('');
  const [quoteValidity, setQuoteValidity] = useState(30);

  // ─── QUOTES STATE ───────────────────────────────────────
  const [quoteItems, setQuoteItems] = useState([]);

  // ─── USER MGMT STATE ────────────────────────────────────
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ username: '', password: '', role: 'sales', displayName: '' });

  // ─── UI STATE ───────────────────────────────────────────
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const importRef = useRef(null);
  const scenarioImportRef = useRef(null);

  // ─── EFFECTS ────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('sipCostDB_v3', JSON.stringify(costDB)); } catch (e) { /* ignore */ }
  }, [costDB]);

  useEffect(() => {
    try { localStorage.setItem('sipBundleRules_v1', JSON.stringify(bundleRules)); } catch (e) { /* ignore */ }
  }, [bundleRules]);

  useEffect(() => {
    try { localStorage.setItem('sipScenarioSections_v1', JSON.stringify(scenarioSections)); } catch (e) { /* ignore */ }
  }, [scenarioSections]);

  useEffect(() => {
    try { localStorage.setItem('sipScenarios_v3', JSON.stringify(scenarios.map(prepareScenarioForStorage))); } catch (e) { /* ignore */ }
  }, [scenarios]);

  useEffect(() => {
    try { localStorage.setItem('sipUsers_v3', JSON.stringify(users)); } catch (e) { /* ignore */ }
  }, [users]);
  // ─── CALLBACKS ──────────────────────────────────────────
  const showSaved = useCallback(() => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  }, []);

  // ─── AUTH FUNCTIONS ─────────────────────────────────────
  const handleLogin = () => {
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser({ username: user.username, role: user.role, displayName: user.displayName });
      setLoginError('');
      setLoginForm({ username: '', password: '' });
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('sales');
  };

  const canEditDB = currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  const canManageUsers = currentUser && currentUser.role === 'admin';

  // ─── USER MANAGEMENT ────────────────────────────────────
  const addUser = () => {
    if (!newUserForm.username || !newUserForm.password || !newUserForm.displayName) return;
    if (users.find(u => u.username === newUserForm.username)) return;
    setUsers(prev => [...prev, { ...newUserForm }]);
    setNewUserForm({ username: '', password: '', role: 'sales', displayName: '' });
    setShowAddUser(false);
    showSaved();
  };

  // ─── SCENARIO MANAGEMENT ───────────────────────────────
  const getScenarioSectionLabel = (sectionId) => (scenarioSections.find(section => section.id === sectionId)?.label || sectionId || 'Unassigned');

  const startAddSection = () => {
    setSectionForm({ id: 'section-' + Date.now().toString(36), label: '', desc: '' });
    setEditingSectionId(null);
    setShowSectionForm(true);
  };

  const startEditSection = (section) => {
    setSectionForm({ ...section });
    setEditingSectionId(section.id);
    setShowSectionForm(true);
  };

  const saveScenarioSection = () => {
    if (!sectionForm.label.trim()) return;
    const safeId = (sectionForm.id || sectionForm.label).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('section-' + Date.now().toString(36));
    const nextSection = { id: safeId, label: sectionForm.label.trim(), desc: sectionForm.desc.trim() };
    setScenarioSections(prev => editingSectionId ? prev.map(section => section.id === editingSectionId ? nextSection : section) : [...prev, nextSection]);
    if (editingSectionId && editingSectionId !== safeId) {
      setScenarios(prev => prev.map(sc => (sc.scenarioType === editingSectionId ? { ...sc, scenarioType: safeId } : sc)));
    }
    setShowSectionForm(false);
    setEditingSectionId(null);
    setSectionForm({ id: '', label: '', desc: '' });
    showSaved();
  };

  const removeScenarioSection = (sectionId) => {
    const fallbackSection = scenarioSections.find(section => section.id !== sectionId)?.id || 'certified';
    setScenarioSections(prev => prev.filter(section => section.id !== sectionId));
    setScenarios(prev => prev.map(sc => (sc.scenarioType === sectionId ? { ...sc, scenarioType: fallbackSection } : sc)));
    setConfirmAction(null);
    showSaved();
  };

  const moveScenarioSection = (sectionId, direction) => {
    setScenarioSections(prev => {
      const index = prev.findIndex(section => section.id === sectionId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return updated;
    });
    showSaved();
  };

  const resetScenarioSectionsToFactory = () => {
    setScenarioSections(DEFAULT_SCENARIO_SECTIONS);
    setScenarios(prev => prev.map(sc => DEFAULT_SCENARIO_SECTIONS.some(section => section.id === sc.scenarioType) ? sc : { ...sc, scenarioType: 'certified' }));
    setConfirmAction(null);
    showSaved();
  };

  const allCostItemPaths = () => catOrder.flatMap(cat => costDB[cat] ? Object.keys(costDB[cat]).map(key => cat + '.' + key).filter(path => !isRemovedBundlePath(path)) : []);

  const startAddScenario = () => {
    const firstColor = SCENARIO_COLOR_OPTIONS[0];
    setScenarioForm({ ...blankScenario, id: 'scenario-' + Date.now().toString(36), scenarioType: 'certified', color: firstColor.color, colorSoft: firstColor.colorSoft, items: [], itemSettings: {} });
    setEditingScenarioId(null);
    setShowScenarioForm(true);
  };

  const startEditScenario = (scenario) => {
    setScenarioForm(normaliseScenario(scenario));
    setEditingScenarioId(scenario.id);
    setShowScenarioForm(true);
  };

  const saveScenario = () => {
    if (!scenarioForm.name.trim()) return;
    const safeId = (scenarioForm.id || scenarioForm.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('scenario-' + Date.now().toString(36));
    const scenarioToSave = normaliseScenario(sanitizeScenario({ ...scenarioForm, id: safeId, name: scenarioForm.name.trim(), desc: scenarioForm.desc.trim(), scenarioType: scenarioForm.scenarioType || 'certified', items: scenarioForm.items || [], itemSettings: scenarioForm.itemSettings || {} }));
    setScenarios(prev => editingScenarioId ? prev.map(sc => sc.id === editingScenarioId ? scenarioToSave : sc) : [...prev, scenarioToSave]);

    // Keep Sales Calculator in sync immediately after editing or renaming a scenario ID.
    if (editingScenarioId && selectedScenario === editingScenarioId) {
      setSelectedScenario(scenarioToSave.id);
    }

    setShowScenarioForm(false);
    setEditingScenarioId(null);
    setScenarioForm(blankScenario);
    showSaved();
  };

  const cloneScenario = (scenario) => {
    const cloned = normaliseScenario({
      ...scenario,
      id: 'scenario-' + Date.now().toString(36),
      name: scenario.name + ' Copy',
      items: [...(scenario.items || [])],
      itemSettings: { ...(scenario.itemSettings || {}) },
    });
    setScenarios(prev => [...prev, cloned]);
    showSaved();
  };

  const moveScenario = (scenarioId, direction) => {
    setScenarios(prev => {
      const index = prev.findIndex(sc => sc.id === scenarioId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return updated;
    });
    showSaved();
  };

  const exportScenarios = () => {
    const data = JSON.stringify(scenarios.map(prepareScenarioForStorage), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sip-scenarios-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importScenarios = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) {
          const imported = data.map(sc => normaliseScenario(sanitizeScenario(sc)));
          setScenarios(imported);
          if (selectedScenario && !imported.some(sc => sc.id === selectedScenario)) setSelectedScenario(null);
          setSelectedAddOns(prev => prev.filter(id => imported.some(sc => sc.id === id)));
          showSaved();
        }
      } catch (err) { /* ignore invalid JSON */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const removeScenario = (scenarioId) => {
    setScenarios(prev => prev.filter(sc => sc.id !== scenarioId));
    if (selectedScenario === scenarioId) setSelectedScenario(null);
    setSelectedAddOns(prev => prev.filter(id => id !== scenarioId));
    setConfirmAction(null);
    showSaved();
  };

  const resetScenariosToFactory = () => {
    setScenarios(DEFAULT_SCENARIOS.map(sc => normaliseScenario(sanitizeScenario(sc))));
    setSelectedScenario(null);
    setSelectedAddOns([]);
    setConfirmAction(null);
    showSaved();
  };

  const toggleScenarioItem = (dotPath) => {
    setScenarioForm(prev => {
      const items = prev.items || [];
      const itemSettings = { ...(prev.itemSettings || {}) };
      if (items.includes(dotPath)) {
        delete itemSettings[dotPath];
        return { ...prev, items: items.filter(i => i !== dotPath), itemSettings };
      }
      itemSettings[dotPath] = { defaultQty: 1, quantityEditable: true, minQty: 0, maxQty: 9999, mandatory: false, lineSection: defaultLineItemSection(dotPath) };
      return { ...prev, items: [...items, dotPath], itemSettings };
    });
  };

  const updateScenarioItemSetting = (dotPath, field, value) => {
    setScenarioForm(prev => ({
      ...prev,
      itemSettings: {
        ...(prev.itemSettings || {}),
        [dotPath]: {
          ...((prev.itemSettings || {})[dotPath] || { defaultQty: 1, quantityEditable: true, minQty: 0, maxQty: 9999, mandatory: false, lineSection: defaultLineItemSection(dotPath) }),
          [field]: value,
        }
      }
    }));
  };

  const toggleAddOnScenario = (scenarioId) => {
    setSelectedAddOns(prev => prev.includes(scenarioId) ? prev.filter(id => id !== scenarioId) : [...prev, scenarioId]);
  };

  const getScenarioItemSetting = (dotPath) => {
    const defaultSetting = { defaultQty: 0, quantityEditable: true, minQty: 0, maxQty: 9999, mandatory: false, lineSection: defaultLineItemSection(dotPath) };
    if (isCustomScenario) return defaultSetting;
    const ownerScenarios = [scenarioObj, ...selectedAddOnScenarios].filter(Boolean);
    const owner = ownerScenarios.find(sc => (sc.items || []).includes(dotPath));
    return { ...defaultSetting, ...((owner?.itemSettings || {})[dotPath] || {}) };
  };

  const applyScenarioColor = (colorName) => {
    const selected = SCENARIO_COLOR_OPTIONS.find(c => c.name === colorName) || SCENARIO_COLOR_OPTIONS[0];
    setScenarioForm(prev => ({ ...prev, color: selected.color, colorSoft: selected.colorSoft }));
  };

  // ─── COST DB FUNCTIONS ──────────────────────────────────
  const startEdit = (cat, key) => {
    setEditingItem(`${cat}.${key}`);
    setEditValues({ ...costDB[cat][key] });
  };

  const saveEdit = (cat, key) => {
    setCostDB(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [key]: { ...prev[cat][key], ...editValues, internal: Number(editValues.internal) || 0, external: Number(editValues.external) || 0 }
      }
    }));
    setEditingItem(null);
    setEditValues({});
    showSaved();
  };

  const addNewItem = (cat) => {
    if (!newItem.key || !newItem.label) return;
    if (isRemovedBundleItem(newItem, newItem.key)) return;
    const safeKey = newItem.key.replace(/[^a-zA-Z0-9_]/g, '');
    if (!safeKey) return;
    if (costDB[cat]?.[safeKey]) return;
    setCostDB(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [safeKey]: { internal: Number(newItem.internal) || 0, external: Number(newItem.external) || 0, label: newItem.label, unit: newItem.unit }
      }
    }));
    setNewItem({ key: '', label: '', internal: 0, external: 0, unit: 'per month' });
    setShowAddItem(null);
    showSaved();
  };

  const removeItem = (cat, key) => {
    setCostDB(prev => {
      const updated = { ...prev, [cat]: { ...prev[cat] } };
      delete updated[cat][key];
      return updated;
    });
    setConfirmAction(null);
    showSaved();
  };

  const saveAsDefault = () => {
    try { localStorage.setItem('sipCostDB_default', JSON.stringify(costDB)); } catch (e) { /* ignore */ }
    showSaved();
  };

  const loadDefault = () => {
    try {
      const saved = localStorage.getItem('sipCostDB_default');
      if (saved) { setCostDB(JSON.parse(saved)); showSaved(); }
    } catch (e) { /* ignore */ }
  };

  const resetToFactory = () => {
    setCostDB(sanitizeCostDB(DEFAULT_COST_DB));
    try { localStorage.removeItem('sipCostDB_default'); } catch (e) { /* ignore */ }
    setConfirmAction(null);
    showSaved();
  };

  const exportDB = () => {
    const data = JSON.stringify(costDB, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sip-cost-database-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDB = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (typeof data === 'object' && Object.keys(data).length > 0) {
          setCostDB(data);
          showSaved();
        }
      } catch (err) { /* ignore invalid JSON */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const toggleCat = (cat) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // ─── CALCULATOR FUNCTIONS ───────────────────────────────
  const scenarioObj = scenarios.find(s => s.id === selectedScenario);
  const isCustomScenario = selectedScenario === 'custom';
  const selectedAddOnScenarios = selectedAddOns.map(id => scenarios.find(s => s.id === id)).filter(Boolean);

  const getActiveBundleRule = () => ({
    ...DEFAULT_BUNDLE_RULES.channelDidLink,
    ...((bundleRules && bundleRules.channelDidLink) || {}),
  });

  const getAutoLinkedDidItems = () => {
    const rule = getActiveBundleRule();
    return [rule.didItem, 'numbers.didMobile', 'numbers.numberActivation'].filter(Boolean);
  };

  const getAutoLinkedChannelQtyItems = () => ['sipTrunk.monthlyAccess'];

  const getActiveItems = () => {
    const baseItems = isCustomScenario ? Object.keys(customItems).filter(k => customItems[k]) : (scenarioObj ? scenarioObj.items : []);
    const addOnItems = isCustomScenario ? [] : selectedAddOnScenarios.flatMap(sc => sc.items || []);
    const rule = getActiveBundleRule();
    const merged = [...baseItems, ...addOnItems];

    // Auto-include Local DID, Mobile DID, Number Activation and SIP Trunk Monthly Access when SIP channels are selected.
    // Default DID rule: 1 channel = 1 DID. Monthly Access follows the channel quantity 1:1.
    // These quantities are auto-filled but still editable by user.
    if (rule.enabled && merged.includes(rule.channelItem)) {
      [...getAutoLinkedDidItems(), ...getAutoLinkedChannelQtyItems()].forEach(path => {
        if (path && !merged.includes(path)) merged.push(path);
      });
    }

    return Array.from(new Set(merged)).filter(item => !isRemovedBundlePath(item));
  };

  const getActiveLineGroups = () => {
    const grouped = LINE_ITEM_SECTION_OPTIONS.map(section => ({ section, items: [] }));
    const extra = [];
    getActiveItems().forEach(dotPath => {
      const setting = getScenarioItemSetting(dotPath);
      const section = setting.lineSection || defaultLineItemSection(dotPath);
      const target = grouped.find(g => g.section === section);
      if (target) target.items.push(dotPath);
      else extra.push(dotPath);
    });
    if (extra.length) grouped.push({ section: 'Other', items: extra });
    return grouped.filter(g => g.items.length > 0);
  };

  const isBundleDidItem = (dotPath) => {
    const rule = getActiveBundleRule();
    const activeItems = getActiveItems();
    return !!(rule.enabled && getAutoLinkedDidItems().includes(dotPath) && activeItems.includes(rule.channelItem));
  };

  const getBaseQty = (dotPath) => {
    if (qtyInputs[dotPath] !== undefined) return qtyInputs[dotPath];
    const setting = getScenarioItemSetting(dotPath);
    return Number(setting.defaultQty) || 0;
  };

  const getQty = (dotPath) => {
    const rule = getActiveBundleRule();
    const hasChannelItem = getActiveItems().includes(rule.channelItem);

    // Local DID, Mobile DID and Number Activation default from channel quantity.
    // They remain editable: once the user changes any DID/activation quantity, qtyInputs value is used.
    if (
      rule.enabled &&
      getAutoLinkedDidItems().includes(dotPath) &&
      qtyInputs[dotPath] === undefined &&
      hasChannelItem
    ) {
      return getBaseQty(rule.channelItem) * (Number(rule.didPerChannel) || 1);
    }

    // SIP Trunk Monthly Access follows SIP Channel quantity 1:1 by default, but remains editable.
    if (
      rule.enabled &&
      getAutoLinkedChannelQtyItems().includes(dotPath) &&
      qtyInputs[dotPath] === undefined &&
      hasChannelItem
    ) {
      return getBaseQty(rule.channelItem);
    }

    return getBaseQty(dotPath);
  };

  const setQty = (dotPath, val) => {
    const rule = getActiveBundleRule();
    const setting = getScenarioItemSetting(dotPath);
    const autoLinkedDid = isBundleDidItem(dotPath);
    const autoLinkedChannelQty = getAutoLinkedChannelQtyItems().includes(dotPath);

    // Auto-linked DID items and SIP Trunk Monthly Access are still editable by user even if previous scenario settings locked them.
    if (!autoLinkedDid && !autoLinkedChannelQty && !setting.quantityEditable) return;

    const minQty = Number(setting.minQty) || 0;
    const maxQty = Number(setting.maxQty) || 9999;
    const nextQty = Math.max(minQty, Math.min(maxQty, Number(val) || 0));

    setQtyInputs(prev => {
      const updated = { ...prev, [dotPath]: nextQty };

      // When SIP Channel is changed, auto-update Local DID, Mobile DID and Number Activation.
      // Users can still manually edit those DID/activation quantities afterwards.
      if (rule.enabled && dotPath === rule.channelItem) {
        const linkedQty = nextQty * (Number(rule.didPerChannel) || 1);
        getAutoLinkedDidItems().forEach(path => {
          if (path) updated[path] = linkedQty;
        });
        getAutoLinkedChannelQtyItems().forEach(path => {
          if (path) updated[path] = nextQty;
        });
      }

      return updated;
    });
  };

  const calcLineTotal = (dotPath) => {
    const item = getCostItem(costDB, dotPath);
    if (!item) return { internal: 0, external: 0, sell: 0 };
    const qty = getQty(dotPath);
    const intTotal = item.internal * qty;
    const extTotal = item.external * qty;
    const costBase = intTotal + extTotal;
    const sell = costBase > 0 ? costBase / (1 - marginPct / 100) : 0;
    return { internal: intTotal, external: extTotal, sell };
  };

  const calcGrandTotal = () => {
    const items = getActiveItems();
    let internal = 0, external = 0, sell = 0;
    items.forEach(dotPath => {
      const lt = calcLineTotal(dotPath);
      internal += lt.internal;
      external += lt.external;
      sell += lt.sell;
    });
    const costBase = internal + external;
    const margin = sell - costBase;
    return { internal, external, sell, margin, marginPct: sell > 0 ? (margin / sell * 100) : 0 };
  };

  const calcBreakdown = () => {
    const items = getActiveItems();
    let oneTimeCost = 0, oneTimeSell = 0, recurCost = 0, recurSell = 0;
    items.forEach(dotPath => {
      const item = getCostItem(costDB, dotPath);
      const lt = calcLineTotal(dotPath);
      if (!item) return;
      if (item.unit === 'one-time' || item.unit.includes('one-time')) {
        oneTimeCost += lt.internal + lt.external;
        oneTimeSell += lt.sell;
      } else {
        recurCost += lt.internal + lt.external;
        recurSell += lt.sell;
      }
    });
    return { oneTimeCost, oneTimeSell, recurCost, recurSell };
  };

  const grand = calcGrandTotal();
  const breakdown = calcBreakdown();

  // ─── QUOTE FUNCTIONS ────────────────────────────────────
  const addToQuote = () => {
    const items = getActiveItems();
    const lines = items.map(dotPath => {
      const item = getCostItem(costDB, dotPath);
      const qty = getQty(dotPath);
      const lt = calcLineTotal(dotPath);
      return { dotPath, label: item?.label || dotPath, section: getScenarioItemSetting(dotPath).lineSection || defaultLineItemSection(dotPath), unit: item?.unit || '', qty, internal: lt.internal, external: lt.external, sell: lt.sell };
    }).filter(l => l.qty > 0);
    if (lines.length === 0) return;
    const ref = quoteRef || 'QT-' + Date.now().toString(36).toUpperCase();
    setQuoteItems(prev => [...prev, {
      scenario: isCustomScenario ? 'Custom Selection' : [scenarioObj?.name || 'Custom', ...selectedAddOnScenarios.map(sc => sc.name)].join(' + '),
      lines, marginPct, date: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
      customer: customerName || 'Not specified', ref, validity: quoteValidity,
    }]);
    setCustomerName('');
    setQuoteRef('');
  };

  const removeQuoteItem = (idx) => {
    setQuoteItems(prev => prev.filter((_, i) => i !== idx));
  };

  const duplicateQuote = (idx) => {
    setQuoteItems(prev => [...prev, { ...prev[idx], date: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }) }]);
  };

  // ─── EXCEL EXPORT ───────────────────────────────────────
  const exportQuoteToExcel = (qi) => {
    const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const totalCost = qi.lines.reduce((s, l) => s + l.internal + l.external, 0);
    const sections = Array.from(new Set(qi.lines.map(l => l.section || 'Line Items')));
    const lineRows = sections.map(section => {
      const rows = qi.lines.filter(l => (l.section || 'Line Items') === section).map(l => (
        '<tr>' +
        '<td>' + esc(section) + '</td>' +
        '<td>' + esc(l.label) + '</td>' +
        '<td>' + esc(l.unit) + '</td>' +
        '<td>' + l.qty + '</td>' +
        '<td>' + (l.internal + l.external).toFixed(2) + '</td>' +
        '</tr>'
      )).join('');
      return rows;
    }).join('');

    const html = '<html><head><meta charset="utf-8" /></head><body>' +
      '<table border="1">' +
      '<tr><th colspan="5" style="font-size:16px;">SIP Services Estimated Cost</th></tr>' +
      '<tr><td><b>Reference</b></td><td colspan="4">' + esc(qi.ref) + '</td></tr>' +
      '<tr><td><b>Customer</b></td><td colspan="4">' + esc(qi.customer) + '</td></tr>' +
      '<tr><td><b>Scenario</b></td><td colspan="4">' + esc(qi.scenario) + '</td></tr>' +
      '<tr><td><b>Date</b></td><td colspan="4">' + esc(qi.date) + '</td></tr>' +
      '<tr><td><b>Validity</b></td><td colspan="4">' + esc(qi.validity) + ' days</td></tr>' +
      '<tr></tr>' +
      '<tr><th>Section</th><th>Item</th><th>Unit</th><th>Qty</th><th>Estimated Cost (RM)</th></tr>' +
      lineRows +
      '<tr></tr>' +
      '<tr><td colspan="4"><b>Total Estimated Cost</b></td><td>' + totalCost.toFixed(2) + '</td></tr>' +
      '</table></body></html>';
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (qi.ref || 'quotation') + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── PDF EXPORT ─────────────────────────────────────────
  const exportQuoteToPDF = (qi) => {
    const totalCost = qi.lines.reduce((s, l) => s + l.internal + l.external, 0);
    const oneTimeLines = qi.lines.filter(l => l.unit === 'one-time' || l.unit.includes('one-time'));
    const recurLines = qi.lines.filter(l => l.unit !== 'one-time' && !l.unit.includes('one-time'));
    const otCost = oneTimeLines.reduce((s, l) => s + l.internal + l.external, 0);
    const rcCost = recurLines.reduce((s, l) => s + l.internal + l.external, 0);

    const renderRows = (lines) => lines.map(l => (
      '<tr>' +
      '<td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;font-size:13px;">' + l.label + '</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;text-align:center;font-family:monospace;font-size:12px;">' + l.qty + '</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;font-size:11px;color:#64748B;">' + l.unit + '</td>' +
      '<td style="padding:8px 12px;border-bottom:1px solid #E2E8F0;text-align:right;font-family:monospace;font-size:12px;font-weight:600;color:#2563EB;">' + formatMYR(l.internal + l.external) + '</td>' +
      '</tr>'
    )).join('');

    const sectionBlock = (title, lines, cost) => lines.length > 0 ? (
      '<div style="margin-bottom:24px;">' +
      '<h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#64748B;margin:0 0 8px;font-weight:600;">' + title + '</h3>' +
      '<table style="width:100%;border-collapse:collapse;">' +
      '<thead><tr>' +
      '<th style="padding:8px 12px;text-align:left;border-bottom:2px solid #0F172A;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;background:#F8F9FA;">Item</th>' +
      '<th style="padding:8px 12px;text-align:center;border-bottom:2px solid #0F172A;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;background:#F8F9FA;">Qty</th>' +
      '<th style="padding:8px 12px;text-align:left;border-bottom:2px solid #0F172A;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;background:#F8F9FA;">Unit</th>' +
      '<th style="padding:8px 12px;text-align:right;border-bottom:2px solid #0F172A;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#64748B;background:#F8F9FA;">Estimated Cost (RM)</th>' +
      '</tr></thead><tbody>' + renderRows(lines) + '</tbody>' +
      '<tfoot><tr style="background:#F8F9FA;font-weight:700;">' +
      '<td style="padding:10px 12px;border-top:2px solid #0F172A;font-size:13px;" colspan="3">Subtotal</td>' +
      '<td style="padding:10px 12px;border-top:2px solid #0F172A;text-align:right;font-family:monospace;font-size:13px;color:#2563EB;">' + formatMYR(cost) + '</td>' +
      '</tr></tfoot></table></div>'
    ) : '';

    const html = '<!DOCTYPE html><html><head><title>Quotation - ' + qi.ref + '</title>' +
      '<style>body{font-family:Inter,Segoe UI,sans-serif;margin:40px;color:#0F172A;max-width:800px;margin:40px auto;}' +
      '@media print{body{margin:20px;}}</style></head><body>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;border-bottom:3px solid #0F172A;padding-bottom:20px;">' +
      '<div><div style="width:40px;height:40px;background:#2563EB;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;">' +
      '<span style="color:white;font-size:18px;font-weight:800;">S</span></div>' +
      '<h1 style="font-size:24px;font-weight:800;letter-spacing:-0.02em;margin:0;">SIP Services Estimated Cost</h1>' +
      '<p style="font-size:12px;color:#64748B;margin:4px 0 0;">Confidential</p></div>' +
      '<div style="text-align:right;">' +
      '<p style="font-family:monospace;font-size:12px;margin:0;"><strong>Ref:</strong> ' + qi.ref + '</p>' +
      '<p style="font-family:monospace;font-size:12px;margin:4px 0 0;"><strong>Date:</strong> ' + qi.date + '</p>' +
      '<p style="font-family:monospace;font-size:12px;margin:4px 0 0;"><strong>Valid:</strong> ' + qi.validity + ' days</p></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;">' +
      '<div style="background:#F8F9FA;border-radius:8px;padding:14px 18px;">' +
      '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748B;margin:0 0 4px;font-weight:600;">Customer</p>' +
      '<p style="font-size:15px;font-weight:600;margin:0;">' + qi.customer + '</p></div>' +
      '<div style="background:#F8F9FA;border-radius:8px;padding:14px 18px;">' +
      '<p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748B;margin:0 0 4px;font-weight:600;">Scenario</p>' +
      '<p style="font-size:15px;font-weight:600;margin:0;">' + qi.scenario + '</p></div></div>' +
      sectionBlock('One-Time Charges', oneTimeLines, otCost) +
      sectionBlock('Monthly Recurring Charges', recurLines, rcCost) +
      '<div style="background:#0F172A;border-radius:8px;padding:20px 24px;color:white;margin-top:24px;">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">' +
      '<div><p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);margin:0 0 4px;font-weight:600;">One-Time Estimated Cost</p>' +
      '<p style="font-size:22px;font-weight:800;margin:0;">' + formatMYR(otCost) + '</p></div>' +
      '<div><p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);margin:0 0 4px;font-weight:600;">Monthly Estimated Cost</p>' +
      '<p style="font-size:22px;font-weight:800;margin:0;">' + formatMYR(rcCost) + '</p></div>' +
      '<div><p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);margin:0 0 4px;font-weight:600;">First Month Estimated Cost</p>' +
      '<p style="font-size:22px;font-weight:800;margin:0;color:#60A5FA;">' + formatMYR(otCost + rcCost) + '</p></div></div>' +
      '<div style="margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.15);">' +
      '<span style="font-size:12px;color:rgba(255,255,255,0.6);">Total Estimated Cost: ' + formatMYR(totalCost) + '</span></div></div>' +
      '<div style="margin-top:28px;padding-top:16px;border-top:1px solid #E2E8F0;">' +
      '<p style="font-size:11px;color:#64748B;line-height:1.7;margin:0;">' +
      'This quotation is valid for ' + qi.validity + ' days from the date of issue. All prices are in Malaysian Ringgit (MYR). ' +
      'Prices are subject to change after the validity period.</p></div>' +
      '<div style="margin-top:20px;text-align:center;">' +
      '<p style="font-family:monospace;font-size:9px;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;margin:0;">' +
      'SIP Services Pricing Playbook</p></div>' +
      '</body></html>';

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 600);
    }
  };

  // ─── CONFIRM DIALOG ─────────────────────────────────────
  const ConfirmDialog = () => {
    if (!confirmAction) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
        <div style={{ background: SURFACE, borderRadius: 12, padding: '28px 32px', maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: INK, margin: '0 0 8px' }}>{confirmAction.title}</h3>
          <p style={{ fontSize: 14, color: INK3, lineHeight: 1.6, margin: '0 0 20px' }}>{confirmAction.message}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setConfirmAction(null)} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={confirmAction.onConfirm} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, background: RED, color: SURFACE, border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>{confirmAction.confirmLabel || 'Confirm'}</button>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
          input:focus { outline: none; border-color: ${ACCENT} !important; box-shadow: 0 0 0 3px ${ACCENT}22; }
        `}</style>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: ACCENT, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Phone style={{ width: 24, height: 24, color: SURFACE }} />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 28, color: INK, letterSpacing: '-0.02em', margin: 0 }}>SIP Pricing Playbook</h1>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: INK3, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 6 }}>Sign in to continue</p>
          </div>
          <div style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 12, padding: '28px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            {loginError && (
              <div style={{ background: RED_SOFT, border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle style={{ width: 14, height: 14, color: RED }} />
                <span style={{ fontSize: 13, color: RED, fontWeight: 500 }}>{loginError}</span>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 6 }}>Username</label>
              <div style={{ position: 'relative' }}>
                <Users style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: INK3 }} />
                <input type="text" value={loginForm.username} onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter username"
                  style={{ width: '100%', padding: '10px 12px 10px 38px', fontFamily: "'Inter', sans-serif", fontSize: 14, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: INK3 }} />
                <input type="password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter password"
                  style={{ width: '100%', padding: '10px 12px 10px 38px', fontFamily: "'Inter', sans-serif", fontSize: 14, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK, boxSizing: 'border-box' }} />
              </div>
            </div>
            <button onClick={handleLogin} style={{ width: '100%', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, background: ACCENT, color: SURFACE, border: 'none', borderRadius: 8, padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Key style={{ width: 16, height: 16 }} />
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN APP
  // ═══════════════════════════════════════════════════════════
  const tabs = [
    { id: 'sales', label: 'Sales Calculator', icon: Calculator, roles: ['admin', 'editor', 'sales'] },
    { id: 'engineering', label: 'Cost Database', icon: Settings, roles: ['admin', 'editor'] },
    { id: 'scenarios', label: 'Scenarios', icon: Shield, roles: ['admin'] },
    { id: 'quotes', label: 'Estimated Cost', icon: FileText, roles: ['admin', 'editor', 'sales'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
  ].filter(t => t.roles.includes(currentUser.role));

  const visibleCostCategories = currentUser.role === 'sales' ? ['callRates'] : catOrder;
  const activeBundleRule = {
    ...DEFAULT_BUNDLE_RULES.channelDidLink,
    ...((bundleRules && bundleRules.channelDidLink) || {}),
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "Inter, system-ui, sans-serif", color: INK2 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 600px; } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input:focus, select:focus { outline: none; border-color: ${ACCENT} !important; box-shadow: 0 0 0 3px ${ACCENT}22; }
        button:hover { opacity: 0.9; }
      `}</style>

      <ConfirmDialog />

      {/* ─── TOP NAV BAR ────────────────────────────────── */}
      <div style={{ background: SURFACE, borderBottom: '1px solid ' + BORDER, padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: ACCENT, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone style={{ width: 16, height: 16, color: SURFACE }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: INK, letterSpacing: '-0.02em', lineHeight: 1.2 }}>SIP Pricing Playbook</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Internal Use Only</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {savedNotice && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: GREEN, fontWeight: 600, letterSpacing: '0.06em', background: GREEN_SOFT, padding: '3px 10px', borderRadius: 6 }}>Saved</span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: BG, borderRadius: 8, border: '1px solid ' + BORDER }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: ROLE_COLORS[currentUser.role] || ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: SURFACE }}>{currentUser.displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: INK, lineHeight: 1.2 }}>{currentUser.displayName}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ROLE_COLORS[currentUser.role] || INK3, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{ROLE_LABELS[currentUser.role]}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: INK3, fontSize: 12, fontWeight: 600 }}>
            <LogOut style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      {/* ─── MARQUEE ────────────────────────────────────── */}
      <div style={{ background: ACCENT, padding: '5px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: SURFACE, letterSpacing: '0.06em', display: 'inline-block', animation: 'ticker 40s linear infinite' }}>
          SIP TRUNK &nbsp;&middot;&nbsp; CHANNELS &nbsp;&middot;&nbsp; DID NUMBERS &nbsp;&middot;&nbsp; IP-PBX INTEGRATION &nbsp;&middot;&nbsp; LEGACY MEDIA GATEWAY &nbsp;&middot;&nbsp; CLOUD PBX &nbsp;&middot;&nbsp; REDUNDANT LINK &nbsp;&middot;&nbsp; CERTIFIED &amp; NON-CERTIFIED &nbsp;&middot;&nbsp; INTEROPERABILITY TESTING &nbsp;&middot;&nbsp; PROFESSIONAL SERVICES &nbsp;&middot;&nbsp; MARGIN MARKUP &nbsp;&nbsp;&nbsp;&nbsp; SIP TRUNK &nbsp;&middot;&nbsp; CHANNELS &nbsp;&middot;&nbsp; DID NUMBERS &nbsp;&middot;&nbsp; IP-PBX INTEGRATION &nbsp;&middot;&nbsp; LEGACY MEDIA GATEWAY &nbsp;&middot;&nbsp; CLOUD PBX &nbsp;&middot;&nbsp; REDUNDANT LINK &nbsp;&middot;&nbsp; CERTIFIED &amp; NON-CERTIFIED &nbsp;&middot;&nbsp; INTEROPERABILITY TESTING &nbsp;&middot;&nbsp; PROFESSIONAL SERVICES &nbsp;&middot;&nbsp; MARGIN MARKUP &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      {/* ─── TAB NAV ────────────────────────────────────── */}
      <div style={{ display: 'flex', background: SURFACE, borderBottom: '2px solid ' + INK }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '12px 10px', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.005em',
              border: 'none', cursor: 'pointer', transition: 'all 0.15s ease-out',
              background: activeTab === tab.id ? SURFACE : BG,
              color: activeTab === tab.id ? ACCENT : INK3,
              borderBottom: activeTab === tab.id ? '3px solid ' + ACCENT : '3px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <SI c={tab.icon} style={{ width: 14, height: 14 }} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 16px' }}>

        {/* ═══════════════════════════════════════════════════
            TAB 1: SALES CALCULATOR
            ═══════════════════════════════════════════════════ */}
        {activeTab === 'sales' && (
          <div className="fade-in">
            <div style={{ borderBottom: '2px solid ' + INK, paddingBottom: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>01 / Scenario Selector</p>
                <h2 style={{ fontWeight: 800, fontSize: 30, color: INK, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '6px 0 0' }}>Pick a deployment scenario</h2>
              </div>
              <p style={{ fontSize: 13, color: INK3, maxWidth: 300, textAlign: 'right', lineHeight: 1.55, margin: 0 }}>Select the scenario, enter quantities, set margin, then save to quote.</p>
            </div>

            {/* Scenario cards grouped by section */}
            {scenarioSections.map(section => {
              const sectionScenarios = scenarios.filter(sc => (sc.scenarioType || 'certified') === section.id);
              if (sectionScenarios.length === 0) return null;
              return (
                <div key={section.id} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: INK, margin: 0 }}>{section.label}</p>
                      <p style={{ fontSize: 12, color: INK3, margin: '3px 0 0' }}>{section.desc}</p>
                    </div>
                    {section.id === 'addon' && selectedAddOns.length > 0 && (
                      <button onClick={() => setSelectedAddOns([])} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: RED, border: '1.5px solid #FECACA', borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}>Clear Add-Ons</button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                    {sectionScenarios.map(sc => {
                      const isAddOn = section.id === 'addon';
                      const active = isAddOn ? selectedAddOns.includes(sc.id) : selectedScenario === sc.id;
                      return (
                        <button key={sc.id} onClick={() => {
                          if (isAddOn) { toggleAddOnScenario(sc.id); return; }
                          setSelectedScenario(sc.id); setQtyInputs({}); setCustomItems({});
                        }}
                          style={{
                            background: active ? sc.colorSoft : SURFACE,
                            border: active ? '2px solid ' + sc.color : '1px solid ' + BORDER,
                            borderRadius: 8, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                            transition: 'all 0.15s ease-out',
                            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.04)',
                          }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <div style={{ width: 26, height: 26, borderRadius: 6, background: active ? sc.color : BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                              <SI c={getScenarioIcon(sc)} style={{ width: 13, height: 13, color: active ? SURFACE : INK3 }} />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 13, color: INK, letterSpacing: '-0.01em' }}>{sc.name}</span>
                          </div>
                          <p style={{ fontSize: 12, color: INK3, lineHeight: 1.5, margin: 0 }}>{sc.desc}</p>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 8, display: 'block' }}>{sc.items.length} line items {isAddOn ? '· optional add-on' : ''}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Custom scenario */}
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => { setSelectedScenario('custom'); setSelectedAddOns([]); setQtyInputs({}); setCustomItems({}); }}
                style={{
                  width: '100%', background: selectedScenario === 'custom' ? ACCENT_SOFT : SURFACE,
                  border: selectedScenario === 'custom' ? '2px solid ' + ACCENT : '1px dashed ' + BORDER,
                  borderRadius: 8, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease-out',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: selectedScenario === 'custom' ? ACCENT : BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus style={{ width: 13, height: 13, color: selectedScenario === 'custom' ? SURFACE : INK3 }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: INK, letterSpacing: '-0.01em' }}>Custom Selection</span>
                </div>
                <p style={{ fontSize: 12, color: INK3, lineHeight: 1.5, margin: 0 }}>Pick individual items from any category. Build your own quote from scratch.</p>
              </button>
            </div>

            {/* Custom scenario item picker */}
            {isCustomScenario && (
              <div className="fade-in" style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, padding: '16px 20px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 12px' }}>Select items to include</p>
                {catOrder.filter(cat => costDB[cat]).map(cat => (
                  <div key={cat} style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: INK, margin: '0 0 4px' }}>{catLabels[cat] || cat}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {Object.keys(costDB[cat]).map(key => {
                        const dotPath = cat + '.' + key;
                        const active = customItems[dotPath];
                        return (
                          <button key={key} onClick={() => setCustomItems(p => ({ ...p, [dotPath]: !active }))}
                            style={{
                              fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 500,
                              border: active ? '1.5px solid ' + ACCENT : '1px solid ' + BORDER,
                              background: active ? ACCENT_SOFT : SURFACE, color: active ? ACCENT : INK3,
                              transition: 'all 0.1s',
                            }}>
                            {costDB[cat][key].label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected scenario detail */}
            {(scenarioObj || isCustomScenario) && getActiveItems().length > 0 && (
              <div className="fade-in">
                {/* Controls bar */}
                <div style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK3 }}>Margin</span>
                    <input type="number" value={marginPct} onChange={e => setMarginPct(Math.max(0, Math.min(90, Number(e.target.value) || 0)))}
                      style={{ width: 56, padding: '5px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK, textAlign: 'center' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: INK3 }}>%</span>
                  </div>
                  <div style={{ flex: 1, height: 6, background: BORDER, borderRadius: 3, position: 'relative', maxWidth: 180, minWidth: 60 }}>
                    <div style={{ height: '100%', background: ACCENT, borderRadius: 3, width: marginPct + '%', transition: 'width 0.2s ease-out' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3 }}>Customer</span>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name"
                      style={{ width: 160, padding: '5px 10px', fontFamily: "'Inter', sans-serif", fontSize: 12, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3 }}>Ref</span>
                    <input type="text" value={quoteRef} onChange={e => setQuoteRef(e.target.value)} placeholder="QT-XXXX"
                      style={{ width: 100, padding: '5px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK }} />
                  </div>
                  <button onClick={addToQuote} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: ACCENT, color: SURFACE, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
                    <Plus style={{ width: 13, height: 13 }} /> Save to Quote
                  </button>
                </div>

                {/* Line items table */}
                <div style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 60px 90px 90px 90px 90px 70px', padding: '8px 18px', borderBottom: '2px solid ' + INK, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, background: BG }}>
                    <span>Line Item</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'right' }}>Int. Cost</span><span style={{ textAlign: 'right' }}>Ext. Cost</span><span style={{ textAlign: 'right' }}>Mark Up Cost</span><span style={{ textAlign: 'right' }}>Estimated Cost</span><span style={{ textAlign: 'right' }}>Margin</span>
                  </div>
                  {getActiveLineGroups().map(group => (
                    <React.Fragment key={group.section}>
                      <div style={{ padding: '7px 18px', background: INK, color: SURFACE, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{group.section}</div>
                      {group.items.map(dotPath => {
                        const item = getCostItem(costDB, dotPath);
                        if (!item) return null;
                        const lt = calcLineTotal(dotPath);
                        const lineMargin = lt.sell > 0 ? ((lt.sell - lt.internal - lt.external) / lt.sell * 100) : 0;
                        const lineMarkup = lt.sell - lt.internal - lt.external;
                        const hasQty = getQty(dotPath) > 0;
                        const qtySetting = getScenarioItemSetting(dotPath);
                        const bundleLinkedDid = isBundleDidItem(dotPath);
                        // Local DID, Mobile DID and Number Activation are auto-updated from SIP Channel,
                        // but remain editable by the user.
                        const qtyEditable = bundleLinkedDid ? true : qtySetting.quantityEditable;
                        return (
                          <div key={dotPath} style={{ display: 'grid', gridTemplateColumns: '2.4fr 60px 90px 90px 90px 90px 70px', padding: '8px 18px', borderBottom: '1px solid ' + BORDER, alignItems: 'center', background: hasQty ? ACCENT_SOFT : SURFACE, transition: 'background 0.15s' }}>
                            <div>
                              <span style={{ fontSize: 12, fontWeight: 500, color: INK }}>{item.label}</span>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: INK3, marginLeft: 6, letterSpacing: '0.04em' }}>{item.unit}</span>
                              {bundleLinkedDid && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ACCENT, marginLeft: 6, letterSpacing: '0.04em' }}>AUTO DEFAULT: {getActiveBundleRule().didPerChannel} DID per channel · editable</span>}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <input type="number" min={qtySetting.minQty || 0} max={qtySetting.maxQty || 9999} value={getQty(dotPath) || ''} onChange={e => setQty(dotPath, e.target.value)} placeholder="0" disabled={!qtyEditable}
                                style={{ width: 48, padding: '3px 5px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + BORDER, background: qtyEditable ? SURFACE : BG, borderRadius: 6, textAlign: 'center', color: qtyEditable ? INK : INK3, cursor: qtyEditable ? 'text' : 'not-allowed' }} />
                              {!qtyEditable && <span title={'Quantity locked by admin'} style={{ fontSize: 10, color: INK3, marginLeft: 3 }}>🔒</span>}
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: 'right', color: INK2 }}>{formatMYR(lt.internal)}</span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: 'right', color: INK2 }}>{formatMYR(lt.external)}</span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: 'right', color: AMBER, fontWeight: 600 }}>{formatMYR(lineMarkup)}</span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: 'right', color: ACCENT, fontWeight: 600 }}>{formatMYR(lt.sell)}</span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textAlign: 'right', color: lineMargin >= marginPct ? GREEN : RED, fontWeight: 500 }}>{lt.sell > 0 ? lineMargin.toFixed(1) + '%' : '\u2014'}</span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                  {/* Grand total */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 60px 90px 90px 90px 90px 70px', padding: '12px 18px', borderTop: '2px solid ' + INK, background: BG }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: INK }}>Grand Total</span>
                    <span />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: 'right', color: INK, fontWeight: 700 }}>{formatMYR(grand.internal)}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: 'right', color: INK, fontWeight: 700 }}>{formatMYR(grand.external)}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: 'right', color: AMBER, fontWeight: 700 }}>{formatMYR(grand.margin)}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, textAlign: 'right', color: ACCENT, fontWeight: 700 }}>{formatMYR(grand.sell)}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: 'right', color: ACCENT, fontWeight: 700 }}>{grand.sell > 0 ? grand.marginPct.toFixed(1) + '%' : '\u2014'}</span>
                  </div>
                </div>

                {/* Estimated Cost and Recommended Charging panels */}
                <div style={{ marginTop: 16 }}>
                  {[
                    {
                      title: 'Estimated Cost',
                      color: ACCENT,
                      oneTime: breakdown.oneTimeCost,
                      monthly: breakdown.recurCost,
                      firstMonth: breakdown.oneTimeCost + breakdown.recurCost,
                    },
                    {
                      title: 'Recommended Charging',
                      color: '#EA3383',
                      oneTime: breakdown.oneTimeSell,
                      monthly: breakdown.recurSell,
                      firstMonth: breakdown.oneTimeSell + breakdown.recurSell,
                    },
                  ].map(section => (
                    <div key={section.title} style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, overflow: 'hidden', marginTop: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ background: section.color, color: SURFACE, padding: '9px 14px', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em' }}>
                        {section.title}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 24, padding: '16px 24px' }}>
                        <div style={{ background: section.color, borderRadius: 10, padding: '18px 20px', color: SURFACE, textAlign: 'center', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 4px 12px rgba(37,99,235,0.20)' }}>
                          <p style={{ fontWeight: 800, fontSize: 16, color: SURFACE, margin: '0 0 10px' }}>Non-Recurring Cost (One Time)</p>
                          <p style={{ fontWeight: 800, fontSize: 30, color: SURFACE, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>{formatMYR(section.oneTime)}</p>
                        </div>
                        <div style={{ background: section.color, borderRadius: 10, padding: '18px 20px', color: SURFACE, textAlign: 'center', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 4px 12px rgba(37,99,235,0.20)' }}>
                          <p style={{ fontWeight: 800, fontSize: 16, color: SURFACE, margin: '0 0 10px' }}>Recurring Cost (Monthly Charges)</p>
                          <p style={{ fontWeight: 800, fontSize: 30, color: SURFACE, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>{formatMYR(section.monthly)}</p>
                        </div>
                        <div style={{ background: section.color, borderRadius: 10, padding: '18px 20px', color: SURFACE, textAlign: 'center', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 4px 12px rgba(37,99,235,0.20)' }}>
                          <p style={{ fontWeight: 800, fontSize: 16, color: SURFACE, margin: '0 0 10px' }}>First Month</p>
                          <p style={{ fontWeight: 800, fontSize: 30, color: SURFACE, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>{formatMYR(section.firstMonth)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', background: ACCENT_SOFT, border: '1px solid ' + ACCENT + '33', borderRadius: 8, padding: '12px 16px', marginTop: 14 }}>
                  <span style={{ fontSize: 12, color: INK2 }}>ⓘ Note: DID is calculated automatically based on the rule: 1 Channel = 2 DID (Local DID)</span>
                  <span style={{ fontSize: 12, color: INK2 }}>Internal Cost = Internal + External</span>
                  <span style={{ fontSize: 12, color: INK2 }}>Estimated Cost = Internal Cost + Mark Up</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB 2: COST DATABASE
            ═══════════════════════════════════════════════════ */}
        {activeTab === 'engineering' && (
          <div className="fade-in">
            <div style={{ borderBottom: '2px solid ' + INK, paddingBottom: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>02 / Cost Database</p>
                <h2 style={{ fontWeight: 800, fontSize: 30, color: INK, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '6px 0 0' }}>{currentUser.role === 'sales' ? 'Call rate reference' : 'Unit cost management'}</h2>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                {canEditDB && (
                  <>
                    <button onClick={saveAsDefault} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: GREEN, color: SURFACE, border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Save style={{ width: 12, height: 12 }} /> Save as Default
                    </button>
                    <button onClick={loadDefault} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RefreshCw style={{ width: 12, height: 12 }} /> Load My Default
                    </button>
                    <button onClick={() => setConfirmAction({ title: 'Reset to Factory Defaults', message: 'This will erase all custom costs and revert to the original built-in defaults. This cannot be undone.', confirmLabel: 'Reset Everything', onConfirm: resetToFactory })}
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: RED, border: '1.5px solid #FECACA', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Reset to Factory
                    </button>
                    <button onClick={exportDB} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: INK, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Download style={{ width: 12, height: 12 }} /> Export JSON
                    </button>
                    <button onClick={() => importRef.current && importRef.current.click()} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: INK, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Upload style={{ width: 12, height: 12 }} /> Import JSON
                    </button>
                    <input ref={importRef} type="file" accept=".json" onChange={importDB} style={{ display: 'none' }} />
                  </>
                )}
                {!canEditDB && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: AMBER + '15', borderRadius: 8, border: '1px solid #FDE68A' }}>
                    <Eye style={{ width: 14, height: 14, color: AMBER }} />
                    <span style={{ fontSize: 11, color: AMBER, fontWeight: 600 }}>Read-only access</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bundle rule configuration removed from Cost Database. Channel to DID linking remains active in Sales Calculator. */}

            {/* Search */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: INK3 }} />
              <input type="text" value={dbSearch} onChange={e => setDbSearch(e.target.value)} placeholder="Search cost items..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK, boxSizing: 'border-box' }} />
            </div>

            <p style={{ fontSize: 13, color: INK3, lineHeight: 1.6, maxWidth: 600, marginBottom: 16 }}>
              {canEditDB
                ? 'Set internal cost (carrier/vendor) and external cost (third-party pass-through). Sales uses these for margin markup.'
                : currentUser.role === 'sales' ? 'Sales can view Call Rates only. Internal cost database categories are hidden.' : 'View current unit costs. Contact Engineering or Admin to request changes.'}
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setExpandedCats(Object.fromEntries(visibleCostCategories.map(cat => [cat, true])))} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: ACCENT, border: '1.5px solid ' + ACCENT, borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                Expand All
              </button>
              <button onClick={() => setExpandedCats({})} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                Collapse All
              </button>
              {currentUser.role === 'sales' && <span style={{ fontSize: 12, color: INK3, alignSelf: 'center' }}>Sales role can view Call Rates only.</span>}
            </div>

            {/* Category sections */}
            {visibleCostCategories.filter(cat => costDB[cat]).map(cat => {
              const items = Object.entries(costDB[cat]);
              const filteredItems = dbSearch ? items.filter(([, item]) => item.label.toLowerCase().includes(dbSearch.toLowerCase())) : items;
              if (filteredItems.length === 0 && dbSearch) return null;
              return (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <button onClick={() => toggleCat(cat)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, cursor: 'pointer',
                    fontWeight: 700, fontSize: 14, color: INK, letterSpacing: '-0.01em',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)', transition: 'all 0.15s',
                  }}>
                    <SI c={expandedCats[cat] ? ChevronDown : ChevronRight} style={{ width: 14, height: 14, color: INK3 }} />
                    {catLabels[cat] || cat}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, marginLeft: 'auto', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                      {items.length} items
                    </span>
                  </button>
                  {expandedCats[cat] && (
                    <div style={{ border: '1px solid ' + BORDER, borderTop: 0, borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 120px 50px', padding: '6px 16px', borderBottom: '2px solid ' + INK, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, background: BG }}>
                        <span>Item</span><span style={{ textAlign: 'right' }}>Internal (RM)</span><span style={{ textAlign: 'right' }}>External (RM)</span><span>Unit</span><span />
                      </div>
                      {filteredItems.map(([key, item]) => {
                        const dotPath = cat + '.' + key;
                        const isEditing = editingItem === dotPath;
                        return (
                          <div key={key} style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 120px 50px', padding: '7px 16px', borderBottom: '1px solid ' + BORDER, alignItems: 'center', background: isEditing ? ACCENT_SOFT : SURFACE }}>
                            <span style={{ fontSize: 12, fontWeight: 500, color: INK }}>{item.label}</span>
                            {isEditing ? (
                              <input type="number" value={editValues.internal} onChange={e => setEditValues(p => ({ ...p, internal: e.target.value }))}
                                style={{ width: 80, padding: '4px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + ACCENT, background: SURFACE, borderRadius: 6, textAlign: 'right', color: INK }} />
                            ) : (
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: 'right', color: INK, fontWeight: 500 }}>{formatMYR(item.internal)}</span>
                            )}
                            {isEditing ? (
                              <input type="number" value={editValues.external} onChange={e => setEditValues(p => ({ ...p, external: e.target.value }))}
                                style={{ width: 80, padding: '4px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + ACCENT, background: SURFACE, borderRadius: 6, textAlign: 'right', color: INK }} />
                            ) : (
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: 'right', color: INK, fontWeight: 500 }}>{formatMYR(item.external)}</span>
                            )}
                            {isEditing ? (
                              <select value={editValues.unit} onChange={e => setEditValues(p => ({ ...p, unit: e.target.value }))}
                                style={{ padding: '4px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, border: '1.5px solid ' + ACCENT, background: SURFACE, borderRadius: 6, color: INK }}>
                                {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                              </select>
                            ) : (
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, letterSpacing: '0.04em' }}>{item.unit}</span>
                            )}
                            <div style={{ textAlign: 'right', display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                              {canEditDB && (
                                isEditing ? (
                                  <>
                                    <button onClick={() => saveEdit(cat, key)} style={{ background: GREEN, color: SURFACE, border: 'none', borderRadius: 5, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontSize: 10 }}>&#10003;</button>
                                    <button onClick={() => setEditingItem(null)} style={{ background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 5, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontSize: 10 }}>&#10007;</button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => startEdit(cat, key)} style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 5, padding: '3px 6px', cursor: 'pointer', color: INK3 }}>
                                      <Edit style={{ width: 11, height: 11 }} />
                                    </button>
                                    <button onClick={() => setConfirmAction({ title: 'Remove Item', message: 'Remove "' + item.label + '" from ' + (catLabels[cat] || cat) + '? This cannot be undone.', confirmLabel: 'Remove', onConfirm: () => removeItem(cat, key) })}
                                      style={{ background: SURFACE, border: '1.5px solid #FECACA', borderRadius: 5, padding: '3px 6px', cursor: 'pointer', color: RED }}>
                                      <Trash2 style={{ width: 11, height: 11 }} />
                                    </button>
                                  </>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {/* Add new item */}
                      {canEditDB && showAddItem === cat && (
                        <div style={{ padding: '10px 16px', background: ACCENT_SOFT, borderBottom: '1px solid ' + BORDER }}>
                          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 8px' }}>Add New Item</p>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 120px 50px', gap: 6, alignItems: 'center' }}>
                            <input type="text" value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value, key: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))} placeholder="Item name"
                              style={{ padding: '5px 8px', fontFamily: "'Inter', sans-serif", fontSize: 11, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 6, color: INK }} />
                            <input type="number" value={newItem.internal || ''} onChange={e => setNewItem(p => ({ ...p, internal: e.target.value }))} placeholder="0"
                              style={{ width: 80, padding: '5px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 6, textAlign: 'right', color: INK }} />
                            <input type="number" value={newItem.external || ''} onChange={e => setNewItem(p => ({ ...p, external: e.target.value }))} placeholder="0"
                              style={{ width: 80, padding: '5px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 6, textAlign: 'right', color: INK }} />
                            <select value={newItem.unit} onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                              style={{ padding: '5px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 6, color: INK }}>
                              {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                            <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                              <button onClick={() => addNewItem(cat)} style={{ background: GREEN, color: SURFACE, border: 'none', borderRadius: 5, padding: '4px 8px', cursor: 'pointer', fontWeight: 600, fontSize: 10 }}>&#10003;</button>
                              <button onClick={() => setShowAddItem(null)} style={{ background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 5, padding: '4px 8px', cursor: 'pointer', fontWeight: 600, fontSize: 10 }}>&#10007;</button>
                            </div>
                          </div>
                        </div>
                      )}
                      {canEditDB && !showAddItem && (
                        <div style={{ padding: '8px 16px' }}>
                          <button onClick={() => { setShowAddItem(cat); setNewItem({ key: '', label: '', internal: 0, external: 0, unit: 'per month' }); }}
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: ACCENT, border: '1.5px dashed ' + ACCENT, borderRadius: 6, padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, width: '100%', justifyContent: 'center' }}>
                            <Plus style={{ width: 12, height: 12 }} /> Add Item
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Manifesto */}
            <div style={{ background: INK, borderRadius: 8, padding: '20px 24px', marginTop: 16, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: 20, color: SURFACE, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>Cost discipline is margin discipline</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '8px 0 0' }}>Internal = carrier/vendor cost. External = third-party pass-through. Both form the cost base. Keep them accurate.</p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {visibleCostCategories.reduce((s, cat) => s + Object.keys(costDB[cat] || {}).length, 0)} visible items across {visibleCostCategories.length} categor{visibleCostCategories.length === 1 ? 'y' : 'ies'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB 3: SCENARIO MANAGEMENT
            ═══════════════════════════════════════════════════ */}
        {activeTab === 'scenarios' && (
          <div className="fade-in">
            <div style={{ borderBottom: '2px solid ' + INK, paddingBottom: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>03 / Scenario Management</p>
                <h2 style={{ fontWeight: 800, fontSize: 30, color: INK, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '6px 0 0' }}>Editable deployment scenarios</h2>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={startAddScenario} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: ACCENT, color: SURFACE, border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Plus style={{ width: 13, height: 13 }} /> Add Scenario
                </button>
                <button onClick={exportScenarios} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: SURFACE, color: ACCENT, border: '1.5px solid ' + ACCENT, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Download style={{ width: 13, height: 13 }} /> Export
                </button>
                <button onClick={() => scenarioImportRef.current?.click()} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: SURFACE, color: ACCENT2, border: '1.5px solid ' + ACCENT2, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Upload style={{ width: 13, height: 13 }} /> Import
                </button>
                <input ref={scenarioImportRef} type="file" accept="application/json,.json" onChange={importScenarios} style={{ display: 'none' }} />
                <button onClick={() => setConfirmAction({ title: 'Reset Scenarios', message: 'This will reset all scenario cards back to the built-in defaults. Cost database items will not be changed.', confirmLabel: 'Reset Scenarios', onConfirm: resetScenariosToFactory })}
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: SURFACE, color: RED, border: '1.5px solid #FECACA', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <RefreshCw style={{ width: 13, height: 13 }} /> Reset Scenarios
                </button>
              </div>
            </div>

            <div style={{ background: GREEN_SOFT, border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
              <p style={{ fontSize: 12, color: GREEN, fontWeight: 600, margin: 0 }}>Saved scenario changes are applied immediately to the Sales Calculator. No code change or page refresh is required.</p>
            </div>

            <div style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, padding: '16px 18px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, margin: 0 }}>Scenario Sections</p>
                  <p style={{ fontSize: 12, color: INK3, margin: '4px 0 0' }}>Configure how scenarios are grouped in the Sales Calculator.</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={startAddSection} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: ACCENT, color: SURFACE, border: 'none', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Plus style={{ width: 12, height: 12 }} /> Add Section</button>
                  <button onClick={() => setConfirmAction({ title: 'Reset Scenario Sections', message: 'This will restore the built-in scenario sections and move scenarios in deleted sections back to Certified.', confirmLabel: 'Reset Sections', onConfirm: resetScenarioSectionsToFactory })} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, background: SURFACE, color: RED, border: '1.5px solid #FECACA', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><RefreshCw style={{ width: 12, height: 12 }} /> Reset Sections</button>
                </div>
              </div>

              {showSectionForm && (
                <div style={{ background: BG, border: '1px solid ' + BORDER, borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 2fr auto', gap: 8, alignItems: 'end' }}>
                    <div>
                      <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Section ID</label>
                      <input value={sectionForm.id} onChange={e => setSectionForm(p => ({ ...p, id: e.target.value }))} style={{ width: '100%', padding: '8px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, border: '1.5px solid ' + BORDER, borderRadius: 8, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Section Name</label>
                      <input value={sectionForm.label} onChange={e => setSectionForm(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Enterprise SIP Solutions" style={{ width: '100%', padding: '8px 10px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, borderRadius: 8, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Description</label>
                      <input value={sectionForm.desc} onChange={e => setSectionForm(p => ({ ...p, desc: e.target.value }))} placeholder="Shown below section title in Sales Calculator" style={{ width: '100%', padding: '8px 10px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, borderRadius: 8, boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={saveScenarioSection} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: ACCENT, color: SURFACE, border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => { setShowSectionForm(false); setEditingSectionId(null); setSectionForm({ id: '', label: '', desc: '' }); }} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: 8 }}>
                {scenarioSections.map((section, index) => {
                  const count = scenarios.filter(sc => (sc.scenarioType || 'certified') === section.id).length;
                  return (
                    <div key={section.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', padding: '10px 12px', border: '1px solid ' + BORDER, borderRadius: 8, background: BG }}>
                      <div>
                        <div style={{ fontWeight: 800, color: INK, fontSize: 13 }}>{section.label}</div>
                        <div style={{ fontSize: 11, color: INK3, marginTop: 3 }}>{section.desc || 'No description'} · {count} scenario{count === 1 ? '' : 's'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <button disabled={index === 0} onClick={() => moveScenarioSection(section.id, -1)} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 10, background: SURFACE, color: INK3, border: '1px solid ' + BORDER, borderRadius: 6, padding: '5px 8px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>Up</button>
                        <button disabled={index === scenarioSections.length - 1} onClick={() => moveScenarioSection(section.id, 1)} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 10, background: SURFACE, color: INK3, border: '1px solid ' + BORDER, borderRadius: 6, padding: '5px 8px', cursor: index === scenarioSections.length - 1 ? 'not-allowed' : 'pointer' }}>Down</button>
                        <button onClick={() => startEditSection(section)} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 10, background: SURFACE, color: ACCENT, border: '1px solid ' + ACCENT + '55', borderRadius: 6, padding: '5px 8px', cursor: 'pointer' }}>Edit</button>
                        <button disabled={scenarioSections.length <= 1} onClick={() => setConfirmAction({ title: 'Delete Scenario Section', message: 'Scenarios in this section will be moved to another available section.', confirmLabel: 'Delete Section', onConfirm: () => removeScenarioSection(section.id) })} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 10, background: SURFACE, color: RED, border: '1px solid #FECACA', borderRadius: 6, padding: '5px 8px', cursor: scenarioSections.length <= 1 ? 'not-allowed' : 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {showScenarioForm && (
              <div style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, padding: '18px 20px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, margin: 0 }}>{editingScenarioId ? 'Edit Scenario' : 'New Scenario'}</p>
                  <button onClick={() => { setShowScenarioForm(false); setEditingScenarioId(null); setScenarioForm(blankScenario); }} style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 6, padding: 5, cursor: 'pointer' }}><X style={{ width: 14, height: 14, color: INK3 }} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Scenario Name</label>
                    <input value={scenarioForm.name} onChange={e => setScenarioForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. SIP Trunk + Cloud PBX" style={{ width: '100%', padding: '8px 10px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, borderRadius: 8, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Scenario ID</label>
                    <input value={scenarioForm.id} onChange={e => setScenarioForm(p => ({ ...p, id: e.target.value }))} placeholder="auto-generated-if-blank" style={{ width: '100%', padding: '8px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, border: '1.5px solid ' + BORDER, borderRadius: 8, boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Scenario Section</label>
                  <select value={scenarioForm.scenarioType || 'certified'} onChange={e => setScenarioForm(p => ({ ...p, scenarioType: e.target.value }))} style={{ width: '100%', padding: '8px 10px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, borderRadius: 8, boxSizing: 'border-box' }}>
                    {scenarioSections.map(section => <option key={section.id} value={section.id}>{section.label}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Description</label>
                  <textarea value={scenarioForm.desc} onChange={e => setScenarioForm(p => ({ ...p, desc: e.target.value }))} rows={3} placeholder="Describe when this scenario should be used" style={{ width: '100%', padding: '8px 10px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, borderRadius: 8, resize: 'vertical', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Icon</label>
                    <select value={scenarioForm.iconKey} onChange={e => setScenarioForm(p => ({ ...p, iconKey: e.target.value }))} style={{ width: '100%', padding: '8px 10px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, borderRadius: 8 }}>
                      {SCENARIO_ICON_OPTIONS.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 5 }}>Colour</label>
                    <select value={(SCENARIO_COLOR_OPTIONS.find(c => c.color === scenarioForm.color) || SCENARIO_COLOR_OPTIONS[0]).name} onChange={e => applyScenarioColor(e.target.value)} style={{ width: '100%', padding: '8px 10px', fontFamily: "'Inter', sans-serif", fontSize: 13, border: '1.5px solid ' + BORDER, borderRadius: 8 }}>
                      {SCENARIO_COLOR_OPTIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid ' + BORDER, paddingTop: 14 }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK3, margin: '0 0 10px' }}>Included Cost Items ({(scenarioForm.items || []).length})</p>
                  <p style={{ fontSize: 12, color: INK3, lineHeight: 1.5, margin: '0 0 12px' }}>For each selected item, admin can define default quantity, whether sales can edit quantity, min/max quantity, and mandatory flag.</p>
                  {catOrder.filter(cat => costDB[cat]).map(cat => (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: INK, margin: '0 0 6px' }}>{catLabels[cat] || cat}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {Object.keys(costDB[cat]).map(key => {
                          const dotPath = cat + '.' + key;
                          const checked = (scenarioForm.items || []).includes(dotPath);
                          const setting = (scenarioForm.itemSettings || {})[dotPath] || { defaultQty: 1, quantityEditable: true, minQty: 0, maxQty: 9999, mandatory: false };
                          return (
                            <div key={dotPath} style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1.6fr) 140px 70px 95px 70px 70px 90px', gap: 6, alignItems: 'center', padding: '7px 8px', border: '1px solid ' + (checked ? ACCENT + '55' : BORDER), borderRadius: 7, background: checked ? ACCENT_SOFT : SURFACE }}>
                              <button onClick={() => toggleScenarioItem(dotPath)} style={{ textAlign: 'left', fontSize: 11, padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, border: checked ? '1.5px solid ' + ACCENT : '1px solid ' + BORDER, background: checked ? SURFACE : BG, color: checked ? ACCENT : INK3 }}>
                                {checked ? '✓ ' : ''}{costDB[cat][key].label}
                              </button>
                              <select disabled={!checked} value={setting.lineSection || defaultLineItemSection(dotPath)} onChange={e => updateScenarioItemSetting(dotPath, 'lineSection', e.target.value)} style={{ width: '100%', padding: '5px', fontFamily: "'Inter', sans-serif", fontSize: 11, border: '1.5px solid ' + BORDER, borderRadius: 6, background: checked ? SURFACE : BG }}>
                                {LINE_ITEM_SECTION_OPTIONS.map(section => <option key={section} value={section}>{section}</option>)}
                              </select>
                              <input disabled={!checked} type="number" value={setting.defaultQty ?? 1} min="0" onChange={e => updateScenarioItemSetting(dotPath, 'defaultQty', Math.max(0, Number(e.target.value) || 0))} style={{ width: '100%', padding: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + BORDER, borderRadius: 6, background: checked ? SURFACE : BG }} title="Default Qty" />
                              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: checked ? INK2 : INK3 }}>
                                <input disabled={!checked} type="checkbox" checked={!!setting.quantityEditable} onChange={e => updateScenarioItemSetting(dotPath, 'quantityEditable', e.target.checked)} /> Editable
                              </label>
                              <input disabled={!checked} type="number" value={setting.minQty ?? 0} min="0" onChange={e => updateScenarioItemSetting(dotPath, 'minQty', Math.max(0, Number(e.target.value) || 0))} style={{ width: '100%', padding: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + BORDER, borderRadius: 6, background: checked ? SURFACE : BG }} title="Min Qty" />
                              <input disabled={!checked} type="number" value={setting.maxQty ?? 9999} min="0" onChange={e => updateScenarioItemSetting(dotPath, 'maxQty', Math.max(0, Number(e.target.value) || 0))} style={{ width: '100%', padding: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, border: '1.5px solid ' + BORDER, borderRadius: 6, background: checked ? SURFACE : BG }} title="Max Qty" />
                              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: checked ? INK2 : INK3 }}>
                                <input disabled={!checked} type="checkbox" checked={!!setting.mandatory} onChange={e => updateScenarioItemSetting(dotPath, 'mandatory', e.target.checked)} /> Mandatory
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) 140px 70px 95px 70px 70px 90px', gap: 6, marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <span>Item</span><span>Section</span><span>Default</span><span>Qty Mode</span><span>Min</span><span>Max</span><span>Mandatory</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid ' + BORDER, paddingTop: 14, marginTop: 6 }}>
                  <button onClick={() => { setShowScenarioForm(false); setEditingScenarioId(null); setScenarioForm(blankScenario); }} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={saveScenario} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: ACCENT, color: SURFACE, border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Save style={{ width: 13, height: 13 }} /> Save Scenario
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
              {scenarios.map(sc => {
                const Icon = getScenarioIcon(sc);
                return (
                  <div key={sc.id} style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: sc.color || ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><SI c={Icon} style={{ width: 14, height: 14, color: SURFACE }} /></div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: '0 0 3px' }}>{sc.name}</p>
                          <p style={{ fontSize: 12, color: INK3, lineHeight: 1.5, margin: 0 }}>{sc.desc}</p>
                          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '8px 0 0' }}>{getScenarioSectionLabel(sc.scenarioType || 'certified')} · {sc.items.length} line items</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button title="Move up" onClick={() => moveScenario(sc.id, -1)} style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 6, padding: '4px 7px', cursor: 'pointer', color: INK3, fontWeight: 800, fontSize: 11 }}>↑</button>
                        <button title="Move down" onClick={() => moveScenario(sc.id, 1)} style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 6, padding: '4px 7px', cursor: 'pointer', color: INK3, fontWeight: 800, fontSize: 11 }}>↓</button>
                        <button title="Clone scenario" onClick={() => cloneScenario(sc)} style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 6, padding: 5, cursor: 'pointer', color: ACCENT2 }}><Copy style={{ width: 13, height: 13 }} /></button>
                        <button title="Edit scenario" onClick={() => startEditScenario(sc)} style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 6, padding: 5, cursor: 'pointer', color: ACCENT }}><Edit style={{ width: 13, height: 13 }} /></button>
                        <button title="Delete scenario" onClick={() => setConfirmAction({ title: 'Delete Scenario', message: 'Delete scenario "' + sc.name + '"? Existing saved quotes will not be removed.', confirmLabel: 'Delete Scenario', onConfirm: () => removeScenario(sc.id) })} style={{ background: SURFACE, border: '1.5px solid #FECACA', borderRadius: 6, padding: 5, cursor: 'pointer', color: RED }}><Trash2 style={{ width: 13, height: 13 }} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB 3: SAVED QUOTES
            ═══════════════════════════════════════════════════ */}
        {activeTab === 'quotes' && (
          <div className="fade-in">
            <div style={{ borderBottom: '2px solid ' + INK, paddingBottom: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>03 / Estimated Cost</p>
                <h2 style={{ fontWeight: 800, fontSize: 30, color: INK, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '6px 0 0' }}>Estimated cost history</h2>
              </div>
              <p style={{ fontSize: 13, color: INK3, margin: 0 }}>{quoteItems.length} estimated cost record{quoteItems.length !== 1 ? 's' : ''} saved</p>
            </div>

            {quoteItems.length === 0 ? (
              <div style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, padding: '50px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <FileText style={{ width: 22, height: 22, color: INK3 }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: INK, margin: '0 0 4px' }}>No estimated costs saved yet</p>
                <p style={{ fontSize: 12, color: INK3, margin: 0 }}>Use the Sales Calculator to build and save an estimated cost.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {quoteItems.map((qi, idx) => {
                  const totalCost = qi.lines.reduce((s, l) => s + l.internal + l.external, 0);
                  return (
                    <div key={idx} style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '2px solid ' + INK, background: BG, flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 14, color: INK }}>{qi.scenario}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, marginLeft: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {qi.date}
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ACCENT, marginLeft: 8, letterSpacing: '0.06em' }}>
                            {qi.ref}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 20, color: ACCENT }}>{formatMYR(totalCost)}</span>
                          <button onClick={() => exportQuoteToPDF(qi)} title="Export PDF" style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: INK3 }}>
                            <Printer style={{ width: 13, height: 13 }} />
                          </button>
                          <button onClick={() => exportQuoteToExcel(qi)} title="Export Excel" style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: GREEN }}>
                            XLS
                          </button>
                          <button onClick={() => duplicateQuote(idx)} title="Duplicate" style={{ background: SURFACE, border: '1.5px solid ' + BORDER, borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: INK3 }}>
                            <Copy style={{ width: 13, height: 13 }} />
                          </button>
                          <button onClick={() => removeQuoteItem(idx)} style={{ background: SURFACE, border: '1.5px solid #FECACA', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: RED }}>
                            <X style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '0 18px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '110px 2fr 50px 100px', padding: '5px 0', borderBottom: '1px solid ' + BORDER, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3 }}>
                          <span>Section</span><span>Item</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'right' }}>Estimated Cost</span>
                        </div>
                        {qi.lines.map((l, li) => (
                          <div key={li} style={{ display: 'grid', gridTemplateColumns: '110px 2fr 50px 100px', padding: '5px 0', borderBottom: '1px solid ' + BORDER }}>
                            <span style={{ fontSize: 10, color: INK3, fontWeight: 600 }}>{l.section || 'Line Items'}</span>
                            <span style={{ fontSize: 11, color: INK, fontWeight: 500 }}>{l.label}</span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textAlign: 'center', color: INK2 }}>{l.qty}</span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textAlign: 'right', color: ACCENT, fontWeight: 600 }}>{formatMYR(l.internal + l.external)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '110px 2fr 50px 100px', padding: '8px 18px', borderTop: '2px solid ' + INK, background: BG }}>
                        <span style={{ fontWeight: 700, fontSize: 12, color: INK }}>Total</span>
                        <span />
                        <span />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: 'right', color: ACCENT, fontWeight: 700 }}>{formatMYR(totalCost)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB 4: USER MANAGEMENT (Admin only)
            ═══════════════════════════════════════════════════ */}
        {activeTab === 'users' && canManageUsers && (
          <div className="fade-in">
            <div style={{ borderBottom: '2px solid ' + INK, paddingBottom: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>04 / User Management</p>
                <h2 style={{ fontWeight: 800, fontSize: 30, color: INK, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '6px 0 0' }}>Access control</h2>
              </div>
              <button onClick={() => setShowAddUser(true)} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, background: ACCENT, color: SURFACE, border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <UserPlus style={{ width: 14, height: 14 }} /> Add User
              </button>
            </div>

            <p style={{ fontSize: 13, color: INK3, lineHeight: 1.6, maxWidth: 600, marginBottom: 16 }}>
              Manage user accounts and role-based access. <strong style={{ color: INK }}>Admin</strong> has full access. <strong style={{ color: INK }}>Engineering</strong> can edit cost database. <strong style={{ color: INK }}>Sales</strong> can only use calculator and view quotes.
            </p>

            {/* Role legend */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: ROLE_COLORS[role] }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: INK }}>{label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3 }}>
                    {role === 'admin' ? 'Full access' : role === 'editor' ? 'DB edit + sales' : 'Calculator + quotes'}
                  </span>
                </div>
              ))}
            </div>

            {/* Add user form */}
            {showAddUser && (
              <div style={{ background: ACCENT_SOFT, border: '1.5px solid ' + ACCENT + '40', borderRadius: 8, padding: '16px 20px', marginBottom: 14 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 10px' }}>New User</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 4 }}>Display Name</label>
                    <input type="text" value={newUserForm.displayName} onChange={e => setNewUserForm(p => ({ ...p, displayName: e.target.value }))} placeholder="John Doe"
                      style={{ width: '100%', padding: '7px 10px', fontFamily: "'Inter', sans-serif", fontSize: 12, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 4 }}>Username</label>
                    <input type="text" value={newUserForm.username} onChange={e => setNewUserForm(p => ({ ...p, username: e.target.value }))} placeholder="johndoe"
                      style={{ width: '100%', padding: '7px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, display: 'block', marginBottom: 4 }}>Password</label>
                    <input type="text" value={newUserForm.password} onChange={e => setNewUserForm(p => ({ ...p, password: e.target.value }))} placeholder="Initial password"
                      style={{ width: '100%', padding: '7px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'end' }}>
                    <select value={newUserForm.role} onChange={e => setNewUserForm(p => ({ ...p, role: e.target.value }))}
                      style={{ padding: '7px 10px', fontFamily: "'Inter', sans-serif", fontSize: 12, border: '1.5px solid ' + BORDER, background: SURFACE, borderRadius: 8, color: INK }}>
                      <option value="sales">Sales</option>
                      <option value="editor">Engineering</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={addUser} style={{ background: GREEN, color: SURFACE, border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>&#10003; Add</button>
                    <button onClick={() => setShowAddUser(false)} style={{ background: SURFACE, color: INK3, border: '1.5px solid ' + BORDER, borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* User list */}
            <div style={{ background: SURFACE, border: '1px solid ' + BORDER, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 80px', padding: '8px 18px', borderBottom: '2px solid ' + INK, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK3, background: BG }}>
                <span /><span>User</span><span>Username</span><span>Role</span><span />
              </div>
              {users.map(u => (
                <div key={u.username} style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 80px', padding: '10px 18px', borderBottom: '1px solid ' + BORDER, alignItems: 'center', background: u.username === currentUser.username ? ACCENT_SOFT : SURFACE }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: ROLE_COLORS[u.role] || ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: SURFACE }}>{u.displayName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{u.displayName}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: INK2 }}>{u.username}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 4, background: ROLE_COLORS[u.role] }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {u.username !== 'admin' && u.username !== currentUser.username && (
                      <button onClick={() => setConfirmAction({ title: 'Remove User', message: 'Remove "' + u.displayName + '" from the system? They will no longer be able to sign in.', confirmLabel: 'Remove User', onConfirm: () => { removeUser(u.username); setConfirmAction(null); } })}
                        style={{ background: SURFACE, border: '1.5px solid #FECACA', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: RED, fontSize: 11, fontWeight: 600 }}>
                        <Trash2 style={{ width: 12, height: 12 }} />
                      </button>
                    )}
                    {u.username === currentUser.username && (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, letterSpacing: '0.06em' }}>YOU</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Security notice */}
            <div style={{ background: AMBER + '10', border: '1px solid #FDE68A', borderRadius: 8, padding: '14px 18px', marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <AlertTriangle style={{ width: 16, height: 16, color: AMBER, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: INK, margin: '0 0 4px' }}>Security Notice</p>
                  <p style={{ fontSize: 12, color: INK3, lineHeight: 1.55, margin: 0 }}>
                    Credentials are stored locally in this browser. For production deployment, integrate with a proper authentication service (LDAP, SSO, OAuth). Change the default admin password immediately after first login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid ' + BORDER, padding: '12px 24px', textAlign: 'center', marginTop: 24 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: INK3, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          SIP Services Pricing Playbook &middot; v3.0 &middot; Jun 2026 &middot; Confidential
        </p>
      </div>
    </div>
  );
}
