/**
 * Insurance Financial Analytics (IFAD)
 *
 * Derives the financial figures required by the Insurance Financial Analytics
 * Dashboard from the existing business mock data: year-to-date owed/claimed,
 * the Auto vs Property portfolio split, a monthly multi-series history, and the
 * per-asset performance ledger. All figures support a "gross" vs "net" mode.
 */

import {
  mockProperties,
  mockVehicles,
  mockBusinessClaims,
  getClaimsForAsset,
} from '../data/businessMockData';
import { formatVehicleName, getAssetType } from './businessHelpers';

// The 12-month window the historical chart and YTD figures are framed around.
const MONTH_LABELS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
// Calendar months (0-indexed) and the year each falls in, anchored Apr 2023 - Mar 2024.
const WINDOW = [
  { month: 3, year: 2023 }, { month: 4, year: 2023 }, { month: 5, year: 2023 },
  { month: 6, year: 2023 }, { month: 7, year: 2023 }, { month: 8, year: 2023 },
  { month: 9, year: 2023 }, { month: 10, year: 2023 }, { month: 11, year: 2023 },
  { month: 0, year: 2024 }, { month: 1, year: 2024 }, { month: 2, year: 2024 },
];

const sum = (arr, fn) => arr.reduce((total, item) => total + fn(item), 0);

const propertyClaims = () => mockBusinessClaims.filter((c) => c.assetType === 'property');
const vehicleClaims = () => mockBusinessClaims.filter((c) => c.assetType === 'vehicle');

/**
 * High-level portfolio summary used by the KPI widgets.
 * In "net" mode, owed is reduced by approved claim payouts and claimed reflects
 * approved (paid) amounts rather than gross filed amounts.
 * @param {'gross'|'net'} mode
 */
export function getFinancialSummary(mode = 'gross') {
  const propertyOwedGross = sum(mockProperties, (p) => p.yearlyPremium);
  const autoOwedGross = sum(mockVehicles, (v) => v.yearlyPremium);

  const propertyClaimedGross = sum(propertyClaims(), (c) => c.claimAmount);
  const autoClaimedGross = sum(vehicleClaims(), (c) => c.claimAmount);

  const propertyClaimedNet = sum(propertyClaims(), (c) => c.approvedAmount || 0);
  const autoClaimedNet = sum(vehicleClaims(), (c) => c.approvedAmount || 0);

  const isNet = mode === 'net';
  const propertyClaimed = isNet ? propertyClaimedNet : propertyClaimedGross;
  const autoClaimed = isNet ? autoClaimedNet : autoClaimedGross;

  // Net owed nets premiums against the claims paid out against them.
  const propertyOwed = isNet ? propertyOwedGross - propertyClaimedNet : propertyOwedGross;
  const autoOwed = isNet ? autoOwedGross - autoClaimedNet : autoOwedGross;

  const totalOwed = propertyOwed + autoOwed;
  const totalClaimed = propertyClaimed + autoClaimed;

  return {
    mode,
    totalOwed,
    totalClaimed,
    propertyOwed,
    autoOwed,
    propertyClaimed,
    autoClaimed,
    netPosition: totalOwed - totalClaimed,
    lossRatio: totalOwed > 0 ? (totalClaimed / (propertyOwedGross + autoOwedGross)) * 100 : 0,
  };
}

/**
 * Monthly multi-series history for the expense visualization chart.
 * Premiums grow gently month over month; claims are bucketed by incident date.
 * @param {'gross'|'net'} mode
 */
export function getMonthlySeries(mode = 'gross') {
  const monthlyPropertyPremium = sum(mockProperties, (p) => p.monthlyPremium);
  const monthlyAutoPremium = sum(mockVehicles, (v) => v.monthlyPremium);
  const claims = mode === 'net'
    ? mockBusinessClaims.filter((c) => c.approvedAmount)
    : mockBusinessClaims;
  const claimValue = (c) => (mode === 'net' ? c.approvedAmount || 0 : c.claimAmount);

  const points = WINDOW.map((slot, index) => {
    // Slight upward premium drift so the lines are not perfectly flat.
    const growth = 1 + index * 0.012;
    const inMonth = (c) => {
      const d = new Date(c.incidentDate);
      return d.getMonth() === slot.month && d.getFullYear() === slot.year;
    };
    return {
      label: MONTH_LABELS[index],
      propertyPremiums: Math.round(monthlyPropertyPremium * growth),
      autoPremiums: Math.round(monthlyAutoPremium * growth),
      propertyClaims: sum(claims.filter((c) => c.assetType === 'property' && inMonth(c)), claimValue),
      autoClaims: sum(claims.filter((c) => c.assetType === 'vehicle' && inMonth(c)), claimValue),
    };
  });

  return points;
}

// Stable presentation metadata for each chart series.
export const SERIES_META = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: 'var(--color-success)', group: 'premium' },
  { key: 'autoPremiums', label: 'Auto Premiums', color: 'var(--color-brand-blue-50)', group: 'premium' },
  { key: 'propertyClaims', label: 'Property Claims', color: 'var(--color-brand-red-60)', group: 'claim' },
  { key: 'autoClaims', label: 'Auto Claims', color: 'var(--color-warning)', group: 'claim' },
];

/**
 * Deterministic next-premium due date for an asset so the ledger has a sortable
 * "Due Date" column without needing a real billing schedule in the mock data.
 */
function nextDueDate(assetId, index) {
  const base = new Date(2024, 3, 1); // Apr 1 2024
  base.setDate(base.getDate() + ((index * 11) % 60));
  return base.toISOString().slice(0, 10);
}

/**
 * Combined per-asset ledger of Auto + Property assets.
 * totalClaims is the lifecycle sum of claim amounts tied to each asset.
 */
export function getAssetLedger() {
  const properties = mockProperties.map((p, i) => ({
    id: p.id,
    name: p.name,
    category: 'Property',
    premiumDue: p.monthlyPremium,
    dueDate: nextDueDate(p.id, i),
    totalClaims: sum(getClaimsForAsset(p.id), (c) => c.claimAmount),
    claimsCount: p.claimsCount,
    status: p.status,
  }));

  const vehicles = mockVehicles.map((v, i) => ({
    id: v.id,
    name: formatVehicleName(v),
    category: 'Auto',
    premiumDue: v.monthlyPremium,
    dueDate: nextDueDate(v.id, i + properties.length),
    totalClaims: sum(getClaimsForAsset(v.id), (c) => c.claimAmount),
    claimsCount: v.claimsCount,
    status: v.status,
  }));

  return [...properties, ...vehicles];
}

/**
 * Resolve the drill-down route for a ledger asset.
 */
export function getAssetDetailPath(assetId) {
  return getAssetType(assetId) === 'vehicle'
    ? `/business/fleet/${assetId}`
    : `/business/properties/${assetId}`;
}
