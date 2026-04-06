import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Heading,
  ContentSwitcher,
  Switch,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Button,
} from '@carbon/react';
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Building,
  CarFront,
} from '@carbon/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
} from '../../data/financialDashboardData';
import './FinancialDashboardV2.scss';

const NET_ADJUSTMENT = 0.88;

const SERIES_CONFIG = [
  { key: 'propertyPremiums', label: 'Property Premiums', color: '#198038', dashed: false },
  { key: 'propertyClaims',   label: 'Property Claims',   color: '#da1e28', dashed: true  },
  { key: 'autoPremiums',     label: 'Auto Premiums',     color: '#0f62fe', dashed: false },
  { key: 'autoClaims',       label: 'Auto Claims',       color: '#fa4d56', dashed: true  },
];

const headers = [
  { key: 'name',        header: 'Asset' },
  { key: 'category',    header: 'Category' },
  { key: 'premiumDue',  header: 'Premium Due' },
  { key: 'dueDate',     header: 'Due Date' },
  { key: 'totalClaims', header: 'Lifetime Claims' },
  { key: 'lossRatio',   header: 'Loss Ratio' },
  { key: 'actions',     header: '' },
];

function TrendBadge({ value, label }) {
  const isPositive = value > 0;
  return (
    <span className={`v2-trend-badge ${isPositive ? 'v2-trend-badge--up' : 'v2-trend-badge--down'}`}>
      {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      {Math.abs(value)}% {label}
    </span>
  );
}

function KpiCard({ label, value, subValue, trend, trendLabel, accentClass, icon: Icon }) {
  return (
    <Tile className={`v2-kpi-card ${accentClass}`}>
      <div className="v2-kpi-card-header">
        <div className="v2-kpi-icon">
          <Icon size={20} />
        </div>
        <TrendBadge value={trend} label={trendLabel} />
      </div>
      <p className="v2-kpi-label">{label}</p>
      <p className="v2-kpi-value">{value}</p>
      <p className="v2-kpi-sub">{subValue}</p>
    </Tile>
  );
}

export default function FinancialDashboardV2() {
  const navigate = useNavigate();
  const [valueMode, setValueMode] = useState('gross');
  const [activeSeries, setActiveSeries] = useState({
    propertyPremiums: true,
    propertyClaims: true,
    autoPremiums: true,
    autoClaims: true,
  });
  const [sortKey, setSortKey] = useState('totalClaims');
  const [sortDir, setSortDir] = useState('DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const multiplier = valueMode === 'net' ? NET_ADJUSTMENT : 1;

  const kpi = useMemo(() => ({
    totalOwed: kpiSummary.totalOwedYTD * multiplier,
    totalClaimed: kpiSummary.totalClaimedYTD * multiplier,
    propertyOwed: kpiSummary.propertyOwedYTD * multiplier,
    propertyClaimed: kpiSummary.propertyClaimedYTD * multiplier,
    autoOwed: kpiSummary.autoOwedYTD * multiplier,
    autoClaimed: kpiSummary.autoClaimedYTD * multiplier,
  }), [multiplier]);

  const chartData = useMemo(() =>
    monthlyChartData.map(d => ({
      ...d,
      propertyPremiums: Math.round(d.propertyPremiums * multiplier),
      propertyClaims: Math.round(d.propertyClaims * multiplier),
      autoPremiums: Math.round(d.autoPremiums * multiplier),
      autoClaims: Math.round(d.autoClaims * multiplier),
    })),
    [multiplier]
  );

  const tableRows = useMemo(() => {
    let rows = assetLedger
      .filter(a => {
        const matchSearch = searchQuery === '' ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === 'all' ||
          (categoryFilter === 'property' && a.category === 'Property') ||
          (categoryFilter === 'auto' && a.category === 'Auto');
        return matchSearch && matchCategory;
      })
      .map(a => ({
        id: a.id,
        name: a.name,
        category: a.category,
        premiumDue: formatCurrencyFull(a.premiumDue * multiplier),
        dueDate: formatDate(a.dueDate),
        totalClaims: formatCurrencyFull(a.totalClaims * multiplier),
        lossRatio: `${a.lossRatio.toFixed(0)}%`,
        _rawClaims: a.totalClaims * multiplier,
        _rawDate: a.dueDate,
        _rawRatio: a.lossRatio,
      }));

    rows.sort((a, b) => {
      if (sortKey === 'totalClaims') {
        return sortDir === 'DESC' ? b._rawClaims - a._rawClaims : a._rawClaims - b._rawClaims;
      }
      if (sortKey === 'dueDate') {
        return sortDir === 'ASC'
          ? a._rawDate.localeCompare(b._rawDate)
          : b._rawDate.localeCompare(a._rawDate);
      }
      return 0;
    });

    return rows;
  }, [multiplier, sortKey, sortDir, searchQuery, categoryFilter]);

  const toggleSeries = (key) => {
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getLossRatioClass = (ratio) => {
    const val = parseFloat(ratio);
    if (val >= 60) return 'v2-ratio--high';
    if (val >= 35) return 'v2-ratio--medium';
    return 'v2-ratio--low';
  };

  return (
    <div className="v2-dashboard">
      <Grid fullWidth>
        {/* Header */}
        <Column lg={8} md={5} sm={4} className="v2-page-header">
          <p className="v2-page-eyebrow">Insurance Financial Analytics Dashboard</p>
          <Heading className="v2-page-title">Portfolio Overview</Heading>
          <p className="v2-page-subtitle">FY 2024 — All sectors, year-to-date performance</p>
        </Column>
        <Column lg={8} md={3} sm={4} className="v2-header-right">
          <div className="v2-mode-switcher">
            <span className="v2-mode-label">Viewing:</span>
            <ContentSwitcher
              onChange={({ name }) => setValueMode(name)}
              selectedIndex={valueMode === 'gross' ? 0 : 1}
              size="sm"
            >
              <Switch name="gross" text="Gross" />
              <Switch name="net" text="Net" />
            </ContentSwitcher>
          </div>
        </Column>

        {/* KPI Cards */}
        <Column lg={4} md={4} sm={4}>
          <Tile className="v2-kpi-card v2-kpi-card--premium-total">
            <p className="v2-kpi-label">Total Owed YTD</p>
            <p className="v2-kpi-value">{formatLargeCurrency(kpi.totalOwed)}</p>
            <div className="v2-kpi-breakdown">
              <span className="v2-breakdown-item v2-breakdown-property">
                <Building size={12} />
                {formatLargeCurrency(kpi.propertyOwed)} Property
              </span>
              <span className="v2-breakdown-item v2-breakdown-auto">
                <CarFront size={12} />
                {formatLargeCurrency(kpi.autoOwed)} Auto
              </span>
            </div>
            <div className="v2-kpi-badge v2-kpi-badge--green">
              <ArrowUp size={12} /> Premiums
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="v2-kpi-card v2-kpi-card--claims-total">
            <p className="v2-kpi-label">Total Claimed YTD</p>
            <p className="v2-kpi-value v2-kpi-value--red">{formatLargeCurrency(kpi.totalClaimed)}</p>
            <div className="v2-kpi-breakdown">
              <span className="v2-breakdown-item v2-breakdown-property-claims">
                <Building size={12} />
                {formatLargeCurrency(kpi.propertyClaimed)} Property
              </span>
              <span className="v2-breakdown-item v2-breakdown-auto-claims">
                <CarFront size={12} />
                {formatLargeCurrency(kpi.autoClaimed)} Auto
              </span>
            </div>
            <div className="v2-kpi-badge v2-kpi-badge--red">
              <ArrowDown size={12} /> Claims
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="v2-kpi-card v2-kpi-card--property">
            <p className="v2-kpi-label">Property Loss Ratio</p>
            <p className="v2-kpi-value">{kpiSummary.lossRatioProperty}%</p>
            <div className="v2-loss-bar-wrapper">
              <div
                className="v2-loss-bar"
                style={{ width: `${Math.min(parseFloat(kpiSummary.lossRatioProperty), 100)}%` }}
              />
            </div>
            <p className="v2-kpi-sub-detail">
              {formatLargeCurrency(kpi.propertyClaimed)} claimed of {formatLargeCurrency(kpi.propertyOwed)} owed
            </p>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="v2-kpi-card v2-kpi-card--auto">
            <p className="v2-kpi-label">Auto Loss Ratio</p>
            <p className="v2-kpi-value">{kpiSummary.lossRatioAuto}%</p>
            <div className="v2-loss-bar-wrapper">
              <div
                className="v2-loss-bar v2-loss-bar--auto"
                style={{ width: `${Math.min(parseFloat(kpiSummary.lossRatioAuto), 100)}%` }}
              />
            </div>
            <p className="v2-kpi-sub-detail">
              {formatLargeCurrency(kpi.autoClaimed)} claimed of {formatLargeCurrency(kpi.autoOwed)} owed
            </p>
          </Tile>
        </Column>

        {/* Chart */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="v2-chart-tile">
            <div className="v2-chart-header">
              <div>
                <Heading className="v2-chart-title">Expense Visualization</Heading>
                <p className="v2-chart-desc">Monthly premium collections vs. claim payouts — toggle series to compare</p>
              </div>
            </div>

            <div className="v2-series-toggles">
              {SERIES_CONFIG.map(s => (
                <button
                  key={s.key}
                  className={`v2-series-toggle ${activeSeries[s.key] ? 'v2-series-toggle--active' : ''}`}
                  style={{ '--series-color': s.color }}
                  onClick={() => toggleSeries(s.key)}
                >
                  <span className="v2-series-dot" style={{ background: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>

            <div className="v2-chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis tickFormatter={formatYAxisTick} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={72} />
                  <Tooltip
                    formatter={formatTooltipCurrency}
                    contentStyle={{
                      background: 'var(--background-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  {SERIES_CONFIG.map(s => activeSeries[s.key] && (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.label}
                      stroke={s.color}
                      strokeWidth={2}
                      strokeDasharray={s.dashed ? '6 3' : undefined}
                      dot={{ r: 3, fill: s.color }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Tile>
        </Column>

        {/* Asset Ledger */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="v2-table-tile">
            <div className="v2-table-header">
              <div>
                <Heading className="v2-table-title">Asset Performance Ledger</Heading>
                <p className="v2-table-desc">Click any row to view full claim history and policy details</p>
              </div>
              <div className="v2-category-filters">
                {['all', 'property', 'auto'].map(f => (
                  <button
                    key={f}
                    className={`v2-filter-btn ${categoryFilter === f ? 'v2-filter-btn--active' : ''}`}
                    onClick={() => setCategoryFilter(f)}
                  >
                    {f === 'all' ? 'All Assets' : f === 'property' ? 'Property' : 'Auto'}
                  </button>
                ))}
              </div>
            </div>

            <div className="v2-sort-row">
              <span className="v2-sort-label">Sort:</span>
              <Button
                size="sm"
                kind={sortKey === 'totalClaims' ? 'primary' : 'ghost'}
                onClick={() => { setSortKey('totalClaims'); setSortDir(d => d === 'DESC' ? 'ASC' : 'DESC'); }}
              >
                Highest Claims {sortKey === 'totalClaims' ? (sortDir === 'DESC' ? '↓' : '↑') : ''}
              </Button>
              <Button
                size="sm"
                kind={sortKey === 'dueDate' ? 'primary' : 'ghost'}
                onClick={() => { setSortKey('dueDate'); setSortDir(d => d === 'ASC' ? 'DESC' : 'ASC'); }}
              >
                Due Date {sortKey === 'dueDate' ? (sortDir === 'ASC' ? '↑' : '↓') : ''}
              </Button>
            </div>

            <DataTable rows={tableRows} headers={headers} isSortable={false}>
              {({ rows, headers: hdrs, getHeaderProps, getTableProps, getToolbarProps }) => (
                <TableContainer>
                  <TableToolbar {...getToolbarProps()}>
                    <TableToolbarContent>
                      <TableToolbarSearch
                        placeholder="Search by name..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        persistent
                      />
                    </TableToolbarContent>
                  </TableToolbar>
                  <Table {...getTableProps()} size="lg">
                    <TableHead>
                      <TableRow>
                        {hdrs.map(h => (
                          <TableHeader key={h.key} {...getHeaderProps({ header: h })}>
                            {h.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(row => (
                        <TableRow
                          key={row.id}
                          className="v2-table-row"
                          onClick={() => navigate(`/financial/asset/${row.id}`)}
                        >
                          {row.cells.map(cell => (
                            <TableCell key={cell.id}>
                              {cell.info.header === 'category' ? (
                                <Tag
                                  type={cell.value === 'Property' ? 'teal' : 'blue'}
                                  size="sm"
                                  renderIcon={cell.value === 'Property' ? Building : CarFront}
                                >
                                  {cell.value}
                                </Tag>
                              ) : cell.info.header === 'lossRatio' ? (
                                <span className={`v2-ratio-badge ${getLossRatioClass(cell.value)}`}>
                                  {cell.value}
                                </span>
                              ) : cell.info.header === 'totalClaims' ? (
                                <span className="v2-claims-value">
                                  {cell.value === '$0' || cell.value === '$0.00' ? (
                                    <span className="v2-no-claims">None</span>
                                  ) : (
                                    <span className="v2-has-claims">{cell.value}</span>
                                  )}
                                </span>
                              ) : cell.info.header === 'actions' ? (
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  renderIcon={ArrowRight}
                                  hasIconOnly
                                  iconDescription="View Details"
                                  onClick={(e) => { e.stopPropagation(); navigate(`/financial/asset/${row.id}`); }}
                                />
                              ) : (
                                cell.value
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
