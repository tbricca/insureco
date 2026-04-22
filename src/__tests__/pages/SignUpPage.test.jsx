import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from '../../pages/SignUpPage';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock Carbon icons — they are SVG components that don't add test value
vi.mock('@carbon/icons-react', () => ({
  ArrowRight: () => <span />,
  ArrowLeft: () => <span />,
  Checkmark: () => <span />,
  Car: () => <span data-testid="icon-car" />,
  Home: () => <span data-testid="icon-home" />,
}));

// Mock useNavigate so we can assert navigation calls
const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

// jsdom doesn't implement window.scrollTo
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });

const renderSignUp = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <SignUpPage />
      </ThemeProvider>
    </MemoryRouter>
  );

// Helper: fill in all required step-1 fields
const fillPersonalInfo = async (user) => {
  await user.type(screen.getByLabelText(/first name/i), 'Jane');
  await user.type(screen.getByLabelText(/last name/i), 'Smith');
  await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
  await user.type(screen.getByLabelText(/phone number/i), '5551234567');
};

describe('SignUpPage — Step 1: Personal Information', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders all required personal information fields', () => {
    renderSignUp();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('shows the "Personal Information" heading', () => {
    renderSignUp();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('shows a Next button', () => {
    renderSignUp();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('Next button is disabled when required fields are empty', () => {
    renderSignUp();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('does not show a Back button on the first step', () => {
    renderSignUp();
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });
});

describe('SignUpPage — Step navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('advances to step 2 after filling personal info and clicking Next', async () => {
    const user = userEvent.setup();
    renderSignUp();

    await fillPersonalInfo(user);
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 2 is the Address step
    expect(screen.getByText('Your Address')).toBeInTheDocument();
  });

  it('shows a Back button on step 2', async () => {
    const user = userEvent.setup();
    renderSignUp();

    await fillPersonalInfo(user);
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('returns to step 1 when Back is clicked on step 2', async () => {
    const user = userEvent.setup();
    renderSignUp();

    await fillPersonalInfo(user);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('preserves field values when navigating back to step 1', async () => {
    const user = userEvent.setup();
    renderSignUp();

    await fillPersonalInfo(user);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Smith');
  });
});
