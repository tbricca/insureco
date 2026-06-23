import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Column, Button, ContentSwitcher, Switch } from '@carbon/react';
import { ArrowLeft, ArrowRight, Fire, Activity } from '@carbon/icons-react';
import IfadChart from '../../components/ifad/IfadChart';
import IfadLedger from '../../components/ifad/IfadLedger';
import {
  getFinancialSummary,
  getMonthlySeries,
  getAssetLedger,
  getAssetDetailPath,
} from '../../utils/financialAnalytics';
import { formatCurrency, formatPercentage } from '../../utils/businessHelpers';
import './IfadWild.scss';

/**
 * Animated count-up that eases toward the target value whenever it changes.
 */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default function IfadWild() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('gross');

  const summary = useMemo(() => getFinancialSummary(mode), [mode]);
  const series = useMemo(() => getMonthlySeries(mode), [mode]);
  const ledger = useMemo(() => getAssetLedger(), []);

  const owed = useCountUp(summary.totalOwed);
  const claimed = useCountUp(summary.totalClaimed);

  const hottest = useMemo(
    () => [...ledger].sort((a, b) => b.totalClaims - a.totalClaims).slice(0, 3),
    [ledger],
  );

  return (
    <div className="ifad-wild">
      <div className="ifad-wild__hero">
        <div className="ifad-wild__hero-bar">
          <Button
            kind="ghost"
            size="sm"
            renderIcon={ArrowLeft}
            className="ifad-wild__back"
            onClick={() => navigate('/ifad')}
          >
            Back to Concepts
          </Button>
          <ContentSwitcher
            className="ifad-wild__switcher"
            selectedIndex={mode === 'gross' ? 0 : 1}
            onChange={({ index }) => setMode(index === 0 ? 'gross' : 'net')}
          >
            <Switch name="gross" text="Gross" />
            <Switch name="net" text="Net" />
          </ContentSwitcher>
        </div>

        <p className="ifad-wild__eyebrow">
          <Activity size={16} /> Live Portfolio · FY 2024
        </p>
        <h1 className="ifad-wild__hero-title">Insurance Financial Analytics</h1>

        <div className="ifad-wild__hero-metrics">
          <div className="ifad-wild__metric ifad-wild__metric--premium">
            <span className="ifad-wild__metric-label">Total Owed</span>
            <span className="ifad-wild__metric-value">{formatCurrency(owed, false)}</span>
          </div>
          <div className="ifad-wild__metric ifad-wild__metric--claim">
            <span className="ifad-wild__metric-label">Total Claimed</span>
            <span className="ifad-wild__metric-value">{formatCurrency(claimed, false)}</span>
          </div>
          <div className="ifad-wild__metric ifad-wild__metric--ratio">
            <span className="ifad-wild__metric-label">Loss Ratio</span>
            <span className="ifad-wild__metric-value">{formatPercentage(summary.lossRatio, 1)}</span>
          </div>
        </div>
      </div>

      <Grid fullWidth className="ifad-wild__body">
        {/* Hottest assets */}
        <Column lg={16} md={8} sm={4}>
          <div className="ifad-wild__section-head">
            <Fire size={20} />
            <h3>Highest-Claim Assets</h3>
          </div>
        </Column>
        {hottest.map((asset, i) => (
          <Column key={asset.id} lg={5} md={4} sm={4}>
            <button
              type="button"
              className="ifad-wild__hot-card"
              onClick={() => navigate(getAssetDetailPath(asset.id))}
            >
              <span className="ifad-wild__hot-rank">#{i + 1}</span>
              <span className="ifad-wild__hot-name">{asset.name}</span>
              <span className="ifad-wild__hot-category">{asset.category}</span>
              <span className="ifad-wild__hot-value">{formatCurrency(asset.totalClaims, false)}</span>
              <span className="ifad-wild__hot-link">
                Drill down <ArrowRight size={16} />
              </span>
            </button>
          </Column>
        ))}

        {/* Chart */}
        <Column lg={16} md={8} sm={4}>
          <div className="ifad-wild__glass">
            <h3 className="ifad-wild__glass-title">Premiums vs. Claims Trend</h3>
            <IfadChart data={series} type="bar" />
          </div>
        </Column>

        {/* Ledger */}
        <Column lg={16} md={8} sm={4}>
          <div className="ifad-wild__glass">
            <h3 className="ifad-wild__glass-title">Asset Performance Ledger</h3>
            <IfadLedger assets={ledger} />
          </div>
        </Column>
      </Grid>
    </div>
  );
}
