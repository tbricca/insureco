import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Heading,
  Button,
  ContentSwitcher,
  Switch,
} from '@carbon/react';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  ChartLine,
  ChartBar,
} from '@carbon/icons-react';
import IfadChart from '../../components/ifad/IfadChart';
import IfadLedger from '../../components/ifad/IfadLedger';
import {
  getFinancialSummary,
  getMonthlySeries,
  getAssetLedger,
} from '../../utils/financialAnalytics';
import { formatCurrency, formatPercentage } from '../../utils/businessHelpers';
import './IfadMild.scss';

export default function IfadMild() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('gross');
  const [chartType, setChartType] = useState('line');

  const summary = useMemo(() => getFinancialSummary(mode), [mode]);
  const series = useMemo(() => getMonthlySeries(mode), [mode]);
  const ledger = useMemo(() => getAssetLedger(), []);

  const autoShare = summary.totalOwed > 0
    ? Math.round((summary.autoOwed / summary.totalOwed) * 100)
    : 0;
  const propertyShare = 100 - autoShare;

  const kpis = [
    {
      label: 'Total Owed',
      value: formatCurrency(summary.totalOwed, false),
      delta: '+4.2%',
      positive: true,
      accent: 'premium',
    },
    {
      label: 'Total Claimed',
      value: formatCurrency(summary.totalClaimed, false),
      delta: '+1.8%',
      positive: false,
      accent: 'claim',
    },
    {
      label: 'Net Position',
      value: formatCurrency(summary.netPosition, false),
      delta: '+6.0%',
      positive: true,
      accent: 'net',
    },
    {
      label: 'Loss Ratio',
      value: formatPercentage(summary.lossRatio, 1),
      delta: '-0.7%',
      positive: true,
      accent: 'ratio',
    },
  ];

  return (
    <Grid fullWidth className="ifad-mild">
      <Column lg={16} md={8} sm={4} className="ifad-mild__top">
        <Button kind="ghost" size="sm" renderIcon={ArrowLeft} onClick={() => navigate('/ifad')}>
          Back to Concepts
        </Button>
        <div className="ifad-mild__hero">
          <div>
            <p className="ifad-mild__eyebrow">Portfolio Pulse · FY 2024</p>
            <Heading className="ifad-mild__title">Financial Analytics Dashboard</Heading>
          </div>
          <ContentSwitcher
            className="ifad-mild__switcher"
            selectedIndex={mode === 'gross' ? 0 : 1}
            onChange={({ index }) => setMode(index === 0 ? 'gross' : 'net')}
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
        </div>
      </Column>

      {/* KPI cards */}
      {kpis.map((kpi) => (
        <Column key={kpi.label} lg={4} md={4} sm={4}>
          <div className={`ifad-mild__kpi ifad-mild__kpi--${kpi.accent}`}>
            <p className="ifad-mild__kpi-label">{kpi.label}</p>
            <p className="ifad-mild__kpi-value">{kpi.value}</p>
            <span className={`ifad-mild__kpi-delta${kpi.positive ? ' is-positive' : ' is-negative'}`}>
              {kpi.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {kpi.delta} vs last year
            </span>
          </div>
        </Column>
      ))}

      {/* Portfolio split donut */}
      <Column lg={5} md={8} sm={4}>
        <div className="ifad-mild__panel ifad-mild__split">
          <h4 className="ifad-mild__panel-title">Portfolio Split</h4>
          <div
            className="ifad-mild__donut"
            style={{
              background: `conic-gradient(var(--color-success) 0 ${propertyShare}%, var(--color-brand-blue-50) ${propertyShare}% 100%)`,
            }}
          >
            <div className="ifad-mild__donut-hole">
              <span className="ifad-mild__donut-total">{formatCurrency(summary.totalOwed, false)}</span>
              <span className="ifad-mild__donut-caption">Total Owed</span>
            </div>
          </div>
          <ul className="ifad-mild__legend">
            <li>
              <span className="ifad-mild__legend-dot ifad-mild__legend-dot--property" />
              Property <strong>{propertyShare}%</strong>
            </li>
            <li>
              <span className="ifad-mild__legend-dot ifad-mild__legend-dot--auto" />
              Auto <strong>{autoShare}%</strong>
            </li>
          </ul>
        </div>
      </Column>

      {/* Chart */}
      <Column lg={11} md={8} sm={4}>
        <div className="ifad-mild__panel">
          <div className="ifad-mild__panel-head">
            <h4 className="ifad-mild__panel-title">Premiums vs. Claims</h4>
            <ContentSwitcher
              className="ifad-mild__chart-toggle"
              size="sm"
              selectedIndex={chartType === 'line' ? 0 : 1}
              onChange={({ index }) => setChartType(index === 0 ? 'line' : 'bar')}
            >
              <Switch name="line" text="Line" renderIcon={ChartLine} />
              <Switch name="bar" text="Bar" renderIcon={ChartBar} />
            </ContentSwitcher>
          </div>
          <IfadChart data={series} type={chartType} />
        </div>
      </Column>

      {/* Ledger */}
      <Column lg={16} md={8} sm={4}>
        <div className="ifad-mild__panel">
          <h4 className="ifad-mild__panel-title">Asset Performance Ledger</h4>
          <IfadLedger assets={ledger} />
        </div>
      </Column>
    </Grid>
  );
}
