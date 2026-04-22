import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ThemeToggle from '../../components/ThemeToggle';
import { ThemeProvider } from '../../contexts/ThemeContext';

vi.mock('@carbon/icons-react', () => ({
  Asleep: () => <span data-testid="icon-moon" />,
  Light: () => <span data-testid="icon-sun" />,
}));

const renderInTheme = (initialTheme = 'white') => {
  localStorage.setItem('insureco-theme', initialTheme);
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the moon icon in light mode', () => {
    renderInTheme('white');
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
  });

  it('shows the sun icon in dark mode', () => {
    renderInTheme('g100');
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
  });

  it('has the correct aria-label in light mode', () => {
    renderInTheme('white');
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('has the correct aria-label in dark mode', () => {
    renderInTheme('g100');
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it('switches from light to dark when clicked', async () => {
    const user = userEvent.setup();
    renderInTheme('white');
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
  });

  it('switches from dark to light when clicked', async () => {
    const user = userEvent.setup();
    renderInTheme('g100');
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
  });

  it('persists the new theme to localStorage after toggle', async () => {
    const user = userEvent.setup();
    renderInTheme('white');
    await user.click(screen.getByRole('button'));
    expect(localStorage.getItem('insureco-theme')).toBe('g100');
  });
});
