import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Select,
  SelectItem,
  NumberInput,
  Button,
  Checkbox,
  RadioButtonGroup,
  RadioButton,
  TileGroup,
  RadioTile,
  Form,
  Stack,
} from '@carbon/react';
import {
  ArrowRight,
  ArrowLeft,
  Checkmark,
  Car,
  Home,
} from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import './SignUpPage.scss';

const INSURANCE_TYPES = {
  CAR: 'car',
  HOME: 'home',
  BOTH: 'both',
};

const INITIAL_FORM_DATA = {
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

const ALL_STEPS = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'address', label: 'Address' },
  { key: 'insurance-type', label: 'Insurance Type' },
  { key: 'car-details', label: 'Car Details', conditional: true, requires: [INSURANCE_TYPES.CAR, INSURANCE_TYPES.BOTH] },
  { key: 'home-details', label: 'Home Details', conditional: true, requires: [INSURANCE_TYPES.HOME, INSURANCE_TYPES.BOTH] },
  { key: 'coverage', label: 'Coverage' },
  { key: 'review', label: 'Review' },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const CAR_YEARS = Array.from({ length: 2026 - 1980 }, (_, i) => String(2025 - i));
const HOME_YEARS = Array.from({ length: 2026 - 1800 }, (_, i) => String(2025 - i));

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStepKey, setCurrentStepKey] = useState('personal');

  const activeSteps = ALL_STEPS.filter((step) => {
    if (!step.conditional) return true;
    return step.requires.includes(formData.insuranceType);
  });

  const currentIndex = activeSteps.findIndex((s) => s.key === currentStepKey);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepKey]);

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleCoverage = (option) => {
    setFormData((prev) => {
      const current = prev.additionalCoverage;
      return {
        ...prev,
        additionalCoverage: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const isStepValid = () => {
    switch (currentStepKey) {
      case 'personal':
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 'address':
        return formData.streetAddress && formData.city && formData.state && formData.zipCode;
      case 'insurance-type':
        return Boolean(formData.insuranceType);
      case 'car-details':
        return formData.carMake && formData.carModel && formData.carYear;
      case 'home-details':
        return formData.homeType && formData.homeYear && formData.homeSquareFeet;
      case 'coverage':
        return formData.coverageLevel && formData.deductible;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentIndex < activeSteps.length - 1) {
      setCurrentStepKey(activeSteps[currentIndex + 1].key);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentStepKey(activeSteps[currentIndex - 1].key);
    }
  };

  const handleSubmit = () => {
    console.log('Sign-up submitted:', formData);
    navigate('/dashboard');
  };

  const renderPersonalInfo = () => (
    <div className="signup-step">
      <div className="signup-step__header">
        <h2 className="signup-step__title">Personal Information</h2>
        <p className="signup-step__description">Let's start with some basic information about you.</p>
      </div>
      <Form className="signup-step__form">
        <Stack gap={6}>
          <TextInput
            id="firstName"
            labelText="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            size="lg"
          />
          <TextInput
            id="lastName"
            labelText="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            size="lg"
          />
          <TextInput
            id="email"
            labelText="Email Address"
            placeholder="your.email@example.com"
            type="email"
            value={formData.email}
            onChange={(e) => update('email', e.target.value)}
            size="lg"
          />
          <TextInput
            id="phone"
            labelText="Phone Number"
            placeholder="(555) 123-4567"
            type="tel"
            value={formData.phone}
            onChange={(e) => update('phone', e.target.value)}
            size="lg"
          />
          <TextInput
            id="dateOfBirth"
            labelText="Date of Birth"
            placeholder="mm/dd/yyyy"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
            size="lg"
          />
        </Stack>
      </Form>
    </div>
  );

  const renderAddress = () => (
    <div className="signup-step">
      <div className="signup-step__header">
        <h2 className="signup-step__title">Your Address</h2>
        <p className="signup-step__description">Where is your primary residence?</p>
      </div>
      <Form className="signup-step__form">
        <Stack gap={6}>
          <TextInput
            id="streetAddress"
            labelText="Street Address"
            placeholder="123 Main Street"
            value={formData.streetAddress}
            onChange={(e) => update('streetAddress', e.target.value)}
            size="lg"
          />
          <TextInput
            id="city"
            labelText="City"
            placeholder="New York"
            value={formData.city}
            onChange={(e) => update('city', e.target.value)}
            size="lg"
          />
          <div className="signup-step__row">
            <Select
              id="state"
              labelText="State"
              value={formData.state}
              onChange={(e) => update('state', e.target.value)}
              size="lg"
            >
              <SelectItem value="" text="Select state" />
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s} text={s} />
              ))}
            </Select>
            <TextInput
              id="zipCode"
              labelText="ZIP Code"
              placeholder="10001"
              value={formData.zipCode}
              onChange={(e) => update('zipCode', e.target.value)}
              size="lg"
            />
          </div>
        </Stack>
      </Form>
    </div>
  );

  const renderInsuranceType = () => (
    <div className="signup-step">
      <div className="signup-step__header">
        <h2 className="signup-step__title">Insurance Type</h2>
        <p className="signup-step__description">What type of coverage are you looking for?</p>
      </div>
      <TileGroup
        name="insuranceType"
        valueSelected={formData.insuranceType}
        onChange={(value) => update('insuranceType', value)}
        className="signup-step__tile-group"
      >
        <RadioTile value={INSURANCE_TYPES.CAR} className="signup-step__tile">
          <div className="signup-tile__content">
            <Car size={32} className="signup-tile__icon" />
            <div className="signup-tile__text">
              <span className="signup-tile__title">Car Insurance</span>
              <span className="signup-tile__desc">Protect your vehicle with comprehensive coverage</span>
            </div>
          </div>
        </RadioTile>
        <RadioTile value={INSURANCE_TYPES.HOME} className="signup-step__tile">
          <div className="signup-tile__content">
            <Home size={32} className="signup-tile__icon" />
            <div className="signup-tile__text">
              <span className="signup-tile__title">Home Insurance</span>
              <span className="signup-tile__desc">Secure your property and belongings</span>
            </div>
          </div>
        </RadioTile>
        <RadioTile value={INSURANCE_TYPES.BOTH} className="signup-step__tile">
          <div className="signup-tile__content">
            <div className="signup-tile__dual-icons">
              <Car size={28} className="signup-tile__icon" />
              <Home size={28} className="signup-tile__icon" />
            </div>
            <div className="signup-tile__text">
              <span className="signup-tile__title">Both Car &amp; Home</span>
              <span className="signup-tile__desc">Bundle and save with combined coverage</span>
            </div>
          </div>
        </RadioTile>
      </TileGroup>
    </div>
  );

  const renderCarDetails = () => (
    <div className="signup-step">
      <div className="signup-step__header">
        <h2 className="signup-step__title">Car Details</h2>
        <p className="signup-step__description">Tell us about your car.</p>
      </div>
      <Form className="signup-step__form">
        <Stack gap={6}>
          <TextInput
            id="carMake"
            labelText="Make"
            placeholder="e.g. Toyota, Ford"
            value={formData.carMake}
            onChange={(e) => update('carMake', e.target.value)}
            size="lg"
          />
          <TextInput
            id="carModel"
            labelText="Model"
            placeholder="e.g. Corolla, Bronco"
            value={formData.carModel}
            onChange={(e) => update('carModel', e.target.value)}
            size="lg"
          />
          <Select
            id="carYear"
            labelText="Year"
            value={formData.carYear}
            onChange={(e) => update('carYear', e.target.value)}
            size="lg"
          >
            <SelectItem value="" text="Select year" />
            {CAR_YEARS.map((y) => (
              <SelectItem key={y} value={y} text={y} />
            ))}
          </Select>
          <TextInput
            id="carVin"
            labelText="VIN (optional)"
            placeholder=""
            helperText="17 digits"
            value={formData.carVin}
            onChange={(e) => update('carVin', e.target.value)}
            size="lg"
          />
        </Stack>
      </Form>
    </div>
  );

  const renderHomeDetails = () => (
    <div className="signup-step">
      <div className="signup-step__header">
        <h2 className="signup-step__title">Home Details</h2>
        <p className="signup-step__description">Tell us about your home.</p>
      </div>
      <Form className="signup-step__form">
        <Stack gap={6}>
          <Select
            id="homeType"
            labelText="Home Type"
            value={formData.homeType}
            onChange={(e) => update('homeType', e.target.value)}
            size="lg"
          >
            <SelectItem value="" text="Select home type" />
            <SelectItem value="single-family" text="Single Family" />
            <SelectItem value="condo" text="Condo" />
            <SelectItem value="townhouse" text="Townhouse" />
            <SelectItem value="multi-family" text="Multi-Family" />
            <SelectItem value="mobile" text="Mobile Home" />
          </Select>
          <Select
            id="homeYear"
            labelText="Year Built"
            value={formData.homeYear}
            onChange={(e) => update('homeYear', e.target.value)}
            size="lg"
          >
            <SelectItem value="" text="Select year" />
            {HOME_YEARS.map((y) => (
              <SelectItem key={y} value={y} text={y} />
            ))}
          </Select>
          <NumberInput
            id="homeSquareFeet"
            label="Square Feet"
            helperText="We'll confirm this more accurately later"
            value={formData.homeSquareFeet}
            onChange={(e, { value }) => update('homeSquareFeet', value)}
            min={100}
            step={100}
            size="lg"
          />
          <TextInput
            id="homeValue"
            labelText="Estimated Home Value"
            placeholder="$250,000"
            helperText="We'll confirm this more accurately later"
            value={formData.homeValue}
            onChange={(e) => update('homeValue', e.target.value)}
            size="lg"
          />
        </Stack>
      </Form>
    </div>
  );

  const renderCoverage = () => (
    <div className="signup-step">
      <div className="signup-step__header">
        <h2 className="signup-step__title">Coverage Preferences</h2>
        <p className="signup-step__description">Choose the level of coverage that fits your needs.</p>
      </div>
      <Form className="signup-step__form">
        <Stack gap={7}>
          <RadioButtonGroup
            legendText="Coverage Level"
            name="coverageLevel"
            valueSelected={formData.coverageLevel}
            onChange={(value) => update('coverageLevel', value)}
            orientation="vertical"
            className="signup-step__radio-group"
          >
            <RadioButton value="basic" labelText="Basic — Essential protection at the lowest cost" id="coverage-basic" />
            <RadioButton value="standard" labelText="Standard — Balanced coverage for most needs" id="coverage-standard" />
            <RadioButton value="premium" labelText="Premium — Comprehensive protection for full peace of mind" id="coverage-premium" />
          </RadioButtonGroup>
          <Select
            id="deductible"
            labelText="Deductible"
            value={formData.deductible}
            onChange={(e) => update('deductible', e.target.value)}
            size="lg"
          >
            <SelectItem value="" text="Select deductible" />
            <SelectItem value="500" text="$500" />
            <SelectItem value="1000" text="$1,000" />
            <SelectItem value="2000" text="$2,000" />
            <SelectItem value="5000" text="$5,000" />
          </Select>
          <fieldset className="signup-step__fieldset">
            <legend className="signup-step__legend">Additional Coverage (optional)</legend>
            <Stack gap={4}>
              {['Roadside Assistance', 'Rental Car Coverage', 'Gap Coverage', 'Flood Insurance', 'Earthquake Coverage'].map((opt) => (
                <Checkbox
                  key={opt}
                  id={`coverage-${opt}`}
                  labelText={opt}
                  checked={formData.additionalCoverage.includes(opt)}
                  onChange={() => toggleCoverage(opt)}
                />
              ))}
            </Stack>
          </fieldset>
        </Stack>
      </Form>
    </div>
  );

  const renderReview = () => {
    const hasCarDetails = [INSURANCE_TYPES.CAR, INSURANCE_TYPES.BOTH].includes(formData.insuranceType);
    const hasHomeDetails = [INSURANCE_TYPES.HOME, INSURANCE_TYPES.BOTH].includes(formData.insuranceType);

    return (
      <div className="signup-step">
        <div className="signup-step__header">
          <h2 className="signup-step__title">Review &amp; Confirm</h2>
          <p className="signup-step__description">Please review your information before submitting.</p>
        </div>
        <div className="signup-review">
          <div className="signup-review__section">
            <h3 className="signup-review__section-title">Personal Information</h3>
            <dl className="signup-review__list">
              <div className="signup-review__item"><dt>Name</dt><dd>{formData.firstName} {formData.lastName}</dd></div>
              <div className="signup-review__item"><dt>Email</dt><dd>{formData.email}</dd></div>
              <div className="signup-review__item"><dt>Phone</dt><dd>{formData.phone}</dd></div>
              <div className="signup-review__item"><dt>Date of Birth</dt><dd>{formData.dateOfBirth}</dd></div>
            </dl>
          </div>
          <div className="signup-review__section">
            <h3 className="signup-review__section-title">Address</h3>
            <dl className="signup-review__list">
              <div className="signup-review__item"><dt>Street</dt><dd>{formData.streetAddress}</dd></div>
              <div className="signup-review__item"><dt>City, State, ZIP</dt><dd>{formData.city}, {formData.state} {formData.zipCode}</dd></div>
            </dl>
          </div>
          <div className="signup-review__section">
            <h3 className="signup-review__section-title">Insurance</h3>
            <dl className="signup-review__list">
              <div className="signup-review__item"><dt>Type</dt><dd className="signup-review__capitalize">{formData.insuranceType}</dd></div>
            </dl>
          </div>
          {hasCarDetails && (
            <div className="signup-review__section">
              <h3 className="signup-review__section-title">Car Details</h3>
              <dl className="signup-review__list">
                <div className="signup-review__item"><dt>Make</dt><dd>{formData.carMake}</dd></div>
                <div className="signup-review__item"><dt>Model</dt><dd>{formData.carModel}</dd></div>
                <div className="signup-review__item"><dt>Year</dt><dd>{formData.carYear}</dd></div>
                {formData.carVin && <div className="signup-review__item"><dt>VIN</dt><dd>{formData.carVin}</dd></div>}
              </dl>
            </div>
          )}
          {hasHomeDetails && (
            <div className="signup-review__section">
              <h3 className="signup-review__section-title">Home Details</h3>
              <dl className="signup-review__list">
                <div className="signup-review__item"><dt>Type</dt><dd>{formData.homeType}</dd></div>
                <div className="signup-review__item"><dt>Year Built</dt><dd>{formData.homeYear}</dd></div>
                <div className="signup-review__item"><dt>Square Feet</dt><dd>{formData.homeSquareFeet}</dd></div>
                <div className="signup-review__item"><dt>Est. Value</dt><dd>{formData.homeValue}</dd></div>
              </dl>
            </div>
          )}
          <div className="signup-review__section">
            <h3 className="signup-review__section-title">Coverage</h3>
            <dl className="signup-review__list">
              <div className="signup-review__item"><dt>Level</dt><dd className="signup-review__capitalize">{formData.coverageLevel}</dd></div>
              <div className="signup-review__item"><dt>Deductible</dt><dd>${formData.deductible}</dd></div>
              {formData.additionalCoverage.length > 0 && (
                <div className="signup-review__item"><dt>Add-ons</dt><dd>{formData.additionalCoverage.join(', ')}</dd></div>
              )}
            </dl>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStepKey) {
      case 'personal': return renderPersonalInfo();
      case 'address': return renderAddress();
      case 'insurance-type': return renderInsuranceType();
      case 'car-details': return renderCarDetails();
      case 'home-details': return renderHomeDetails();
      case 'coverage': return renderCoverage();
      case 'review': return renderReview();
      default: return null;
    }
  };

  const isLastStep = currentIndex === activeSteps.length - 1;

  return (
    <div className="signup-page">
      {/* Hero banner */}
      <div className="signup-banner">
        <h1 className="signup-banner__title">Sign Up for InsureCo</h1>
        <p className="signup-banner__subtitle">Get started with your insurance coverage in just a few steps</p>
      </div>

      {/* Progress indicator */}
      <div className="signup-progress">
        <StepBreadcrumb steps={activeSteps} currentIndex={currentIndex} />
      </div>

      {/* Form content */}
      <div className="signup-content">
        {renderCurrentStep()}

        {/* Navigation */}
        <div className="signup-nav">
          {currentIndex > 0 && (
            <Button
              kind="secondary"
              size="lg"
              renderIcon={ArrowLeft}
              onClick={goBack}
              className="signup-nav__back"
            >
              Back
            </Button>
          )}
          <div className="signup-nav__spacer" />
          {isLastStep ? (
            <Button
              kind="primary"
              size="lg"
              renderIcon={Checkmark}
              onClick={handleSubmit}
              className="signup-nav__submit"
            >
              Complete Sign Up
            </Button>
          ) : (
            <Button
              kind="primary"
              size="lg"
              renderIcon={ArrowRight}
              onClick={goNext}
              disabled={!isStepValid()}
              className="signup-nav__next"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
