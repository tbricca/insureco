import React from 'react';
import { Button } from '@carbon/react';
import { Add, TrashCan, Download, Rocket } from '@carbon/icons-react';
import FlashyButton from './FlashyButton';

export default {
  title: 'Components/Button',
  component: Button,
};

export const ButtonKinds = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
    <h3>Button Kinds</h3>
    
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button kind="primary">Primary</Button>
      <Button kind="secondary">Secondary</Button>
      <Button kind="tertiary">Tertiary</Button>
      <Button kind="ghost">Ghost</Button>
      <Button kind="danger">Danger</Button>
    </div>
  </div>
);

export const ButtonSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
    <h3>Button Sizes</h3>
    
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="2xl">2XL</Button>
    </div>
  </div>
);

export const ButtonsWithIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
    <h3>Buttons with Icons</h3>
    
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button kind="primary" renderIcon={Add}>
        Add Item
      </Button>
      <Button kind="danger" renderIcon={TrashCan}>
        Delete
      </Button>
      <Button kind="secondary" renderIcon={Download}>
        Download
      </Button>
    </div>
  </div>
);

export const IconOnlyButtons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
    <h3>Icon-Only Buttons</h3>
    
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button 
        kind="primary" 
        renderIcon={Add} 
        iconDescription="Add" 
        hasIconOnly 
      />
      <Button 
        kind="danger" 
        renderIcon={TrashCan} 
        iconDescription="Delete" 
        hasIconOnly 
      />
      <Button 
        kind="ghost" 
        renderIcon={Download} 
        iconDescription="Download" 
        hasIconOnly 
      />
    </div>
  </div>
);

export const DisabledButtons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
    <h3>Disabled State</h3>
    
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button kind="primary" disabled>Primary Disabled</Button>
      <Button kind="secondary" disabled>Secondary Disabled</Button>
      <Button kind="tertiary" disabled>Tertiary Disabled</Button>
    </div>
  </div>
);

export const Flashy = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
    <h3>Flashy Button</h3>
    <p>Animated gradient, shimmer sweep on hover, and a soft glow halo.</p>

    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <FlashyButton>Get Started</FlashyButton>
      <FlashyButton icon={Rocket}>Launch Now</FlashyButton>
    </div>
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
    <h2>Carbon Button Component</h2>
    <p>All button variants automatically adapt to the current theme.</p>

    <ButtonKinds />
    <ButtonSizes />
    <ButtonsWithIcons />
    <IconOnlyButtons />
    <DisabledButtons />
    <Flashy />
  </div>
);
