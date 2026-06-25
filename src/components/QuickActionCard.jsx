import React from 'react';
import { ClickableTile } from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import './QuickActionCard.scss';

export default function QuickActionCard({ icon: Icon, title, description, href, onClick }) {
  return (
    <ClickableTile
      className="quick-action-card"
      href={href}
      onClick={onClick}
    >
      <div className="quick-action-card__icon">
        {Icon && <Icon size={32} />}
      </div>
      <div className="quick-action-card__content">
        <h4 className="quick-action-card__title">{title}</h4>
        <p className="quick-action-card__description">{description}</p>
      </div>
      <ArrowRight size={20} className="quick-action-card__arrow" />
    </ClickableTile>
  );
}
