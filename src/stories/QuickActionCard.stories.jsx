import React from 'react';
import { DocumentBlank, Task, Wallet, Certificate, Help } from '@carbon/icons-react';
import QuickActionCard from '../components/QuickActionCard';

export default {
  title: 'Components/QuickActionCard',
  component: QuickActionCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A clickable card used for primary quick-action navigation on dashboard views. Each card has a branded red icon container, a title, a short description, and a trailing arrow. Fully theme-aware — works in both light and dark modes.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    href: { control: 'text' },
  },
};

export const Default = {
  args: {
    title: 'View',
    description: 'Manage your active insurance policies',
    icon: DocumentBlank,
  },
};

export const FileClaim = {
  args: {
    title: 'File a Claim',
    description: 'Submit a new insurance claim',
    icon: Task,
  },
};

export const MakePayment = {
  args: {
    title: 'Make a Payment',
    description: 'Pay your premium or view billing',
    icon: Wallet,
  },
};

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
    <QuickActionCard
      icon={DocumentBlank}
      title="View Policies"
      description="Manage your active insurance policies"
    />
    <QuickActionCard
      icon={Task}
      title="File a Claim"
      description="Submit a new insurance claim"
    />
    <QuickActionCard
      icon={Wallet}
      title="Make a Payment"
      description="Pay your premium or view billing"
    />
    <QuickActionCard
      icon={Certificate}
      title="Digital ID Cards"
      description="Access your digital insurance cards"
    />
    <QuickActionCard
      icon={Help}
      title="Get Support"
      description="Contact our support team for help"
    />
  </div>
);

AllVariants.parameters = {
  docs: {
    description: {
      story: 'All common quick-action card variants shown together as they appear on the dashboard.',
    },
  },
};
