import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heading,
  ContentSwitcher,
  Switch,
  Tag,
  Button,
} from '@carbon/react';
import {
  ArrowRight,
  Warning,
  CheckmarkFilled,
  ErrorFilled,
  Building,
  CarFront,
  Analytics,
} from '@carbon/icons-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  monthlyChartData,
  kpiSummary,
  assetLedger,
  formatLargeCurrency,
  formatCurrencyFull,
  formatDate,
  formatYAxisTick,
  formatTooltipCurrency,
  getRiskLevel,
} from '../../data/financialDashboardData';
import './FinancialDashboardV3.scss';

const NET_ADJUSTMENT = 0.88;

const SERIES = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: '#42be65', show: true },
  { key: 'propertyClaims',   label: 'Property Claims',   color: '#ff8389', show: true },
  { key: 'autoPremiums',     label: 'Auto Premiums',     color: '#74b1ff', show: true },
  { key: 'autoClaims',       label: 'Auto Claims',       color: '#fa4d56', show: true },
];

function RiskIcon({ lossRatio }) {
  if (lossRatio >= 60) return <ErrorFilled size={16} className="v3-risk-icon v3-risk-icon--high" />;
  if (lossRatio >= 35) return <Warning size={16} className="v3-risk-icon v3-risk-icon--medium" />;
  return <CheckmarkFilled size={16} className="v3-risk-icon v3-risk-icon--low" />;
}

function BigNumber({ label, value, sub, color }) {
  return (
    <div className="v3-big-number" style={{ '--accent': color }}>
      <p className="v3-big-number-label">{label}</p>
      <p className="v3-big-number-value">{value}</p>
      {sub && <p className="v3-big-number-sub">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="v3-chart-tooltip">
      <p className="v3-tooltip-label">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="v3-tooltip-row">
          <span className="v3-tooltip-dot" style={{ background: p.color }} />
          <span className="v3-tooltip-name">{p.name}:</span>
          <span className="v3-tooltip-val">{formatTooltipCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function FinancialDashboardV3() {
  const navigate = useNavigate();
  const [valueMode, setValueMode] = useState('gross');
  const [activeSeries, setActiveSeries] = useState(() =>
    Object.fromEntries(SERIES.map(s => [s.key, true]))
  );
  const [sortKey, setSortKey] = useState('totalClaims');
  const [sortDir, setSortDir] = useState('DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  const multiplier = valueMode === 'net' ? NET_ADJUSTMENT : 1;

  const kpi = useMemo(() => ({
    totalOwed:      kpiSummary.totalOwedYTD * multiplier,
    totalClaimed:   kpiSummary.totalClaimedYTD * multiplier,
    propertyOwed:   kpiSummary.propertyOwedYTD * multiplier,
    propertyClaimed: kpiSummary.propertyClaimedYTD * multiplier,
    autoOwed:       kpiSummary.autoOwedYTD * multiplier,
    autoClaimed:    kpiSummary.autoClaimedYTD * multiplier,
    lossRatio:      kpiSummary.lossRatioOverall,
  }), [multiplier]);

  const chartData = useMemo(() =>
    monthlyChartData.map(d => ({
      ...d,
      propertyPremiums: Math.round(d.propertyPremiums * multiplier),
      propertyClaims:   Math.round(d.propertyClaims * multiplier),
      autoPremiums:     Math.round(d.autoPremiums * multiplier),
      autoClaims:       Math.round(d.autoClaims * multiplier),
    })),
    [multiplier]
  );

  const tableRows = useMemo(() => {
    let rows = assetLedger
      .filter(a => searchQuery === '' || a.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(a => ({
        ...a,
        premiumDueFmt: formatCurrencyFull(a.premiumDue * multiplier),
        dueDateFmt: formatDate(a.dueDate),
        totalClaimsFmt: formatCurrencyFull(a.totalClaims * multiplier),
        rawClaims: a.totalClaims * multiplier,
        risk: getRiskLevel(a.lossRatio),
        ratioPct: Math.min(a.lossRatio, 100),
      }));

    rows.sort((a, b) => {
      if (sortKey === 'totalClaims') {
        return sortDir === 'DESC' ? b.rawClaims - a.rawClaims : a.rawClaims - b.rawClaims;
      }
      if (sortKey === 'dueDate') {
        return sortDir === 'ASC'
          ? a.dueDate.localeCompare(b.dueDate)
          : b.dueDate.localeCompare(a.dueDate);
      }
      return 0;
    });
    return rows;
  }, [multiplier, sortKey, sortDir, searchQuery]);

  return (
    <div className="v3-dashboard">
      {/* Hero KPI Bar */}
      <div className="v3-hero">
        <div className="v3-hero-inner">
          <div className="v3-hero-top">
            <div className="v3-hero-brand">
              <Analytics size={24} className="v3-brand-icon" />
              <div>
                <p className="v3-hero-eyebrow">Insurance Financial Analytics Dashboard</p>
                <Heading className="v3-hero-title">IFAD — FY 2024</Heading>
              </div>
            </div>
            <div className="v3-hero-controls">
              <ContentSwitcher
                onChange={({ name }) => setValueMode(name)}
                selectedIndex={valueMode === 'gross' ? 0 : 1}
                size="sm"
                className="v3-switcher"
              >
                <Switch name="gross" text="Gross" />
                <Switch name="net" text="Net" />
              </ContentSwitcher>
            </div>
          </div>

          <div className="v3-kpi-row">
            <BigNumber
              label="Total Premiums Owed"
              value={formatLargeCurrency(kpi.totalOwed)}
              sub={`Property ${formatLargeCurrency(kpi.propertyOwed)} · Auto ${formatLargeCurrency(kpi.autoOwed)}`}
              color="#42be65"
            />
            <div className="v3-kpi-divider" />
            <BigNumber
              label="Total Claims Paid"
              value={formatLargeCurrency(kpi.totalClaimed)}
              sub={`Property ${formatLargeCurrency(kpi.propertyClaimed)} · Auto ${formatLargeCurrency(kpi.autoClaimed)}`}
              color="#ff8389"
            />
            <div className="v3-kpi-divider" />
            <div className="v3-big-number v3-big-number--ratio">
              <p className="v3-big-number-label">Overall Loss Ratio</p>
              <p className="v3-big-number-value v3-big-number-value--neutral">{kpi.lossRatio}%</p>
              <div className="v3-ratio-gauge">
                <div className="v3-ratio-fill" style={{ width: `${Math.min(parseFloat(kpi.lossRatio), 100)}%` }} />
              </div>
            </div>
            <div className="v3-kpi-divider" />
            <BigNumber
              label="Property Loss Ratio"
              value={`${kpiSummary.lossRatioProperty}%`}
              sub={`Claims ${formatLargeCurrency(kpi.propertyClaimed)} of ${formatLargeCurrency(kpi.propertyOwed)}`}
              color="#74b1ff"
            />
            <div className="v3-kpi-divider" />
            <BigNumber
              label="Auto Loss Ratio"
              value={`${kpiSummary.lossRatioAuto}%`}
              sub={`Claims ${formatLargeCurrency(kpi.autoClaimed)} of ${formatLargeCurrency(kpi.autoOwed)}`}
              color="#f1c21b"
            />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="v3-section">
        <div className="v3-chart-card">
          <div className="v3-chart-top">
            <div>
              <h2 className="v3-card-title">Expense Visualization</h2>
              <p className="v3-card-sub">Monthly premium vs. claim volatility across all sectors — 2024</p>
            </div>
            <div className="v3-series-pills">
              {SERIES.map(s => (
                <button
                  key={s.key}
                  className={`v3-pill ${activeSeries[s.key] ? 'v3-pill--on' : 'v3-pill--off'}`}
                  style={{ '--pill-color': s.color }}
                  onClick={() => setActiveSeries(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                >
                  <span className="v3-pill-dot" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={chartData} margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
              <defs>
                {SERIES.map(s => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tickFormatter={formatYAxisTick} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={72} />
              <Tooltip content={<CustomTooltip />} />
              {SERIES.map(s => activeSeries[s.key] && (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#grad-${s.key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Ledger */}
      <div className="v3-section">
        <div className="v3-table-card">
          <div className="v3-table-top">
            <div>
              <h2 className="v3-card-title">Asset Performance Ledger</h2>
              <p className="v3-card-sub">Risk-ranked by loss ratio — click any row for full drill-down</p>
            </div>
            <div className="v3-table-controls">
              <div className="v3-search-wrap">
                <input
                  className="v3-search"
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="v3-sort-btns">
                <button
                  className={`v3-sort-btn ${sortKey === 'totalClaims' ? 'v3-sort-btn--active' : ''}`}
                  onClick={() => { setSortKey('totalClaims'); setSortDir(d => d === 'DESC' ? 'ASC' : 'DESC'); }}
                >
                  Highest Claims {sortKey === 'totalClaims' ? (sortDir === 'DESC' ? '↓' : '↑') : ''}
                </button>
                <button
                  className={`v3-sort-btn ${sortKey === 'dueDate' ? 'v3-sort-btn--active' : ''}`}
                  onClick={() => { setSortKey('dueDate'); setSortDir(d => d === 'ASC' ? 'DESC' : 'ASC'); }}
                >
                  Due Date {sortKey === 'dueDate' ? (sortDir === 'ASC' ? '↑' : '↓') : ''}
                </button>
              </div>
            </div>
          </div>

          <div className="v3-table-wrapper">
            <table className="v3-table">
              <thead>
                <tr>
                  <th className="v3-th">Risk</th>
                  <th className="v3-th">Asset</th>
                  <th className="v3-th">Category</th>
                  <th className="v3-th v3-th--right">Premium Due</th>
                  <th className="v3-th">Due Date</th>
                  <th className="v3-th v3-th--right">Total Claims</th>
                  <th className="v3-th">Loss Ratio</th>
                  <th className="v3-th" />
                </tr>
              </thead>
              <tbody>
                {tableRows.map(row => (
                  <tr
                    key={row.id}
                    className={`v3-tr ${hoveredRow === row.id ? 'v3-tr--hover' : ''} v3-tr--risk-${row.risk.toLowerCase()}`}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => navigate(`/financial/asset/${row.id}`)}
                  >
                    <td className="v3-td">
                      <RiskIcon lossRatio={row.lossRatio} />
                    </td>
                    <td className="v3-td v3-td--name">{row.name}</td>
                    <td className="v3-td">
                      <span className={`v3-category-badge ${row.category === 'Property' ? 'v3-category-badge--property' : 'v3-category-badge--auto'}`}>
                        {row.category === 'Property' ? <Building size={12} /> : <CarFront size={12} />}
                        {row.category}
                      </span>
                    </td>
                    <td className="v3-td v3-td--right v3-td--mono">{row.premiumDueFmt}</td>
                    <td className="v3-td v3-td--date">{row.dueDateFmt}</td>
                    <td className={`v3-td v3-td--right v3-td--mono ${row.rawClaims > 0 ? 'v3-td--claims' : 'v3-td--no-claims'}`}>
                      {row.rawClaims > 0 ? row.totalClaimsFmt : '—'}
                    </td>
                    <td className="v3-td v3-td--ratio">
                      <div className="v3-ratio-cell">
                        <span className="v3-ratio-pct">{row.lossRatio.toFixed(0)}%</span>
                        <div className="v3-ratio-track">
                          <div
                            className={`v3-ratio-fill-bar v3-ratio-fill-bar--${row.risk.toLowerCase()}`}
                            style={{ width: `${row.ratioPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="v3-td">
                      <button
                        className="v3-row-action"
                        onClick={e => { e.stopPropagation(); navigate(`/financial/asset/${row.id}`); }}
                        aria-label="View details"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
