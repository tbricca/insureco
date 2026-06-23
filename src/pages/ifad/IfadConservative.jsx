import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Tile,
  Heading,
  Button,
  ContentSwitcher,
  Switch,
} from '@carbon/react';
import { ArrowLeft, Money, Receipt, ChartLineData, Percentage } from '@carbon/icons-react';
import IfadChart from '../../components/ifad/IfadChart';
import IfadLedger from '../../components/ifad/IfadLedger';
import {
  getFinancialSummary,
  getMonthlySeries,
  getAssetLedger,
} from '../../utils/financialAnalytics';
import { formatCurrency, formatPercentage } from '../../utils/businessHelpers';
import './IfadConservative.scss';

export default function IfadConservative() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('gross');

  const summary = useMemo(() => getFinancialSummary(mode), [mode]);
  const series = useMemo(() => getMonthlySeries(mode), [mode]);
  const ledger = useMemo(() => getAssetLedger(), []);

  const kpis = [
    { label: 'Total Owed (YTD)', value: formatCurrency(summary.totalOwed, false), icon: Money, tone: 'premium' },
    { label: 'Total Claimed (YTD)', value: formatCurrency(summary.totalClaimed, false), icon: Receipt, tone: 'claim' },
    { label: 'Net Position', value: formatCurrency(summary.netPosition, false), icon: ChartLineData, tone: 'neutral' },
    { label: 'Loss Ratio', value: formatPercentage(summary.lossRatio, 1), icon: Percentage, tone: 'neutral' },
  ];

  const splits = [
    { label: 'Property', owed: summary.propertyOwed, claimed: summary.propertyClaimed },
    { label: 'Auto', owed: summary.autoOwed, claimed: summary.autoClaimed },
  ];

  return (
    <Grid fullWidth className="ifad-conservative">
      <Column lg={16} md={8} sm={4} className="ifad-conservative__top">
        <Button
          kind="ghost"
          size="sm"
          renderIcon={ArrowLeft}
          onClick={() => navigate('/ifad')}
        >
          Back to Concepts
        </Button>
        <div className="ifad-conservative__heading-row">
          <div>
            <Heading className="ifad-conservative__title">Financial Analytics</Heading>
            <p className="ifad-conservative__subtitle">
              Premium collections and claim payouts across Auto and Property.
            </p>
          </div>
          <ContentSwitcher
            className="ifad-conservative__switcher"
            selectedIndex={mode === 'gross' ? 0 : 1}
            onChange={({ index }) => setMode(index === 0 ? 'gross' : 'net')}
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
        </div>
      </Column>

      {/* KPI widgets */}
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Column key={kpi.label} lg={4} md={4} sm={4}>
            <Tile className={`ifad-kpi ifad-kpi--${kpi.tone}`}>
              <div className="ifad-kpi__icon">
                <Icon size={20} />
              </div>
              <p className="ifad-kpi__label">{kpi.label}</p>
              <p className="ifad-kpi__value">{kpi.value}</p>
            </Tile>
          </Column>
        );
      })}

      {/* Portfolio split */}
      {splits.map((split) => (
        <Column key={split.label} lg={8} md={4} sm={4}>
          <Tile className="ifad-conservative__split">
            <h4 className="ifad-conservative__split-title">{split.label} Portfolio</h4>
            <div className="ifad-conservative__split-row">
              <div>
                <span className="ifad-conservative__split-label">Owed</span>
                <span className="ifad-conservative__split-value ifad-conservative__split-value--premium">
                  {formatCurrency(split.owed, false)}
                </span>
              </div>
              <div>
                <span className="ifad-conservative__split-label">Claimed</span>
                <span className="ifad-conservative__split-value ifad-conservative__split-value--claim">
                  {formatCurrency(split.claimed, false)}
                </span>
              </div>
            </div>
          </Tile>
        </Column>
      ))}

      {/* Chart */}
      <Column lg={16} md={8} sm={4}>
        <Tile className="ifad-conservative__panel">
          <Heading className="ifad-conservative__panel-title">Premiums vs. Claims History</Heading>
          <IfadChart data={series} type="line" />
        </Tile>
      </Column>

      {/* Ledger */}
      <Column lg={16} md={8} sm={4}>
        <Tile className="ifad-conservative__panel">
          <Heading className="ifad-conservative__panel-title">Asset Performance Ledger</Heading>
          <p className="ifad-conservative__panel-hint">
            Sort by Total Claims to find underperforming assets, or by Due Date for collections. Click a row for detail.
          </p>
          <IfadLedger assets={ledger} />
        </Tile>
      </Column>
    </Grid>
  );
}
