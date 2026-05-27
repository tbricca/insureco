import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextInput,
  Select,
  SelectItem,
  Form,
  Stack,
  Checkbox,
  RadioButtonGroup,
  RadioButton,
  Heading,
  NumberInput,
} from '@carbon/react';
import { ArrowRight, ArrowLeft, Checkmark } from '@carbon/icons-react';
import { Car, Home } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import './SignUpPage.scss';

const STEP_KEYS = {
  PERSONAL: 'personal',
  ADDRESS: 'address',
  INSURANCE_TYPE: 'insuranceType',
  CAR_DETAILS: 'carDetails',
  HOME_DETAILS: 'homeDetails',
  COVERAGE: 'coverage',
  REVIEW: 'review',
};

const BASE_STEPS = [
  { key: STEP_KEYS.PERSONAL, label: 'Personal Info' },
  { key: STEP_KEYS.ADDRESS, label: 'Address' },
  { key: STEP_KEYS.INSURANCE_TYPE, label: 'Insurance Type' },
  { key: STEP_KEYS.COVERAGE, label: 'Coverage' },
  { key: STEP_KEYS.REVIEW, label: 'Review' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1899 }, (_, i) => CURRENT_YEAR - i);

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  insuranceType: '',
  carMake: '',
  carModel: '',
  carYear: '',
  carVin: '',
  homeType: '',
  homeYear: '',
  homeSquareFeet: '',
  homeValue: '',
  coverageLevel: '',
  deductible: '',
  additionalCoverage: [],
};

function getVisibleSteps(insuranceType) {
  const steps = [
    { key: STEP_KEYS.PERSONAL, label: 'Personal Info' },
    { key: STEP_KEYS.ADDRESS, label: 'Address' },
    { key: STEP_KEYS.INSURANCE_TYPE, label: 'Insurance Type' },
  ];
  if (insuranceType === 'car' || insuranceType === 'both') {
    steps.push({ key: STEP_KEYS.CAR_DETAILS, label: 'Car Details' });
  }
  if (insuranceType === 'home' || insuranceType === 'both') {
    steps.push({ key: STEP_KEYS.HOME_DETAILS, label: 'Home Details' });
  }
  steps.push(
    { key: STEP_KEYS.COVERAGE, label: 'Coverage' },
    { key: STEP_KEYS.REVIEW, label: 'Review' }
  );
  return steps;
}

function isStepValid(stepKey, formData) {
  switch (stepKey) {
    case STEP_KEYS.PERSONAL:
      return formData.firstName && formData.lastName && formData.email && formData.phone;
    case STEP_KEYS.ADDRESS:
      return formData.streetAddress && formData.city && formData.state && formData.zipCode;
    case STEP_KEYS.INSURANCE_TYPE:
      return !!formData.insuranceType;
    case STEP_KEYS.CAR_DETAILS:
      return formData.carMake && formData.carModel && formData.carYear;
    case STEP_KEYS.HOME_DETAILS:
      return formData.homeType && formData.homeYear && formData.homeSquareFeet;
    case STEP_KEYS.COVERAGE:
      return formData.coverageLevel && formData.deductible;
    case STEP_KEYS.REVIEW:
      return true;
    default:
      return false;
  }
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = getVisibleSteps(formData.insuranceType);
  const currentStep = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;
  const canProceed = isStepValid(currentStep?.key, formData);

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleCheckboxChange(field, value, checked) {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(v => v !== value),
    }));
  }

  function handleNext() {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleSubmit() {
    console.log('Sign up form submitted:', formData);
    navigate('/dashboard');
  }

  function renderPersonalInfo() {
    return (
      <Form className="signup-form">
        <Stack gap={6}>
          <TextInput
            id="firstName"
            labelText="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            required
          />
          <TextInput
            id="lastName"
            labelText="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={e => handleChange('lastName', e.target.value)}
            required
          />
          <TextInput
            id="email"
            labelText="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            required
          />
          <TextInput
            id="phone"
            labelText="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            required
          />
          <TextInput
            id="dateOfBirth"
            labelText="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={e => handleChange('dateOfBirth', e.target.value)}
          />
        </Stack>
      </Form>
    );
  }

  function renderAddress() {
    return (
      <Form className="signup-form">
        <Stack gap={6}>
          <TextInput
            id="streetAddress"
            labelText="Street Address"
            placeholder="123 Main Street"
            value={formData.streetAddress}
            onChange={e => handleChange('streetAddress', e.target.value)}
            required
          />
          <TextInput
            id="city"
            labelText="City"
            placeholder="New York"
            value={formData.city}
            onChange={e => handleChange('city', e.target.value)}
            required
          />
          <Select
            id="state"
            labelText="State"
            value={formData.state}
            onChange={e => handleChange('state', e.target.value)}
            required
          >
            <SelectItem value="" text="Select a state" />
            {US_STATES.map(s => (
              <SelectItem key={s} value={s} text={s} />
            ))}
          </Select>
          <TextInput
            id="zipCode"
            labelText="ZIP Code"
            placeholder="10001"
            value={formData.zipCode}
            onChange={e => handleChange('zipCode', e.target.value)}
            required
          />
        </Stack>
      </Form>
    );
  }

  function renderInsuranceType() {
    return (
      <div className="insurance-type-selector">
        {[
          {
            value: 'car',
            icon: <Car size={32} />,
            title: 'Car Insurance',
            description: 'Protect your vehicle with comprehensive coverage',
          },
          {
            value: 'home',
            icon: <Home size={32} />,
            title: 'Home Insurance',
            description: 'Secure your property and belongings',
          },
          {
            value: 'both',
            icon: (
              <span className="insurance-type-both-icons">
                <Car size={28} />
                <Home size={28} />
              </span>
            ),
            title: 'Both Car & Home',
            description: 'Bundle and save with combined coverage',
          },
        ].map(option => (
          <button
            key={option.value}
            type="button"
            className={`insurance-tile ${formData.insuranceType === option.value ? 'insurance-tile--selected' : ''}`}
            onClick={() => handleChange('insuranceType', option.value)}
          >
            <span className={`insurance-tile__icon ${formData.insuranceType === option.value ? 'insurance-tile__icon--selected' : ''}`}>
              {option.icon}
            </span>
            <span className="insurance-tile__title">{option.title}</span>
            <span className="insurance-tile__description">{option.description}</span>
          </button>
        ))}
      </div>
    );
  }

  function renderCarDetails() {
    return (
      <Form className="signup-form">
        <Stack gap={6}>
          <TextInput
            id="carMake"
            labelText="Make"
            placeholder="e.g. Toyota, Ford"
            value={formData.carMake}
            onChange={e => handleChange('carMake', e.target.value)}
            required
          />
          <TextInput
            id="carModel"
            labelText="Model"
            placeholder="e.g. Corolla, Bronco"
            value={formData.carModel}
            onChange={e => handleChange('carModel', e.target.value)}
            required
          />
          <Select
            id="carYear"
            labelText="Year"
            value={formData.carYear}
            onChange={e => handleChange('carYear', e.target.value)}
            required
          >
            <SelectItem value="" text="Select year" />
            {YEARS.map(y => (
              <SelectItem key={y} value={String(y)} text={String(y)} />
            ))}
          </Select>
          <TextInput
            id="carVin"
            labelText="VIN (optional)"
            placeholder=""
            helperText="17 digits"
            value={formData.carVin}
            onChange={e => handleChange('carVin', e.target.value)}
          />
        </Stack>
      </Form>
    );
  }

  function renderHomeDetails() {
    return (
      <Form className="signup-form">
        <Stack gap={6}>
          <Select
            id="homeType"
            labelText="Home Type"
            value={formData.homeType}
            onChange={e => handleChange('homeType', e.target.value)}
            required
          >
            <SelectItem value="" text="Select home type" />
            <SelectItem value="single-family" text="Single Family Home" />
            <SelectItem value="condo" text="Condo" />
            <SelectItem value="townhouse" text="Townhouse" />
            <SelectItem value="multi-family" text="Multi-Family Home" />
            <SelectItem value="mobile" text="Mobile Home" />
          </Select>
          <Select
            id="homeYear"
            labelText="Year Built"
            value={formData.homeYear}
            onChange={e => handleChange('homeYear', e.target.value)}
            required
          >
            <SelectItem value="" text="Select year" />
            {YEARS.map(y => (
              <SelectItem key={y} value={String(y)} text={String(y)} />
            ))}
          </Select>
          <NumberInput
            id="homeSquareFeet"
            label="Square Feet"
            helperText="We'll confirm this more accurately later"
            min={0}
            value={formData.homeSquareFeet || ''}
            onChange={(e, { value }) => handleChange('homeSquareFeet', value)}
            required
          />
          <NumberInput
            id="homeValue"
            label="Estimated Home Value"
            helperText="We'll confirm this more accurately later"
            min={0}
            value={formData.homeValue || ''}
            onChange={(e, { value }) => handleChange('homeValue', value)}
          />
        </Stack>
      </Form>
    );
  }

  function renderCoverage() {
    return (
      <Form className="signup-form">
        <Stack gap={7}>
          <RadioButtonGroup
            legendText="Coverage Level"
            name="coverageLevel"
            valueSelected={formData.coverageLevel}
            onChange={value => handleChange('coverageLevel', value)}
          >
            <RadioButton labelText="Basic" value="basic" id="coverage-basic" />
            <RadioButton labelText="Standard" value="standard" id="coverage-standard" />
            <RadioButton labelText="Premium" value="premium" id="coverage-premium" />
          </RadioButtonGroup>
          <RadioButtonGroup
            legendText="Deductible"
            name="deductible"
            valueSelected={formData.deductible}
            onChange={value => handleChange('deductible', value)}
          >
            <RadioButton labelText="$500" value="500" id="deductible-500" />
            <RadioButton labelText="$1,000" value="1000" id="deductible-1000" />
            <RadioButton labelText="$2,500" value="2500" id="deductible-2500" />
          </RadioButtonGroup>
          <fieldset className="additional-coverage-fieldset">
            <legend className="additional-coverage-legend">Additional Coverage (optional)</legend>
            <Stack gap={3}>
              {[
                { value: 'roadside', label: 'Roadside Assistance' },
                { value: 'rental', label: 'Rental Car Reimbursement' },
                { value: 'glass', label: 'Glass Coverage' },
                { value: 'flood', label: 'Flood Insurance' },
              ].map(opt => (
                <Checkbox
                  key={opt.value}
                  id={`coverage-${opt.value}`}
                  labelText={opt.label}
                  checked={formData.additionalCoverage.includes(opt.value)}
                  onChange={(_, { checked }) =>
                    handleCheckboxChange('additionalCoverage', opt.value, checked)
                  }
                />
              ))}
            </Stack>
          </fieldset>
        </Stack>
      </Form>
    );
  }

  function renderReview() {
    const typeLabel = { car: 'Car Insurance', home: 'Home Insurance', both: 'Car & Home Insurance' };
    const coverageLabel = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };

    return (
      <div className="review-grid">
        <div className="review-section">
          <h3 className="review-section__title">Personal Information</h3>
          <div className="review-row"><span>Name</span><span>{formData.firstName} {formData.lastName}</span></div>
          <div className="review-row"><span>Email</span><span>{formData.email}</span></div>
          <div className="review-row"><span>Phone</span><span>{formData.phone}</span></div>
          {formData.dateOfBirth && <div className="review-row"><span>Date of Birth</span><span>{formData.dateOfBirth}</span></div>}
        </div>

        <div className="review-section">
          <h3 className="review-section__title">Address</h3>
          <div className="review-row"><span>Street</span><span>{formData.streetAddress}</span></div>
          <div className="review-row"><span>City, State</span><span>{formData.city}, {formData.state} {formData.zipCode}</span></div>
        </div>

        <div className="review-section">
          <h3 className="review-section__title">Insurance</h3>
          <div className="review-row"><span>Type</span><span>{typeLabel[formData.insuranceType]}</span></div>
          <div className="review-row"><span>Coverage Level</span><span>{coverageLabel[formData.coverageLevel]}</span></div>
          <div className="review-row"><span>Deductible</span><span>${formData.deductible}</span></div>
          {formData.additionalCoverage.length > 0 && (
            <div className="review-row">
              <span>Add-ons</span>
              <span>{formData.additionalCoverage.join(', ')}</span>
            </div>
          )}
        </div>

        {(formData.insuranceType === 'car' || formData.insuranceType === 'both') && (
          <div className="review-section">
            <h3 className="review-section__title">Car Details</h3>
            <div className="review-row"><span>Make / Model</span><span>{formData.carMake} {formData.carModel}</span></div>
            <div className="review-row"><span>Year</span><span>{formData.carYear}</span></div>
            {formData.carVin && <div className="review-row"><span>VIN</span><span>{formData.carVin}</span></div>}
          </div>
        )}

        {(formData.insuranceType === 'home' || formData.insuranceType === 'both') && (
          <div className="review-section">
            <h3 className="review-section__title">Home Details</h3>
            <div className="review-row"><span>Type</span><span>{formData.homeType}</span></div>
            <div className="review-row"><span>Year Built</span><span>{formData.homeYear}</span></div>
            <div className="review-row"><span>Square Feet</span><span>{formData.homeSquareFeet}</span></div>
            {formData.homeValue && <div className="review-row"><span>Est. Value</span><span>${Number(formData.homeValue).toLocaleString()}</span></div>}
          </div>
        )}
      </div>
    );
  }

  const stepDescriptions = {
    [STEP_KEYS.PERSONAL]: "Let's start with some basic information about you.",
    [STEP_KEYS.ADDRESS]: "Where do you live? We need this to calculate your quote.",
    [STEP_KEYS.INSURANCE_TYPE]: "What type of coverage are you looking for?",
    [STEP_KEYS.CAR_DETAILS]: "Tell us about your car.",
    [STEP_KEYS.HOME_DETAILS]: "Tell us about your home.",
    [STEP_KEYS.COVERAGE]: "Choose the coverage options that fit your needs.",
    [STEP_KEYS.REVIEW]: "Please review your information before submitting.",
  };

  const stepTitles = {
    [STEP_KEYS.PERSONAL]: "Personal Information",
    [STEP_KEYS.ADDRESS]: "Your Address",
    [STEP_KEYS.INSURANCE_TYPE]: "Insurance Type",
    [STEP_KEYS.CAR_DETAILS]: "Car Details",
    [STEP_KEYS.HOME_DETAILS]: "Home Details",
    [STEP_KEYS.COVERAGE]: "Coverage Preferences",
    [STEP_KEYS.REVIEW]: "Review & Confirm",
  };

  function renderCurrentStep() {
    switch (currentStep?.key) {
      case STEP_KEYS.PERSONAL: return renderPersonalInfo();
      case STEP_KEYS.ADDRESS: return renderAddress();
      case STEP_KEYS.INSURANCE_TYPE: return renderInsuranceType();
      case STEP_KEYS.CAR_DETAILS: return renderCarDetails();
      case STEP_KEYS.HOME_DETAILS: return renderHomeDetails();
      case STEP_KEYS.COVERAGE: return renderCoverage();
      case STEP_KEYS.REVIEW: return renderReview();
      default: return null;
    }
  }

  return (
    <div className="signup-page">
      {/* Hero Banner */}
      <div className="signup-banner">
        <h1 className="signup-banner__title">Sign Up for InsureCo</h1>
        <p className="signup-banner__subtitle">
          Get started with your insurance coverage in just a few steps
        </p>
      </div>

      <div className="signup-content">
        {/* Progress Indicator */}
        <div className="signup-progress">
          <StepBreadcrumb steps={steps} currentIndex={currentStepIndex} />
        </div>

        {/* Form Card */}
        <div className="signup-card">
          <div className="signup-card__header">
            <Heading className="signup-card__title">
              {stepTitles[currentStep?.key]}
            </Heading>
            <p className="signup-card__description">
              {stepDescriptions[currentStep?.key]}
            </p>
          </div>

          <div className="signup-card__body">
            {renderCurrentStep()}
          </div>

          <div className="signup-card__footer">
            {!isFirst && (
              <Button
                kind="secondary"
                size="lg"
                renderIcon={ArrowLeft}
                onClick={handleBack}
                className="signup-back-btn"
              >
                Back
              </Button>
            )}
            {!isLast ? (
              <Button
                kind="primary"
                size="lg"
                renderIcon={ArrowRight}
                onClick={handleNext}
                disabled={!canProceed}
                className="signup-next-btn"
              >
                Next
              </Button>
            ) : (
              <Button
                kind="primary"
                size="lg"
                renderIcon={Checkmark}
                onClick={handleSubmit}
                className="signup-next-btn"
              >
                Complete Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
