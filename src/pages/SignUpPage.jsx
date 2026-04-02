import React, { useState } from 'react';
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
  ProgressIndicator,
  ProgressStep,
  DatePicker,
  DatePickerInput,
  InlineNotification,
} from '@carbon/react';
import { ArrowRight, ArrowLeft, Checkmark, Car, Home as HomeIcon } from '@carbon/icons-react';
import './SignUpPage.scss';

// ─── Validators ─────────────────────────────────────────────────────────────
// Each returns an error string or null when valid.
const validate = {
  firstName:     (v) => !v?.trim() ? 'First name is required' : null,
  lastName:      (v) => !v?.trim() ? 'Last name is required' : null,
  email: (v) => {
    if (!v?.trim()) return 'Email address is required';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address';
  },
  phone: (v) => {
    if (!v?.trim()) return 'Phone number is required';
    const digits = v.replace(/\D/g, '');
    return digits.length === 10 ? null : 'Enter a valid 10-digit phone number';
  },
  dateOfBirth: (v) => {
    if (!v) return 'Date of birth is required';
    const dob = new Date(v);
    if (isNaN(dob)) return 'Enter a valid date';
    const age = (Date.now() - dob) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18 ? null : 'You must be at least 18 years old';
  },
  streetAddress: (v) => !v?.trim() ? 'Street address is required' : null,
  city:          (v) => !v?.trim() ? 'City is required' : null,
  state:         (v) => !v ? 'Please select a state' : null,
  zipCode: (v) => {
    if (!v?.trim()) return 'ZIP code is required';
    return /^\d{5}(-\d{4})?$/.test(v) ? null : 'Enter a valid 5-digit ZIP code';
  },
  carMake:  (v) => !v?.trim() ? 'Car make is required' : null,
  carModel: (v) => !v?.trim() ? 'Car model is required' : null,
  carYear:  (v) => !v ? 'Please select a year' : null,
  carVin:   (v) => v && v.length !== 17 ? 'VIN must be exactly 17 characters' : null,
  homeType: (v) => !v ? 'Please select a home type' : null,
  homeYear: (v) => !v ? 'Please select a year built' : null,
  coverageLevel: (v) => !v ? 'Please select a coverage level' : null,
  deductible:    (v) => !v ? 'Please select a deductible' : null,
};

// Fields required per step (for step validity check)
const stepRequiredFields = {
  personal: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'],
  address:  ['streetAddress', 'city', 'state', 'zipCode'],
  car:      ['carMake', 'carModel', 'carYear', 'carVin'],
  home:     ['homeType', 'homeYear'],
  coverage: ['coverageLevel', 'deductible'],
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',

    // Step 2: Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',

    // Step 3: Insurance Type
    insuranceType: '',

    // Step 4: Car Details
    carMake: '',
    carModel: '',
    carYear: '',
    carMileage: 1000,
    carMilesDriven: 1000,
    carVin: '',

    // Step 5: Home Details
    homeType: '',
    homeYear: '',
    homeSquareFeet: 1000,
    homeValue: 1000,

    // Step 6: Coverage Preferences
    coverageLevel: '',
    deductible: '',
    additionalCoverage: [],
  });

  const [showCarWarning, setShowCarWarning] = useState(true);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked, value) => {
    setFormData(prev => ({
      ...prev,
      additionalCoverage: checked
        ? [...prev.additionalCoverage, value]
        : prev.additionalCoverage.filter(item => item !== value),
    }));
  };

  // ─── Step list ──────────────────────────────────────────────────────────
  const getSteps = () => {
    const base = [
      { label: 'Personal Info',   key: 'personal' },
      { label: 'Address',         key: 'address' },
      { label: 'Insurance Type',  key: 'type' },
    ];
    const conditional = [];
    if (formData.insuranceType === 'car'  || formData.insuranceType === 'both')
      conditional.push({ label: 'Car Details',  key: 'car' });
    if (formData.insuranceType === 'home' || formData.insuranceType === 'both')
      conditional.push({ label: 'Home Details', key: 'home' });
    return [
      ...base,
      ...conditional,
      { label: 'Coverage', key: 'coverage' },
      { label: 'Review',   key: 'review' },
    ];
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  // ─── Validation helpers ─────────────────────────────────────────────────
  // Returns error string when `submitted` is true and field is invalid, else null.
  const err = (field) => (submitted ? validate[field]?.(formData[field]) ?? null : null);

  const isStepValid = () => {
    const key = currentStepData?.key;
    if (key === 'type')   return !!formData.insuranceType;
    if (key === 'review') return true;
    const fields = stepRequiredFields[key] ?? [];
    return fields.every(f => !validate[f]?.(formData[f]));
  };

  // ─── Navigation ─────────────────────────────────────────────────────────
  const handleNext = () => {
    setSubmitted(true);
    if (!isStepValid()) return;          // Show errors, stay on step
    setSubmitted(false);
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSubmitted(false);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ts     = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const confirmationNumber = `IC-${ts.toString().slice(-6)}-${random.toString().padStart(4, '0')}`;
    console.log('Form submitted:', formData);
    navigate('/signup/confirmation', { state: { confirmationNumber } });
  };

  // ─── Step content ────────────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStepData?.key) {

      // ── Personal Info ──────────────────────────────────────────────────
      case 'personal':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Personal Information</Heading>
            <p className="signup-step-description">
              Let's start with some basic information about you.
            </p>
            <TextInput
              id="firstName"
              labelText="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              invalid={!!err('firstName')}
              invalidText={err('firstName')}
            />
            <TextInput
              id="lastName"
              labelText="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              invalid={!!err('lastName')}
              invalidText={err('lastName')}
            />
            <TextInput
              id="email"
              labelText="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              invalid={!!err('email')}
              invalidText={err('email')}
            />
            <TextInput
              id="phone"
              labelText="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              invalid={!!err('phone')}
              invalidText={err('phone')}
            />
            <TextInput
              id="alternatePhone"
              labelText="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.alternatePhone}
              onChange={(e) => updateFormData('alternatePhone', e.target.value)}
            />
            <DatePicker
              datePickerType="single"
              onChange={(dates) => updateFormData('dateOfBirth', dates?.[0] || '')}
            >
              <DatePickerInput
                id="dateOfBirth"
                labelText="Date of Birth"
                placeholder="mm/dd/yyyy"
                value={formData.dateOfBirth instanceof Date
                  ? formData.dateOfBirth.toLocaleDateString('en-US')
                  : formData.dateOfBirth}
                invalid={!!err('dateOfBirth')}
                invalidText={err('dateOfBirth')}
              />
            </DatePicker>
          </Stack>
        );

      // ── Address ────────────────────────────────────────────────────────
      case 'address':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Your Address</Heading>
            <p className="signup-step-description">
              Let us know where you live
            </p>
            <TextInput
              id="streetAddress"
              labelText="Street Address"
              placeholder="123 Main Street"
              value={formData.streetAddress}
              onChange={(e) => updateFormData('streetAddress', e.target.value)}
              invalid={!!err('streetAddress')}
              invalidText={err('streetAddress')}
            />
            <TextInput
              id="city"
              labelText="City"
              placeholder="Your city"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              invalid={!!err('city')}
              invalidText={err('city')}
            />
            <Select
              id="state"
              labelText="State"
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
              invalid={!!err('state')}
              invalidText={err('state')}
            >
              <SelectItem value="" text="Select a state" />
              <SelectItem value="AL" text="Alabama" />
              <SelectItem value="AK" text="Alaska" />
              <SelectItem value="AZ" text="Arizona" />
              <SelectItem value="AR" text="Arkansas" />
              <SelectItem value="CA" text="California" />
              <SelectItem value="CO" text="Colorado" />
              <SelectItem value="CT" text="Connecticut" />
              <SelectItem value="DE" text="Delaware" />
              <SelectItem value="FL" text="Florida" />
              <SelectItem value="GA" text="Georgia" />
              <SelectItem value="HI" text="Hawaii" />
              <SelectItem value="ID" text="Idaho" />
              <SelectItem value="IL" text="Illinois" />
              <SelectItem value="IN" text="Indiana" />
              <SelectItem value="IA" text="Iowa" />
              <SelectItem value="KS" text="Kansas" />
              <SelectItem value="KY" text="Kentucky" />
              <SelectItem value="LA" text="Louisiana" />
              <SelectItem value="ME" text="Maine" />
              <SelectItem value="MD" text="Maryland" />
              <SelectItem value="MA" text="Massachusetts" />
              <SelectItem value="MI" text="Michigan" />
              <SelectItem value="MN" text="Minnesota" />
              <SelectItem value="MS" text="Mississippi" />
              <SelectItem value="MO" text="Missouri" />
              <SelectItem value="MT" text="Montana" />
              <SelectItem value="NE" text="Nebraska" />
              <SelectItem value="NV" text="Nevada" />
              <SelectItem value="NH" text="New Hampshire" />
              <SelectItem value="NJ" text="New Jersey" />
              <SelectItem value="NM" text="New Mexico" />
              <SelectItem value="NY" text="New York" />
              <SelectItem value="NC" text="North Carolina" />
              <SelectItem value="ND" text="North Dakota" />
              <SelectItem value="OH" text="Ohio" />
              <SelectItem value="OK" text="Oklahoma" />
              <SelectItem value="OR" text="Oregon" />
              <SelectItem value="PA" text="Pennsylvania" />
              <SelectItem value="RI" text="Rhode Island" />
              <SelectItem value="SC" text="South Carolina" />
              <SelectItem value="SD" text="South Dakota" />
              <SelectItem value="TN" text="Tennessee" />
              <SelectItem value="TX" text="Texas" />
              <SelectItem value="UT" text="Utah" />
              <SelectItem value="VT" text="Vermont" />
              <SelectItem value="VA" text="Virginia" />
              <SelectItem value="WA" text="Washington" />
              <SelectItem value="WV" text="West Virginia" />
              <SelectItem value="WI" text="Wisconsin" />
              <SelectItem value="WY" text="Wyoming" />
            </Select>
            <TextInput
              id="zipCode"
              labelText="Zip"
              placeholder="12345"
              value={formData.zipCode}
              onChange={(e) => updateFormData('zipCode', e.target.value)}
              invalid={!!err('zipCode')}
              invalidText={err('zipCode')}
            />
          </Stack>
        );

      // ── Insurance Type ─────────────────────────────────────────────────
      case 'type':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">What Will You Insure</Heading>
            <p className="signup-step-description">
              Which insurance coverage are you looking for
            </p>
            <TileGroup
              className="signup-tile-group"
              legend="Select your insurance coverage type"
              name="insuranceType"
              valueSelected={formData.insuranceType}
              onChange={(value) => updateFormData('insuranceType', value)}
            >
              <RadioTile id="insurance-car"  value="car"  className="signup-radio-tile">
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
            {submitted && !formData.insuranceType && (
              <p className="signup-tile-error">Please select an insurance type to continue</p>
            )}
          </Stack>
        );

      // ── Car Details ────────────────────────────────────────────────────
      case 'car':
        return (
          <Stack gap={6}>
            {showCarWarning && (
              <InlineNotification
                kind="warning"
                title="This is a warning message"
                onClose={() => setShowCarWarning(false)}
                lowContrast
              />
            )}
            <Heading className="signup-step-heading">Car Details</Heading>
            <p className="signup-step-description">Tell us about your car</p>
            <TextInput
              id="carMake"
              labelText="Make"
              placeholder="e.g. Toyota, Ford"
              value={formData.carMake}
              onChange={(e) => updateFormData('carMake', e.target.value)}
              invalid={!!err('carMake')}
              invalidText={err('carMake')}
            />
            <TextInput
              id="carModel"
              labelText="Model"
              placeholder="e.g. Corolla, Bronco"
              value={formData.carModel}
              onChange={(e) => updateFormData('carModel', e.target.value)}
              invalid={!!err('carModel')}
              invalidText={err('carModel')}
            />
            <Select
              id="carYear"
              labelText="Year"
              value={formData.carYear}
              onChange={(e) => updateFormData('carYear', e.target.value)}
              invalid={!!err('carYear')}
              invalidText={err('carYear')}
            >
              <SelectItem value="" text="" />
              {Array.from({ length: 2025 - 1960 + 1 }, (_, i) => 2025 - i).map(year => (
                <SelectItem key={year} value={year.toString()} text={year.toString()} />
              ))}
            </Select>
            <NumberInput
              id="carMileage"
              label="Mileage"
              min={0}
              max={999999}
              value={formData.carMileage}
              onChange={(e, { value }) => updateFormData('carMileage', value ?? 0)}
            />
            <NumberInput
              id="carMilesDriven"
              label="Miles driven per year"
              min={0}
              max={999999}
              value={formData.carMilesDriven}
              onChange={(e, { value }) => updateFormData('carMilesDriven', value ?? 0)}
            />
            <TextInput
              id="carVin"
              labelText="VIN (optional)"
              placeholder=""
              helperText="17 characters"
              value={formData.carVin}
              onChange={(e) => updateFormData('carVin', e.target.value)}
              invalid={!!err('carVin')}
              invalidText={err('carVin')}
            />
          </Stack>
        );

      // ── Home / Property Details ─────────────────────────────────────────
      case 'home':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Property Details</Heading>
            <p className="signup-step-description">Tell us about your home</p>
            <Select
              id="homeType"
              labelText="Home Type"
              value={formData.homeType}
              onChange={(e) => updateFormData('homeType', e.target.value)}
              invalid={!!err('homeType')}
              invalidText={err('homeType')}
            >
              <SelectItem value="" text="" />
              <SelectItem value="single-family" text="Single Family Home" />
              <SelectItem value="condo"         text="Condominium" />
              <SelectItem value="townhouse"     text="Townhouse" />
              <SelectItem value="apartment"     text="Apartment" />
              <SelectItem value="mobile"        text="Mobile Home" />
            </Select>
            <Select
              id="homeYear"
              labelText="Year Built"
              value={formData.homeYear}
              onChange={(e) => updateFormData('homeYear', e.target.value)}
              invalid={!!err('homeYear')}
              invalidText={err('homeYear')}
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
              onChange={(e, { value }) => updateFormData('homeSquareFeet', value ?? 1000)}
              helperText="We'll confirm this more accurately later"
            />
            <NumberInput
              id="homeValue"
              label="Estimated Home Value"
              min={10000}
              max={10000000}
              step={1000}
              value={formData.homeValue}
              onChange={(e, { value }) => updateFormData('homeValue', value ?? 1000)}
              helperText="We'll confirm this more accurately later"
            />
          </Stack>
        );

      // ── Coverage Preferences ──────────────────────────────────────────
      case 'coverage':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Coverage Preferences</Heading>
            <p className="signup-step-description">
              Choose your coverage level and deductible.
            </p>
            <div className={submitted && err('coverageLevel') ? 'signup-radio-invalid' : ''}>
              <RadioButtonGroup
                name="coverageLevel"
                legendText="Coverage Level"
                orientation="vertical"
                valueSelected={formData.coverageLevel}
                onChange={(value) => updateFormData('coverageLevel', value)}
              >
                <RadioButton labelText="Basic – Essential coverage at lower cost"    value="basic"    id="coverage-basic" />
                <RadioButton labelText="Standard – Recommended coverage for most"    value="standard" id="coverage-standard" />
                <RadioButton labelText="Premium – Comprehensive protection"          value="premium"  id="coverage-premium" />
              </RadioButtonGroup>
              {submitted && err('coverageLevel') && (
                <p className="signup-radio-error">{err('coverageLevel')}</p>
              )}
            </div>
            <Select
              id="deductible"
              labelText="Deductible"
              value={formData.deductible}
              onChange={(e) => updateFormData('deductible', e.target.value)}
              invalid={!!err('deductible')}
              invalidText={err('deductible')}
            >
              <SelectItem value=""    text="Select deductible" />
              <SelectItem value="250"  text="$250" />
              <SelectItem value="500"  text="$500" />
              <SelectItem value="1000" text="$1,000" />
              <SelectItem value="2500" text="$2,500" />
            </Select>

            <fieldset className="signup-checkbox-group">
              <legend className="cds--label">Additional Coverage (Optional)</legend>
              <Stack gap={3}>
                <Checkbox id="roadside" labelText="Roadside Assistance"
                  checked={formData.additionalCoverage.includes('roadside')}
                  onChange={(e) => handleCheckboxChange(e.target.checked, 'roadside')} />
                <Checkbox id="rental"   labelText="Rental Car Coverage"
                  checked={formData.additionalCoverage.includes('rental')}
                  onChange={(e) => handleCheckboxChange(e.target.checked, 'rental')} />
                <Checkbox id="gap"      labelText="Gap Insurance"
                  checked={formData.additionalCoverage.includes('gap')}
                  onChange={(e) => handleCheckboxChange(e.target.checked, 'gap')} />
              </Stack>
            </fieldset>
          </Stack>
        );

      // ── Review & Confirm ───────────────────────────────────────────────
      case 'review':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Review &amp; Confirm</Heading>
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
                <div>{formData.streetAddress}, {formData.city}, {formData.state} {formData.zipCode}</div>
              </div>
            </Tile>

            <Tile className="signup-review-section">
              <h4 className="signup-review-title">Insurance Type</h4>
              <div className="signup-review-grid">
                <div>
                  {formData.insuranceType === 'car'  && 'Car Insurance Only'}
                  {formData.insuranceType === 'home' && 'Home Insurance Only'}
                  {formData.insuranceType === 'both' && 'Car and Home Insurance'}
                </div>
              </div>
            </Tile>

            {(formData.insuranceType === 'car' || formData.insuranceType === 'both') && (
              <Tile className="signup-review-section">
                <h4 className="signup-review-title">Car Details</h4>
                <div className="signup-review-grid">
                  <div><strong>Vehicle:</strong> {formData.carYear} {formData.carMake} {formData.carModel}</div>
                  <div><strong>Mileage:</strong> {formData.carMileage?.toLocaleString()} mi</div>
                  <div><strong>Miles / year:</strong> {formData.carMilesDriven?.toLocaleString()}</div>
                </div>
              </Tile>
            )}

            {(formData.insuranceType === 'home' || formData.insuranceType === 'both') && (
              <Tile className="signup-review-section">
                <h4 className="signup-review-title">Property Details</h4>
                <div className="signup-review-grid">
                  <div><strong>Type:</strong> {formData.homeType}</div>
                  <div><strong>Size:</strong> {formData.homeSquareFeet?.toLocaleString()} sq ft</div>
                  <div><strong>Year Built:</strong> {formData.homeYear}</div>
                  <div><strong>Est. Value:</strong> ${formData.homeValue?.toLocaleString()}</div>
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
          </Stack>
        );

      default:
        return null;
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="signup-page">
      {/* Full-bleed header — spans the entire viewport width */}
      <header className="signup-header">
        <Heading className="signup-title">Sign Up for InsureCo</Heading>
        <p className="signup-subtitle">
          Get started with your insurance coverage in just a few steps
        </p>
      </header>

      {/* Centred content column */}
      <div className="signup-content-wrap">
        <Tile className="signup-progress">
          <ProgressIndicator currentIndex={currentStep} spaceEqually>
            {steps.map((step, index) => (
              <ProgressStep
                key={step.key}
                label={step.label}
                description={index < currentStep ? 'Complete' : index === currentStep ? 'Current' : ''}
                complete={index < currentStep}
                current={index === currentStep}
              />
            ))}
          </ProgressIndicator>
        </Tile>

        <Form className="signup-form" onSubmit={handleSubmit}>
          <Stack gap={7} className="signup-step-content">
            {renderStepContent()}
          </Stack>

          <Stack gap={5} orientation="horizontal" className="signup-actions">
            {currentStepData?.key === 'car' && (
              <Button kind="tertiary" onClick={() => navigate('/')} iconDescription="Cancel">
                Cancel
              </Button>
            )}

            {currentStep > 0 && (
              <Button kind="secondary" onClick={handleBack} renderIcon={ArrowLeft} iconDescription="Go back">
                Back
              </Button>
            )}

            <span className="signup-actions-spacer" />

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} renderIcon={ArrowRight} iconDescription="Continue">
                Next
              </Button>
            ) : (
              <Button type="submit" renderIcon={Checkmark} iconDescription="Submit">
                Complete Sign Up
              </Button>
            )}
          </Stack>
        </Form>
      </div>
    </div>
  );
}
