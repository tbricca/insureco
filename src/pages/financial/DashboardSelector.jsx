import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Column, Heading, Button } from '@carbon/react';
import { ArrowRight, Analytics } from '@carbon/icons-react';
import './DashboardSelector.scss';

const VERSIONS = [
  {
    version: 'v1',
    label: 'Version 1',
    name: 'Conservative',
    tagline: 'Clean, minimal, corporate',
    description:
      'A traditional financial dashboard built entirely with Carbon Design System standards. Grouped bar charts, standard data tables, and a Gross/Net toggle. Ideal for environments where clarity and familiarity take priority.',
    features: ['Grouped bar chart', 'Carbon DataTable', 'Gross / Net switcher', 'Sort by claims or due date'],
    accent: '#525252',
    badge: 'Classic',
    chartPreview: [40, 30, 55, 35, 60, 45, 50, 40, 65, 55, 45, 60],
    claimsPreview: [20, 15, 10, 25, 12, 35, 8, 20, 15, 30, 10, 22],
  },
  {
    version: 'v2',
    label: 'Version 2',
    name: 'Mild',
    tagline: 'Modern, informative, balanced',
    description:
      'Adds color-coded KPI cards, loss ratio meters, and an interactive line chart where you can toggle each series on and off. Category filters let you narrow the asset ledger by Property or Auto.',
    features: ['Interactive line chart', 'Series toggle controls', 'Loss ratio meters', 'Category filters + risk badges'],
    accent: '#0f62fe',
    badge: 'Recommended',
    chartPreview: [40, 30, 55, 35, 60, 45, 50, 40, 65, 55, 45, 60],
    claimsPreview: [20, 15, 10, 25, 12, 35, 8, 20, 15, 30, 10, 22],
  },
  {
    version: 'v3',
    label: 'Version 3',
    name: 'Wild',
    tagline: 'Bold, data-forward, dramatic',
    description:
      'A visually striking layout with a dark hero KPI section, gradient-filled area charts, and an inline loss-ratio progress bar in every table row. Risk icons (Low / Medium / High) give instant at-a-glance status.',
    features: ['Dark hero KPI header', 'Gradient area chart', 'Inline loss ratio bars', 'Risk-level icons per row'],
    accent: '#da1e28',
    badge: 'Striking',
    chartPreview: [40, 30, 55, 35, 60, 45, 50, 40, 65, 55, 45, 60],
    claimsPreview: [20, 15, 10, 25, 12, 35, 8, 20, 15, 30, 10, 22],
  },
];

function MiniChart({ premium, claims, color }) {
  const max = Math.max(...premium, ...claims);
  const w = 220;
  const h = 60;
  const pad = 8;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;
  const n = premium.length;

  const toX = i => pad + (i / (n - 1)) * chartW;
  const toY = (v) => pad + chartH - (v / max) * chartH;

  const polyPremium = premium.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const polyClaims = claims.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

  const areaFill = [
    ...premium.map((v, i) => `${toX(i)},${toY(v)}`),
    `${toX(n - 1)},${pad + chartH}`,
    `${toX(0)},${pad + chartH}`,
  ].join(' ');

  return (
    <svg width={w} height={h} className="selector-mini-chart" viewBox={`0 0 ${w} ${h}`}>
      <polygon points={areaFill} fill={color} opacity="0.12" />
      <polyline points={polyPremium} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <polyline points={polyClaims} fill="none" stroke="#da1e28" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 2" />
    </svg>
  );
}

export default function DashboardSelector() {
  const navigate = useNavigate();

  return (
    <div className="selector-page">
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4} className="selector-hero">
          <div className="selector-hero-icon">
            <Analytics size={32} />
          </div>
          <Heading className="selector-title">
            Insurance Financial Analytics Dashboard
          </Heading>
          <p className="selector-subtitle">
            IFAD — Choose your dashboard style. All three show the same data — premium collections,
            claim payouts, and asset performance. Pick the visual approach that fits your workflow.
          </p>
        </Column>

        {VERSIONS.map(v => (
          <Column key={v.version} lg={5} md={4} sm={4} className="selector-col">
            <div
              className="selector-card"
              style={{ '--card-accent': v.accent }}
              onClick={() => navigate(`/financial/${v.version}`)}
            >
              <div className="selector-card-top">
                <div className="selector-card-labels">
                  <span className="selector-version-label">{v.label}</span>
                  <span className="selector-badge">{v.badge}</span>
                </div>
                <h3 className="selector-card-name">{v.name}</h3>
                <p className="selector-tagline">{v.tagline}</p>
              </div>

              <div className="selector-preview">
                <MiniChart
                  premium={v.chartPreview}
                  claims={v.claimsPreview}
                  color={v.accent}
                />
                <div className="selector-preview-rows">
                  {[
                    { label: 'Manufacturing Plant', ratio: 65 },
                    { label: '2020 Freightliner', ratio: 42 },
                    { label: 'Hotel Downtown', ratio: 18 },
                  ].map((row, i) => (
                    <div key={i} className="selector-preview-row">
                      <span className="selector-preview-name">{row.label}</span>
                      <div className="selector-preview-bar-track">
                        <div
                          className="selector-preview-bar-fill"
                          style={{ width: `${row.ratio}%`, background: v.accent }}
                        />
                      </div>
                      <span className="selector-preview-pct">{row.ratio}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="selector-description">{v.description}</p>

              <ul className="selector-features">
                {v.features.map(f => (
                  <li key={f} className="selector-feature">
                    <span className="selector-feature-dot" style={{ background: v.accent }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                kind="primary"
                renderIcon={ArrowRight}
                className="selector-launch-btn"
                style={{ background: v.accent, borderColor: v.accent }}
                onClick={(e) => { e.stopPropagation(); navigate(`/financial/${v.version}`); }}
              >
                Launch {v.name}
              </Button>
            </div>
          </Column>
        ))}

        <Column lg={1} md={0} sm={0} /> {/* spacer */}
      </Grid>
    </div>
  );
}
