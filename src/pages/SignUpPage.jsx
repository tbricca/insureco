import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Column,
  Form,
  Stack,
  TextInput,
  Button,
  Checkbox,
  RadioButtonGroup,
  RadioButton,
  Select,
  SelectItem,
  Heading,
  Tile,
  NumberInput,
  TileGroup,
  RadioTile,
  DatePicker,
  DatePickerInput,
  Tooltip,
  InlineNotification,
} from '@carbon/react';
import {
  ArrowRight,
  ArrowLeft,
  Checkmark,
  Car,
  Home as HomeIcon,
  Locked,
  Information,
  LogoGoogle,
  LogoApple,
} from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import { trackEvent } from '../lib/analytics';
import { loadDraft, saveDraft, clearDraft } from '../lib/signupDraft';
import './SignUpPage.scss';

const INITIAL_FORM = {
  // Personal (collected late)
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',

  // Captured early
  email: '',
  zipCode: '',

  // Address (rest)
  streetAddress: '',
  city: '',
  state: '',

  // Insurance type
  insuranceType: '',

  // Car
  carMake: '',
  carModel: '',
  carYear: new Date().getFullYear().toString(),
  carVin: '',

  // Home
  homeType: '',
  homeYear: '',
  homeSquareFeet: '',
  homeValue: '',

  // Coverage — smart defaults
  coverageLevel: 'standard',
  deductible: '500',
  additionalCoverage: [],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const PHONE_RE = /^[\d\s().+-]{10,}$/;

export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const draftRef = useRef(null);
  const stepViewedRef = useRef(new Set());

  // Resume detection on mount.
  useEffect(() => {
    const draft = loadDraft();
    if (draft?.formData) {
      draftRef.current = draft;
      setShowResumeBanner(true);
    }
    trackEvent('signup_started');
  }, []);

  // Persist draft on every change.
  useEffect(() => {
    saveDraft({ formData, currentStep });
  }, [formData, currentStep]);

  // Abandonment signal.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        trackEvent('signup_abandoned', { step: currentStep });
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [currentStep]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const markTouched = (field) => {
    setTouched(prev => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const handleCheckboxChange = (checked, value) => {
    setFormData(prev => ({
      ...prev,
      additionalCoverage: checked
        ? [...prev.additionalCoverage, value]
        : prev.additionalCoverage.filter(item => item !== value),
    }));
  };

  // Step list: progressive profiling — type first, PII last.
  const steps = useMemo(() => {
    const list = [
      { key: 'type', label: 'Coverage' },
      { key: 'zipEmail', label: 'ZIP + Email' },
      { key: 'address', label: 'Address' },
    ];
    if (formData.insuranceType === 'car' || formData.insuranceType === 'both') {
      list.push({ key: 'car', label: 'Car' });
    }
    if (formData.insuranceType === 'home' || formData.insuranceType === 'both') {
      list.push({ key: 'home', label: 'Home' });
    }
    list.push({ key: 'coverage', label: 'Preferences' });
    list.push({ key: 'estimate', label: 'Estimate' });
    list.push({ key: 'personal', label: 'About You' });
    list.push({ key: 'review', label: 'Review' });
    return list;
  }, [formData.insuranceType]);

  // Keep currentStep in range when conditional steps drop.
  useEffect(() => {
    if (currentStep > steps.length - 1) {
      setCurrentStep(steps.length - 1);
    }
  }, [steps.length, currentStep]);

  const currentStepData = steps[currentStep];

  // Fire step_view once per step key.
  useEffect(() => {
    const key = currentStepData?.key;
    if (!key || stepViewedRef.current.has(key)) return;
    stepViewedRef.current.add(key);
    trackEvent('signup_step_view', { step: key, index: currentStep });
  }, [currentStepData, currentStep]);

  // Field validation messages (plain English).
  const fieldError = (field) => {
    const v = formData[field];
    switch (field) {
      case 'email':
        if (!v) return 'We need your email to send your quote.';
        if (!EMAIL_RE.test(v)) return 'That email doesn\'t look right.';
        return null;
      case 'zipCode':
        if (!v) return 'Your ZIP helps us estimate local rates.';
        if (!ZIP_RE.test(v)) return 'Use a 5-digit ZIP code.';
        return null;
      case 'phone':
        if (!v) return 'A phone number lets us follow up if needed.';
        if (!PHONE_RE.test(v)) return 'Enter a valid phone number.';
        return null;
      case 'firstName':
        return v ? null : 'First name is required.';
      case 'lastName':
        return v ? null : 'Last name is required.';
      case 'streetAddress':
        return v ? null : 'Street address is required.';
      case 'city':
        return v ? null : 'City is required.';
      case 'state':
        return v ? null : 'Select your state.';
      case 'carMake':
        return v ? null : 'Make is required.';
      case 'carModel':
        return v ? null : 'Model is required.';
      case 'carYear':
        return v ? null : 'Select the year.';
      case 'homeType':
        return v ? null : 'Pick a home type.';
      case 'homeYear':
        return v ? null : 'Select the year built.';
      case 'homeSquareFeet':
        return v ? null : 'Square footage is required.';
      case 'coverageLevel':
        return v ? null : 'Choose a coverage level.';
      case 'deductible':
        return v ? null : 'Choose a deductible.';
      default:
        return null;
    }
  };

  const stepFields = (key) => {
    switch (key) {
      case 'type': return ['insuranceType'];
      case 'zipEmail': return ['zipCode', 'email'];
      case 'address': return ['streetAddress', 'city', 'state'];
      case 'car': return ['carMake', 'carModel', 'carYear'];
      case 'home': return ['homeType', 'homeYear', 'homeSquareFeet'];
      case 'coverage': return ['coverageLevel', 'deductible'];
      case 'personal': return ['firstName', 'lastName', 'phone'];
      default: return [];
    }
  };

  const isStepValid = () => {
    if (currentStepData?.key === 'type') return !!formData.insuranceType;
    if (currentStepData?.key === 'estimate' || currentStepData?.key === 'review') return true;
    return stepFields(currentStepData?.key).every(f => !fieldError(f));
  };

  const handleNext = () => {
    if (!isStepValid()) {
      // Surface errors for the current step.
      const fields = stepFields(currentStepData?.key);
      setTouched(prev => {
        const next = { ...prev };
        fields.forEach(f => {
          if (fieldError(f)) {
            next[f] = true;
            trackEvent('signup_field_error', { step: currentStepData?.key, field: f });
          }
        });
        return next;
      });
      return;
    }
    trackEvent('signup_step_complete', { step: currentStepData?.key, index: currentStep });
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const confirmationNumber = `IC-${timestamp.toString().slice(-6)}-${random.toString().padStart(4, '0')}`;
    trackEvent('signup_submit', { insuranceType: formData.insuranceType });
    clearDraft();
    navigate('/signup/confirmation', { state: { confirmationNumber } });
  };

  const handleResume = () => {
    const draft = draftRef.current;
    if (draft?.formData) {
      setFormData({ ...INITIAL_FORM, ...draft.formData });
      if (typeof draft.currentStep === 'number') {
        setCurrentStep(Math.max(0, draft.currentStep));
      }
      trackEvent('signup_draft_resumed');
    }
    setShowResumeBanner(false);
  };

  const handleStartOver = () => {
    clearDraft();
    setFormData(INITIAL_FORM);
    setCurrentStep(0);
    setShowResumeBanner(false);
    trackEvent('signup_draft_discarded');
  };

  // Indicative monthly range — local heuristic only, clearly labeled.
  const estimatedRange = useMemo(() => {
    let low = 0;
    let high = 0;
    if (formData.insuranceType === 'car' || formData.insuranceType === 'both') {
      low += 65; high += 145;
    }
    if (formData.insuranceType === 'home' || formData.insuranceType === 'both') {
      low += 80; high += 180;
    }
    if (formData.coverageLevel === 'premium') { low += 30; high += 60; }
    if (formData.coverageLevel === 'basic') { low = Math.max(35, low - 20); high = Math.max(55, high - 40); }
    if (formData.deductible === '250') { low += 10; high += 20; }
    if (formData.deductible === '2500') { low -= 10; high -= 15; }
    if (formData.insuranceType === 'both') { low -= 15; high -= 25; } // bundle nudge
    return {
      low: Math.max(25, Math.round(low)),
      high: Math.max(60, Math.round(high)),
    };
  }, [formData.insuranceType, formData.coverageLevel, formData.deductible]);

  const renderStepContent = () => {
    switch (currentStepData?.key) {
      case 'type':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">What Will You Insure</Heading>
            <p className="signup-step-description">
              Pick what you'd like a quote for — we'll only ask for the details we need.
            </p>

            <Tile className="signup-intro-panel">
              <ul className="signup-intro-list">
                <li><Checkmark size={16} /> Takes about 3 minutes</li>
                <li><Checkmark size={16} /> No credit check</li>
                <li><Locked size={16} /> Your info is encrypted</li>
              </ul>
            </Tile>

            <TileGroup
              className="signup-tile-group"
              legend="Select your insurance coverage type"
              name="insuranceType"
              valueSelected={formData.insuranceType}
              onChange={(value) => updateFormData('insuranceType', value)}
            >
              <RadioTile id="insurance-car" value="car" className="signup-radio-tile">
                <div className="tile-content">
                  <Car size={32} className="tile-icon" />
                  <div className="tile-text">
                    <h4>Car Insurance</h4>
                    <p>Get comprehensive coverage for your vehicle</p>
                  </div>
                </div>
              </RadioTile>

              <RadioTile id="insurance-home" value="home" className="signup-radio-tile">
                <div className="tile-content">
                  <HomeIcon size={32} className="tile-icon" />
                  <div className="tile-text">
                    <h4>Home Insurance</h4>
                    <p>Protect your most important asset for your family</p>
                  </div>
                </div>
              </RadioTile>

              <RadioTile id="insurance-both" value="both" className="signup-radio-tile">
                <div className="tile-content">
                  <div className="tile-icon-group">
                    <Car size={24} />
                    <HomeIcon size={24} />
                  </div>
                  <div className="tile-text">
                    <h4>Both Home and Car</h4>
                    <p>Insure both and get bundle savings</p>
                  </div>
                </div>
              </RadioTile>
            </TileGroup>

            <div className="signup-sso-divider"><span>or sign up with</span></div>
            <div className="signup-sso-buttons">
              <Button
                kind="tertiary"
                renderIcon={LogoGoogle}
                onClick={() => trackEvent('signup_sso_click', { provider: 'google' })}
              >
                Continue with Google
              </Button>
              <Button
                kind="tertiary"
                renderIcon={LogoApple}
                onClick={() => trackEvent('signup_sso_click', { provider: 'apple' })}
              >
                Continue with Apple
              </Button>
            </div>
          </Stack>
        );

      case 'zipEmail':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Where should we send your quote?</Heading>
            <p className="signup-step-description">
              Just your ZIP and email to start — we'll estimate a range before asking for anything else.
            </p>
            <TextInput
              id="zipCode"
              labelText="ZIP code"
              placeholder="12345"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={10}
              value={formData.zipCode}
              onChange={(e) => updateFormData('zipCode', e.target.value)}
              onBlur={() => markTouched('zipCode')}
              invalid={!!(touched.zipCode && fieldError('zipCode'))}
              invalidText={fieldError('zipCode') || ''}
              required
            />
            <TextInput
              id="email"
              labelText="Email Address"
              type="email"
              placeholder="your.email@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              onBlur={() => markTouched('email')}
              invalid={!!(touched.email && fieldError('email'))}
              invalidText={fieldError('email') || ''}
              required
            />
          </Stack>
        );

      case 'address':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Your Address</Heading>
            <p className="signup-step-description">
              We use this to tailor your local rates.
            </p>
            <TextInput
              id="streetAddress"
              labelText="Street Address"
              placeholder="123 Main Street"
              autoComplete="street-address"
              value={formData.streetAddress}
              onChange={(e) => updateFormData('streetAddress', e.target.value)}
              onBlur={() => markTouched('streetAddress')}
              invalid={!!(touched.streetAddress && fieldError('streetAddress'))}
              invalidText={fieldError('streetAddress') || ''}
              required
            />
            <TextInput
              id="city"
              labelText="City"
              placeholder="Your city"
              autoComplete="address-level2"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              onBlur={() => markTouched('city')}
              invalid={!!(touched.city && fieldError('city'))}
              invalidText={fieldError('city') || ''}
              required
            />
            <Select
              id="state"
              labelText="State"
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
              onBlur={() => markTouched('state')}
              invalid={!!(touched.state && fieldError('state'))}
              invalidText={fieldError('state') || ''}
              required
            >
              <SelectItem value="" text="Select a state" />
              <SelectItem value="AL" text="Alabama" />
              <SelectItem value="AK" text="Alaska" />
              <SelectItem value="AZ" text="Arizona" />
              <SelectItem value="CA" text="California" />
              <SelectItem value="CO" text="Colorado" />
              <SelectItem value="FL" text="Florida" />
              <SelectItem value="GA" text="Georgia" />
              <SelectItem value="IL" text="Illinois" />
              <SelectItem value="NY" text="New York" />
              <SelectItem value="TX" text="Texas" />
            </Select>
            <TextInput
              id="zipCodeConfirm"
              labelText="ZIP code"
              autoComplete="postal-code"
              value={formData.zipCode}
              onChange={(e) => updateFormData('zipCode', e.target.value)}
              helperText="Prefilled from earlier"
            />
          </Stack>
        );

      case 'car':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Car Details</Heading>
            <p className="signup-step-description">Tell us about your car</p>
            <TextInput
              id="carMake"
              labelText="Make"
              placeholder="e.g. Toyota, Ford"
              value={formData.carMake}
              onChange={(e) => updateFormData('carMake', e.target.value)}
              onBlur={() => markTouched('carMake')}
              invalid={!!(touched.carMake && fieldError('carMake'))}
              invalidText={fieldError('carMake') || ''}
              required
            />
            <TextInput
              id="carModel"
              labelText="Model"
              placeholder="e.g. Corolla, Bronco"
              value={formData.carModel}
              onChange={(e) => updateFormData('carModel', e.target.value)}
              onBlur={() => markTouched('carModel')}
              invalid={!!(touched.carModel && fieldError('carModel'))}
              invalidText={fieldError('carModel') || ''}
              required
            />
            <Select
              id="carYear"
              labelText="Year"
              value={formData.carYear}
              onChange={(e) => updateFormData('carYear', e.target.value)}
              required
            >
              {Array.from({ length: 2025 - 1960 + 1 }, (_, i) => 2025 - i).map(year => (
                <SelectItem key={year} value={year.toString()} text={year.toString()} />
              ))}
            </Select>
            <TextInput
              id="carVin"
              labelText={(
                <span className="signup-label-with-tip">
                  VIN (optional)
                  <Tooltip label="The 17-character ID found on your dashboard or driver-side door. Optional, but it speeds up your quote." align="top">
                    <button type="button" className="signup-tip-trigger" aria-label="What is a VIN?">
                      <Information size={16} />
                    </button>
                  </Tooltip>
                </span>
              )}
              placeholder=""
              helperText="17 digits"
              value={formData.carVin}
              onChange={(e) => updateFormData('carVin', e.target.value)}
            />
          </Stack>
        );

      case 'home':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Home Details</Heading>
            <p className="signup-step-description">Tell us about your home</p>
            <Select
              id="homeType"
              labelText="Home Type"
              value={formData.homeType}
              onChange={(e) => updateFormData('homeType', e.target.value)}
              onBlur={() => markTouched('homeType')}
              invalid={!!(touched.homeType && fieldError('homeType'))}
              invalidText={fieldError('homeType') || ''}
              required
            >
              <SelectItem value="" text="" />
              <SelectItem value="single-family" text="Single Family Home" />
              <SelectItem value="condo" text="Condominium" />
              <SelectItem value="townhouse" text="Townhouse" />
              <SelectItem value="apartment" text="Apartment" />
              <SelectItem value="mobile" text="Mobile Home" />
            </Select>
            <Select
              id="homeYear"
              labelText="Year Built"
              value={formData.homeYear}
              onChange={(e) => updateFormData('homeYear', e.target.value)}
              onBlur={() => markTouched('homeYear')}
              invalid={!!(touched.homeYear && fieldError('homeYear'))}
              invalidText={fieldError('homeYear') || ''}
              required
            >
              <SelectItem value="" text="" />
              {Array.from({ length: 2025 - 1800 + 1 }, (_, i) => 2025 - i).map(year => (
                <SelectItem key={year} value={year.toString()} text={year.toString()} />
              ))}
            </Select>
            <NumberInput
              id="homeSquareFeet"
              label="Square Feet"
              min={100}
              max={50000}
              value={formData.homeSquareFeet}
              onChange={(e, { value }) => updateFormData('homeSquareFeet', value ?? '')}
              helperText="We'll confirm this more accurately later"
              required
            />
            <NumberInput
              id="homeValue"
              label="Estimated Home Value"
              min={10000}
              max={10000000}
              step={1000}
              value={formData.homeValue}
              onChange={(e, { value }) => updateFormData('homeValue', value ?? '')}
              helperText="We'll confirm this more accurately later"
            />
          </Stack>
        );

      case 'coverage':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Coverage Preferences</Heading>
            <p className="signup-step-description">
              Choose your coverage level and deductible. We've pre-selected the most popular options.
            </p>
            <RadioButtonGroup
              name="coverageLevel"
              legendText={(
                <span className="signup-label-with-tip">
                  Coverage Level
                  <Tooltip label="Higher levels protect more of what you own but cost more each month." align="top">
                    <button type="button" className="signup-tip-trigger" aria-label="About coverage level">
                      <Information size={16} />
                    </button>
                  </Tooltip>
                </span>
              )}
              orientation="vertical"
              valueSelected={formData.coverageLevel}
              onChange={(value) => updateFormData('coverageLevel', value)}
            >
              <RadioButton labelText="Basic - Essential coverage at lower cost" value="basic" id="coverage-basic" />
              <RadioButton labelText="Standard - Recommended coverage for most" value="standard" id="coverage-standard" />
              <RadioButton labelText="Premium - Comprehensive protection" value="premium" id="coverage-premium" />
            </RadioButtonGroup>

            <Select
              id="deductible"
              labelText={(
                <span className="signup-label-with-tip">
                  Deductible
                  <Tooltip label="What you pay out-of-pocket before insurance kicks in. A higher deductible lowers your monthly cost." align="top">
                    <button type="button" className="signup-tip-trigger" aria-label="About deductible">
                      <Information size={16} />
                    </button>
                  </Tooltip>
                </span>
              )}
              value={formData.deductible}
              onChange={(e) => updateFormData('deductible', e.target.value)}
              required
            >
              <SelectItem value="250" text="$250" />
              <SelectItem value="500" text="$500 (most popular)" />
              <SelectItem value="1000" text="$1,000" />
              <SelectItem value="2500" text="$2,500" />
            </Select>

            <fieldset className="signup-checkbox-group">
              <legend className="cds--label">Additional Coverage (Optional)</legend>
              <Stack gap={3}>
                <Checkbox
                  id="roadside"
                  labelText="Roadside Assistance"
                  checked={formData.additionalCoverage.includes('roadside')}
                  onChange={(e) => handleCheckboxChange(e.target.checked, 'roadside')}
                />
                <Checkbox
                  id="rental"
                  labelText="Rental Car Coverage"
                  checked={formData.additionalCoverage.includes('rental')}
                  onChange={(e) => handleCheckboxChange(e.target.checked, 'rental')}
                />
                <Checkbox
                  id="gap"
                  labelText="Gap Insurance"
                  checked={formData.additionalCoverage.includes('gap')}
                  onChange={(e) => handleCheckboxChange(e.target.checked, 'gap')}
                />
              </Stack>
            </fieldset>
          </Stack>
        );

      case 'estimate':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Your estimated range</Heading>
            <p className="signup-step-description">
              Based on what you've shared, here's a ballpark monthly cost. We'll confirm an exact quote after a few last details.
            </p>
            <Tile className="signup-estimate-card">
              <div className="signup-estimate-label">Estimated monthly</div>
              <div className="signup-estimate-amount">
                ${estimatedRange.low} – ${estimatedRange.high}
              </div>
              <div className="signup-estimate-note">
                Indicative range — not a final quote. Final pricing depends on underwriting.
              </div>
            </Tile>
            <Tile className="signup-testimonial">
              <p className="signup-testimonial-quote">
                "Switching to InsureCo took ten minutes and I saved $40 a month."
              </p>
              <p className="signup-testimonial-attrib">— Jordan M., customer since 2022 ★★★★★</p>
            </Tile>
          </Stack>
        );

      case 'personal':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">A few last details</Heading>
            <p className="signup-step-description">
              We need your name and phone to finalize the quote.
            </p>
            <TextInput
              id="firstName"
              labelText="First Name"
              placeholder="Enter your first name"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              onBlur={() => markTouched('firstName')}
              invalid={!!(touched.firstName && fieldError('firstName'))}
              invalidText={fieldError('firstName') || ''}
              required
            />
            <TextInput
              id="lastName"
              labelText="Last Name"
              placeholder="Enter your last name"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              onBlur={() => markTouched('lastName')}
              invalid={!!(touched.lastName && fieldError('lastName'))}
              invalidText={fieldError('lastName') || ''}
              required
            />
            <TextInput
              id="phone"
              labelText="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              onBlur={() => markTouched('phone')}
              invalid={!!(touched.phone && fieldError('phone'))}
              invalidText={fieldError('phone') || ''}
              required
            />
            <DatePicker
              datePickerType="single"
              onChange={(dates) => updateFormData('dateOfBirth', dates?.[0] || '')}
            >
              <DatePickerInput
                id="dateOfBirth"
                labelText="Date of Birth (optional)"
                placeholder="mm/dd/yyyy"
                autoComplete="bday"
                value={formData.dateOfBirth}
              />
            </DatePicker>
          </Stack>
        );

      case 'review':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Review & Confirm</Heading>
            <p className="signup-step-description">
              Please review your information before submitting.
            </p>

            <Tile className="signup-review-section">
              <h4 className="signup-review-title">Personal Information</h4>
              <div className="signup-review-grid">
                <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Phone:</strong> {formData.phone}</div>
              </div>
            </Tile>

            <Tile className="signup-review-section">
              <h4 className="signup-review-title">Address</h4>
              <div className="signup-review-grid">
                <div>
                  {formData.streetAddress}, {formData.city}, {formData.state} {formData.zipCode}
                </div>
              </div>
            </Tile>

            <Tile className="signup-review-section">
              <h4 className="signup-review-title">Insurance Type</h4>
              <div className="signup-review-grid">
                <div>
                  {formData.insuranceType === 'car' && 'Car Insurance Only'}
                  {formData.insuranceType === 'home' && 'Home Insurance Only'}
                  {formData.insuranceType === 'both' && 'Car and Home Insurance'}
                </div>
              </div>
            </Tile>

            {(formData.insuranceType === 'car' || formData.insuranceType === 'both') && (
              <Tile className="signup-review-section">
                <h4 className="signup-review-title">Car Details</h4>
                <div className="signup-review-grid">
                  <div>
                    <strong>Vehicle:</strong> {formData.carYear} {formData.carMake} {formData.carModel}
                  </div>
                </div>
              </Tile>
            )}

            {(formData.insuranceType === 'home' || formData.insuranceType === 'both') && (
              <Tile className="signup-review-section">
                <h4 className="signup-review-title">Home Details</h4>
                <div className="signup-review-grid">
                  <div><strong>Type:</strong> {formData.homeType}</div>
                  <div><strong>Size:</strong> {formData.homeSquareFeet} sq ft</div>
                  <div><strong>Year Built:</strong> {formData.homeYear}</div>
                </div>
              </Tile>
            )}

            <Tile className="signup-review-section">
              <h4 className="signup-review-title">Coverage</h4>
              <div className="signup-review-grid">
                <div><strong>Level:</strong> {formData.coverageLevel}</div>
                <div><strong>Deductible:</strong> ${formData.deductible}</div>
                {formData.additionalCoverage.length > 0 && (
                  <div><strong>Additional:</strong> {formData.additionalCoverage.join(', ')}</div>
                )}
              </div>
            </Tile>

            <Tile className="signup-review-section">
              <h4 className="signup-review-title">Estimated monthly</h4>
              <div className="signup-review-grid">
                <div>${estimatedRange.low} – ${estimatedRange.high} (indicative)</div>
              </div>
            </Tile>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Grid className="signup-page signup-container">
      <Column sm={4} md={8} lg={{ span: 12, offset: 2 }} xlg={{ span: 10, offset: 3 }}>
        <header className="signup-header">
          <Heading className="signup-title">Sign Up for InsureCo</Heading>
          <p className="signup-subtitle">
            Get started with your insurance coverage in just a few steps
          </p>
        </header>

        {showResumeBanner && (
          <InlineNotification
            kind="info"
            title="Welcome back"
            subtitle="Resume where you left off?"
            hideCloseButton
            actions={
              <div className="signup-resume-actions">
                <Button kind="ghost" size="sm" onClick={handleStartOver}>Start over</Button>
                <Button kind="tertiary" size="sm" onClick={handleResume}>Continue</Button>
              </div>
            }
            className="signup-resume-banner"
          />
        )}

        <Tile className="signup-progress">
          <StepBreadcrumb steps={steps} currentIndex={currentStep} />
        </Tile>

        <Form className="signup-form" onSubmit={handleSubmit}>
          <Stack gap={7} className="signup-step-content">
            {renderStepContent()}
          </Stack>

          <div className="signup-trust-strip">
            <Locked size={16} />
            <span>Encrypted & secure</span>
            <span className="signup-trust-dot">•</span>
            <span>★ 4.8/5 from 12k customers</span>
            <span className="signup-trust-dot">•</span>
            <span>Cancel anytime in 14 days</span>
          </div>

          <Stack gap={5} orientation="horizontal" className="signup-actions">
            {currentStep > 0 && (
              <Button
                kind="secondary"
                onClick={handleBack}
                renderIcon={ArrowLeft}
                iconDescription="Go back"
              >
                Back
              </Button>
            )}

            <span className="signup-actions-spacer" />

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                renderIcon={ArrowRight}
                iconDescription="Continue"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepValid()}
                renderIcon={Checkmark}
                iconDescription="Submit"
              >
                Complete Sign Up
              </Button>
            )}
          </Stack>
        </Form>
      </Column>
    </Grid>
  );
}
