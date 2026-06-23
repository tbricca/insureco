import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Column, ClickableTile, Heading, Tag } from '@carbon/react';
import { ArrowRight, ChartLine, ChartMultitype, Meter } from '@carbon/icons-react';
import './IfadGallery.scss';

const VARIANTS = [
  {
    path: '/ifad/conservative',
    name: 'Conservative',
    tag: 'Enterprise',
    icon: Meter,
    description:
      'A clean, standards-first Carbon layout. KPI tiles, a multi-series line chart, and a sortable ledger. Built for analysts who want clarity over flair.',
  },
  {
    path: '/ifad/mild',
    name: 'Mild',
    tag: 'Balanced',
    icon: ChartMultitype,
    description:
      'A more expressive take with accented KPI cards, a portfolio split visualization, and a switchable line/bar chart. A confident middle ground.',
  },
  {
    path: '/ifad/wild',
    name: 'Wild & Unique',
    tag: 'Bold',
    icon: ChartLine,
    description:
      'An immersive, high-impact dashboard with a gradient hero, animated metrics, and an unconventional asymmetric layout. Designed to make data feel alive.',
  },
];

/**
 * IfadGallery - Index page linking to the three IFAD dashboard concepts.
 */
export default function IfadGallery() {
  const navigate = useNavigate();

  return (
    <Grid fullWidth className="ifad-gallery">
      <Column lg={16} md={8} sm={4} className="ifad-gallery__header">
        <Heading className="ifad-gallery__title">Insurance Financial Analytics Dashboard</Heading>
        <p className="ifad-gallery__subtitle">
          Three design concepts built from the same PRD. Pick a direction to explore the full
          dashboard experience.
        </p>
      </Column>

      {VARIANTS.map((v) => {
        const Icon = v.icon;
        return (
          <Column key={v.path} lg={5} md={4} sm={4}>
            <ClickableTile className="ifad-gallery__card" onClick={() => navigate(v.path)}>
              <div className="ifad-gallery__card-top">
                <span className="ifad-gallery__card-icon">
                  <Icon size={24} />
                </span>
                <Tag type="cool-gray" size="sm">{v.tag}</Tag>
              </div>
              <h3 className="ifad-gallery__card-name">{v.name}</h3>
              <p className="ifad-gallery__card-desc">{v.description}</p>
              <span className="ifad-gallery__card-link">
                View dashboard <ArrowRight size={16} />
              </span>
            </ClickableTile>
          </Column>
        );
      })}
    </Grid>
  );
}
