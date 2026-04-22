import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import StepBreadcrumb from '../../components/StepBreadcrumb';

vi.mock('@carbon/icons-react', () => ({
  Checkmark: ({ className }) => <span data-testid="icon-checkmark" className={className} />,
}));

const sampleSteps = [
  { label: 'Personal Info', key: 'personal' },
  { label: 'Address', key: 'address' },
  { label: 'Review', key: 'review' },
];

describe('StepBreadcrumb', () => {
  it('renders a label for each step', () => {
    render(<StepBreadcrumb steps={sampleSteps} currentIndex={0} />);
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows step numbers for the current and upcoming steps', () => {
    render(<StepBreadcrumb steps={sampleSteps} currentIndex={1} />);
    // Index 1 (current) → number 2; index 2 (incomplete) → number 3
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows a checkmark icon for completed steps', () => {
    render(<StepBreadcrumb steps={sampleSteps} currentIndex={1} />);
    // Step at index 0 is complete when currentIndex is 1
    expect(screen.getByTestId('icon-checkmark')).toBeInTheDocument();
  });

  it('shows checkmarks for all steps before the current index', () => {
    render(<StepBreadcrumb steps={sampleSteps} currentIndex={2} />);
    expect(screen.getAllByTestId('icon-checkmark')).toHaveLength(2);
  });

  it('applies the --current class to the active step', () => {
    const { container } = render(<StepBreadcrumb steps={sampleSteps} currentIndex={1} />);
    const items = container.querySelectorAll('.step-breadcrumb__item');
    expect(items[1]).toHaveClass('step-breadcrumb__item--current');
  });

  it('applies the --complete class to steps before the current index', () => {
    const { container } = render(<StepBreadcrumb steps={sampleSteps} currentIndex={2} />);
    const items = container.querySelectorAll('.step-breadcrumb__item');
    expect(items[0]).toHaveClass('step-breadcrumb__item--complete');
    expect(items[1]).toHaveClass('step-breadcrumb__item--complete');
  });

  it('applies the --incomplete class to steps after the current index', () => {
    const { container } = render(<StepBreadcrumb steps={sampleSteps} currentIndex={0} />);
    const items = container.querySelectorAll('.step-breadcrumb__item');
    expect(items[1]).toHaveClass('step-breadcrumb__item--incomplete');
    expect(items[2]).toHaveClass('step-breadcrumb__item--incomplete');
  });

  it('renders connector lines between steps but not after the last step', () => {
    const { container } = render(<StepBreadcrumb steps={sampleSteps} currentIndex={0} />);
    const lines = container.querySelectorAll('.step-breadcrumb__line');
    // 3 steps → 2 connector lines
    expect(lines).toHaveLength(sampleSteps.length - 1);
  });

  it('adds --equal class to the wrapper when spaceEqually is true', () => {
    const { container } = render(
      <StepBreadcrumb steps={sampleSteps} currentIndex={0} spaceEqually={true} />
    );
    expect(container.firstChild).toHaveClass('step-breadcrumb--equal');
  });

  it('omits --equal class when spaceEqually is false', () => {
    const { container } = render(
      <StepBreadcrumb steps={sampleSteps} currentIndex={0} spaceEqually={false} />
    );
    expect(container.firstChild).not.toHaveClass('step-breadcrumb--equal');
  });
});
