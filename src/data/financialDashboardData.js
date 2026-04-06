/**
 * Financial Dashboard (IFAD) Mock Data
 * Insurance Financial Analytics Dashboard data layer
 * Includes monthly chart data, KPI summaries, and asset performance ledger
 */

import { mockProperties, mockVehicles, mockBusinessClaims } from './businessMockData';

// =============================================================================
// MONTHLY CHART DATA (2024 Full Year)
// =============================================================================

export const monthlyChartData = [
  { month: 'Jan', propertyPremiums: 275600, propertyClaims: 98400,  autoPremiums: 85200, autoClaims: 28600 },
  { month: 'Feb', propertyPremiums: 275600, propertyClaims: 134700, autoPremiums: 85200, autoClaims: 45200 },
  { month: 'Mar', propertyPremiums: 281200, propertyClaims: 76800,  autoPremiums: 87400, autoClaims: 22400 },
  { month: 'Apr', propertyPremiums: 281200, propertyClaims: 112300, autoPremiums: 87400, autoClaims: 38900 },
  { month: 'May', propertyPremiums: 283800, propertyClaims: 89600,  autoPremiums: 89100, autoClaims: 31200 },
  { month: 'Jun', propertyPremiums: 283800, propertyClaims: 245400, autoPremiums: 89100, autoClaims: 67800 },
  { month: 'Jul', propertyPremiums: 286400, propertyClaims: 102100, autoPremiums: 90800, autoClaims: 29400 },
  { month: 'Aug', propertyPremiums: 286400, propertyClaims: 118700, autoPremiums: 90800, autoClaims: 41200 },
  { month: 'Sep', propertyPremiums: 289000, propertyClaims: 94300,  autoPremiums: 92300, autoClaims: 33800 },
  { month: 'Oct', propertyPremiums: 291600, propertyClaims: 167800, autoPremiums: 92300, autoClaims: 54600 },
  { month: 'Nov', propertyPremiums: 291600, propertyClaims: 88400,  autoPremiums: 93900, autoClaims: 27300 },
  { month: 'Dec', propertyPremiums: 294200, propertyClaims: 118900, autoPremiums: 95400, autoClaims: 44700 },
];

// =============================================================================
// KPI SUMMARY (Derived from monthly data)
// =============================================================================

export const kpiSummary = (() => {
  const propertyOwed = monthlyChartData.reduce((s, m) => s + m.propertyPremiums, 0);  // 3,420,400
  const propertyClaimed = monthlyChartData.reduce((s, m) => s + m.propertyClaims, 0); // 1,447,400
  const autoOwed = monthlyChartData.reduce((s, m) => s + m.autoPremiums, 0);           // 1,078,900
  const autoClaimed = monthlyChartData.reduce((s, m) => s + m.autoClaims, 0);          // 465,100

  return {
    totalOwedYTD: propertyOwed + autoOwed,       // $4,499,300
    totalClaimedYTD: propertyClaimed + autoClaimed, // $1,912,500
    propertyOwedYTD: propertyOwed,
    propertyClaimedYTD: propertyClaimed,
    autoOwedYTD: autoOwed,
    autoClaimedYTD: autoClaimed,
    lossRatioOverall: ((propertyClaimed + autoClaimed) / (propertyOwed + autoOwed) * 100).toFixed(1),
    lossRatioProperty: (propertyClaimed / propertyOwed * 100).toFixed(1),
    lossRatioAuto: (autoClaimed / autoOwed * 100).toFixed(1),
  };
})();

// =============================================================================
// ASSET LEDGER (Combined properties + vehicles with claim totals)
// =============================================================================

function getClaimTotalForAsset(assetId) {
  return mockBusinessClaims
    .filter(c => c.assetId === assetId)
    .reduce((sum, c) => sum + c.claimAmount, 0);
}

function getClaimCountForAsset(assetId) {
  return mockBusinessClaims.filter(c => c.assetId === assetId).length;
}

// Stagger due dates across the next 3 months
const dueDates = [
  '2025-05-01', '2025-05-01', '2025-05-01', '2025-05-01',
  '2025-05-15', '2025-05-15', '2025-05-15', '2025-05-15',
  '2025-06-01', '2025-06-01', '2025-06-01', '2025-06-01',
  '2025-05-01', '2025-05-01', '2025-05-01', '2025-05-01',
  '2025-05-15', '2025-05-15', '2025-05-15', '2025-05-15',
  '2025-06-01', '2025-06-01',
];

export const assetLedger = (() => {
  const propertyAssets = mockProperties.map((prop, i) => ({
    id: prop.id,
    name: prop.name,
    category: 'Property',
    premiumDue: prop.monthlyPremium,
    dueDate: dueDates[i] || '2025-05-01',
    totalClaims: getClaimTotalForAsset(prop.id),
    claimsCount: getClaimCountForAsset(prop.id),
    coverageLimit: prop.coverageLimit,
    status: prop.status,
    lossRatio: prop.monthlyPremium > 0
      ? ((getClaimTotalForAsset(prop.id) / (prop.monthlyPremium * 12)) * 100)
      : 0,
  }));

  const vehicleAssets = mockVehicles.slice(0, 15).map((veh, i) => ({
    id: veh.id,
    name: `${veh.year} ${veh.make} ${veh.model}`,
    category: 'Auto',
    premiumDue: veh.monthlyPremium,
    dueDate: dueDates[i + 12] || '2025-05-01',
    totalClaims: getClaimTotalForAsset(veh.id),
    claimsCount: getClaimCountForAsset(veh.id),
    coverageLimit: veh.coverageLimit,
    status: veh.status,
    lossRatio: veh.monthlyPremium > 0
      ? ((getClaimTotalForAsset(veh.id) / (veh.monthlyPremium * 12)) * 100)
      : 0,
  }));

  return [...propertyAssets, ...vehicleAssets];
})();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format large dollar amounts as compact strings: $4.5M, $850K
 */
export function formatLargeCurrency(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

/**
 * Format as full USD currency string
 */
export function formatCurrencyFull(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format date string as MM/DD/YYYY
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

/**
 * Determine risk level from loss ratio
 */
export function getRiskLevel(lossRatio) {
  if (lossRatio >= 60) return 'High';
  if (lossRatio >= 35) return 'Medium';
  return 'Low';
}

/**
 * Get risk color token from loss ratio
 */
export function getRiskColor(lossRatio) {
  if (lossRatio >= 60) return 'red';
  if (lossRatio >= 35) return 'orange';
  return 'green';
}

/**
 * Get chart Y-axis tick formatted as $K or $M
 */
export function formatYAxisTick(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

/**
 * Get tooltip currency value
 */
export function formatTooltipCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
