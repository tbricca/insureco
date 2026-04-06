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
import { ArrowRight, ChartBar, DataTable as DataTableIcon } from '@carbon/icons-react';
import {
  BarChart,
  Bar,
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
import './FinancialDashboardV1.scss';

const NET_ADJUSTMENT = 0.88; // 12% deduction for net values

const headers = [
  { key: 'name', header: 'Asset Name' },
  { key: 'category', header: 'Category' },
  { key: 'premiumDue', header: 'Premium Due' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'totalClaims', header: 'Total Claims' },
  { key: 'actions', header: '' },
];

export default function FinancialDashboardV1() {
  const navigate = useNavigate();
  const [valueMode, setValueMode] = useState('gross'); // 'gross' | 'net'
  const [sortKey, setSortKey] = useState('totalClaims');
  const [sortDir, setSortDir] = useState('DESC');
  const [searchQuery, setSearchQuery] = useState('');

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
      .filter(a => searchQuery === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(a => ({
        id: a.id,
        name: a.name,
        category: a.category,
        premiumDue: formatCurrencyFull(a.premiumDue * multiplier),
        dueDate: formatDate(a.dueDate),
        totalClaims: formatCurrencyFull(a.totalClaims * multiplier),
        _rawTotalClaims: a.totalClaims * multiplier,
        _rawDueDate: a.dueDate,
      }));

    rows.sort((a, b) => {
      if (sortKey === 'totalClaims') {
        return sortDir === 'DESC'
          ? b._rawTotalClaims - a._rawTotalClaims
          : a._rawTotalClaims - b._rawTotalClaims;
      }
      if (sortKey === 'dueDate') {
        return sortDir === 'ASC'
          ? a._rawDueDate.localeCompare(b._rawDueDate)
          : b._rawDueDate.localeCompare(a._rawDueDate);
      }
      return 0;
    });

    return rows;
  }, [multiplier, sortKey, sortDir, searchQuery]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortKey(key);
      setSortDir('DESC');
    }
  };

  const tooltipFormatter = (value) => formatTooltipCurrency(value);

  return (
    <div className="v1-dashboard">
      <Grid fullWidth>
        {/* Page Header */}
        <Column lg={10} md={6} sm={4} className="v1-page-header">
          <p className="v1-page-label">INSURANCE FINANCIAL ANALYTICS</p>
          <Heading className="v1-page-title">Financial Dashboard</Heading>
          <p className="v1-page-subtitle">Year-to-Date Portfolio Overview — FY 2024</p>
        </Column>
        <Column lg={6} md={2} sm={4} className="v1-header-controls">
          <ContentSwitcher
            onChange={({ name }) => setValueMode(name)}
            selectedIndex={valueMode === 'gross' ? 0 : 1}
            size="md"
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
        </Column>

        {/* KPI Cards */}
        <Column lg={4} md={4} sm={4}>
          <Tile className="v1-kpi-tile">
            <p className="v1-kpi-label">Total Owed (YTD)</p>
            <p className="v1-kpi-value">{formatLargeCurrency(kpi.totalOwed)}</p>
            <div className="v1-kpi-split">
              <span>Property: {formatLargeCurrency(kpi.propertyOwed)}</span>
              <span>Auto: {formatLargeCurrency(kpi.autoOwed)}</span>
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="v1-kpi-tile v1-kpi-tile--claims">
            <p className="v1-kpi-label">Total Claimed (YTD)</p>
            <p className="v1-kpi-value">{formatLargeCurrency(kpi.totalClaimed)}</p>
            <div className="v1-kpi-split">
              <span>Property: {formatLargeCurrency(kpi.propertyClaimed)}</span>
              <span>Auto: {formatLargeCurrency(kpi.autoClaimed)}</span>
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="v1-kpi-tile v1-kpi-tile--property">
            <p className="v1-kpi-label">Property Portfolio</p>
            <p className="v1-kpi-value">{formatLargeCurrency(kpi.propertyOwed)}</p>
            <div className="v1-kpi-split">
              <span>Claims: {formatLargeCurrency(kpi.propertyClaimed)}</span>
              <span>Loss: {kpiSummary.lossRatioProperty}%</span>
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="v1-kpi-tile v1-kpi-tile--auto">
            <p className="v1-kpi-label">Auto Portfolio</p>
            <p className="v1-kpi-value">{formatLargeCurrency(kpi.autoOwed)}</p>
            <div className="v1-kpi-split">
              <span>Claims: {formatLargeCurrency(kpi.autoClaimed)}</span>
              <span>Loss: {kpiSummary.lossRatioAuto}%</span>
            </div>
          </Tile>
        </Column>

        {/* Chart Section */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="v1-chart-tile">
            <div className="v1-section-header">
              <ChartBar size={20} />
              <Heading className="v1-section-title">Expense Visualization — 2024 Monthly Trends</Heading>
            </div>
            <p className="v1-chart-subtitle">
              Premium collections vs. claim payouts across Auto and Property sectors
            </p>
            <div className="v1-chart-container">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={chartData} margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis tickFormatter={formatYAxisTick} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={70} />
                  <Tooltip
                    formatter={tooltipFormatter}
                    contentStyle={{
                      background: 'var(--background-primary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                  <Bar dataKey="propertyPremiums" name="Property Premiums" fill="#198038" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="propertyClaims" name="Property Claims" fill="#da1e28" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="autoPremiums" name="Auto Premiums" fill="#24a148" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="autoClaims" name="Auto Claims" fill="#fa4d56" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Tile>
        </Column>

        {/* Asset Performance Ledger */}
        <Column lg={16} md={8} sm={4}>
          <Tile className="v1-table-tile">
            <div className="v1-section-header">
              <DataTableIcon size={20} />
              <Heading className="v1-section-title">Asset Performance Ledger</Heading>
            </div>

            <div className="v1-sort-controls">
              <span className="v1-sort-label">Sort by:</span>
              <Button
                size="sm"
                kind={sortKey === 'totalClaims' ? 'primary' : 'ghost'}
                onClick={() => handleSort('totalClaims')}
              >
                Highest Claims {sortKey === 'totalClaims' ? (sortDir === 'DESC' ? '↓' : '↑') : ''}
              </Button>
              <Button
                size="sm"
                kind={sortKey === 'dueDate' ? 'primary' : 'ghost'}
                onClick={() => handleSort('dueDate')}
              >
                Due Date {sortKey === 'dueDate' ? (sortDir === 'ASC' ? '↑' : '↓') : ''}
              </Button>
            </div>

            <DataTable
              rows={tableRows}
              headers={headers}
              isSortable={false}
            >
              {({ rows, headers: hdrs, getHeaderProps, getTableProps, getToolbarProps }) => (
                <TableContainer>
                  <TableToolbar {...getToolbarProps()}>
                    <TableToolbarContent>
                      <TableToolbarSearch
                        placeholder="Search assets..."
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
                          className="v1-table-row"
                          onClick={() => navigate(`/financial/asset/${row.id}`)}
                        >
                          {row.cells.map(cell => (
                            <TableCell key={cell.id}>
                              {cell.info.header === 'category' ? (
                                <Tag type={cell.value === 'Property' ? 'teal' : 'blue'} size="sm">
                                  {cell.value}
                                </Tag>
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
