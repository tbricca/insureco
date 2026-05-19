import React from 'react';
import { Star } from '@carbon/icons-react';
import './FlashyButton.scss';

export default function FlashyButton({ children = 'Get Started', icon: Icon = Star, ...props }) {
  return (
    <button type="button" className="flashy-button" {...props}>
      <span className="flashy-icon">
        <Icon size={18} />
      </span>
      <span className="flashy-label">{children}</span>
    </button>
  );
}
