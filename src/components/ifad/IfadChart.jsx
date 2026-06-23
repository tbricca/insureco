import React, { useState } from 'react';
import { SERIES_META } from '../../utils/financialAnalytics';
import { formatCurrency } from '../../utils/businessHelpers';
import './IfadChart.scss';

/**
 * IfadChart - Custom SVG multi-series chart for the IFAD expense visualization.
 * Renders premiums and claims for Auto and Property over time. Series can be
 * toggled on/off via the legend and the chart supports line and bar rendering.
 *
 * @param {Array} data - Output of getMonthlySeries()
 * @param {'line'|'bar'} type - Chart rendering style
 */
export default function IfadChart({ data, type = 'line' }) {
  const [hidden, setHidden] = useState({});
  const [hover, setHover] = useState(null);

  const width = 720;
  const height = 320;
  const pad = { top: 24, right: 16, bottom: 36, left: 64 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const visibleSeries = SERIES_META.filter((s) => !hidden[s.key]);

  const maxValue = Math.max(
    1,
    ...data.flatMap((d) => visibleSeries.map((s) => d[s.key])),
  );
  // Round the axis ceiling up to a clean number.
  const niceMax = Math.ceil(maxValue / 5000) * 5000 || maxValue;

  const x = (i) => pad.left + (data.length <= 1 ? plotW / 2 : (plotW * i) / (data.length - 1));
  const y = (v) => pad.top + plotH - (plotH * v) / niceMax;

  const gridLines = 4;
  const ticks = Array.from({ length: gridLines + 1 }, (_, i) => (niceMax / gridLines) * i);

  const toggle = (key) => setHidden((prev) => ({ ...prev, [key]: !prev[key] }));

  // Bar geometry
  const groupW = plotW / data.length;
  const barW = Math.max(2, (groupW * 0.7) / Math.max(1, visibleSeries.length));

  return (
    <div className="ifad-chart">
      <div className="ifad-chart__legend" role="group" aria-label="Toggle data series">
        {SERIES_META.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`ifad-chart__legend-item${hidden[s.key] ? ' is-hidden' : ''}`}
            onClick={() => toggle(s.key)}
            aria-pressed={!hidden[s.key]}
          >
            <span className="ifad-chart__swatch" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>

      <div className="ifad-chart__canvas">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Premiums and claims over time"
        >
          {/* Y grid + axis labels */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                className="ifad-chart__grid"
                x1={pad.left}
                x2={width - pad.right}
                y1={y(t)}
                y2={y(t)}
              />
              <text className="ifad-chart__axis-label" x={pad.left - 10} y={y(t) + 4} textAnchor="end">
                ${Math.round(t / 1000)}k
              </text>
            </g>
          ))}

          {/* X labels */}
          {data.map((d, i) => (
            <text
              key={d.label}
              className="ifad-chart__axis-label"
              x={x(i)}
              y={height - pad.bottom + 20}
              textAnchor="middle"
            >
              {d.label}
            </text>
          ))}

          {/* Series */}
          {type === 'line'
            ? visibleSeries.map((s) => {
                const path = data
                  .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d[s.key])}`)
                  .join(' ');
                return (
                  <g key={s.key}>
                    <path className="ifad-chart__line" d={path} style={{ stroke: s.color }} />
                    {data.map((d, i) => (
                      <circle
                        key={i}
                        className="ifad-chart__dot"
                        cx={x(i)}
                        cy={y(d[s.key])}
                        r={3}
                        style={{ fill: s.color }}
                      />
                    ))}
                  </g>
                );
              })
            : data.map((d, i) =>
                visibleSeries.map((s, si) => {
                  const groupStart = pad.left + i * groupW + groupW * 0.15;
                  const bx = groupStart + si * barW;
                  const bh = (plotH * d[s.key]) / niceMax;
                  return (
                    <rect
                      key={`${s.key}-${i}`}
                      className="ifad-chart__bar"
                      x={bx}
                      y={pad.top + plotH - bh}
                      width={barW - 1}
                      height={bh}
                      style={{ fill: s.color }}
                    />
                  );
                }),
              )}

          {/* Hover overlay columns */}
          {data.map((d, i) => (
            <rect
              key={`hit-${i}`}
              x={x(i) - groupW / 2}
              y={pad.top}
              width={groupW}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>

        {hover !== null && (
          <div className="ifad-chart__tooltip">
            <p className="ifad-chart__tooltip-title">{data[hover].label}</p>
            {visibleSeries.map((s) => (
              <p key={s.key} className="ifad-chart__tooltip-row">
                <span className="ifad-chart__swatch" style={{ background: s.color }} />
                <span className="ifad-chart__tooltip-label">{s.label}</span>
                <span className="ifad-chart__tooltip-value">{formatCurrency(data[hover][s.key], false)}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
