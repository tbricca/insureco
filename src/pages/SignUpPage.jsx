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
  DatePicker,
  DatePickerInput,
  Breadcrumb,
  BreadcrumbItem,
} from '@carbon/react';
import { ArrowRight, ArrowLeft, Checkmark, Car, Home as HomeIcon, WarningAlt } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import './SignUpPage.scss';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showWarning, setShowWarning] = useState(true);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
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
    insuranceType: '', // 'car', 'home', 'both'
    
    // Step 4: Car Details
    carMake: '',
    carModel: '',
    carYear: '',
    carMileage: 1000,
    carMilesPerYear: 1000,
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

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'streetAddress':
      case 'city':
      case 'state':
      case 'insuranceType':
      case 'carMake':
      case 'carModel':
      case 'carYear':
      case 'homeType':
      case 'homeYear':
      case 'coverageLevel':
      case 'deductible':
      case 'dateOfBirth':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          error = 'This field is required';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;
      case 'zipCode':
        if (!value) {
          error = 'Zip code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          error = 'Please enter a valid zip code (5 digits)';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleCheckboxChange = (checked, value) => {
    setFormData(prev => ({
      ...prev,
      additionalCoverage: checked
        ? [...prev.additionalCoverage, value]
        : prev.additionalCoverage.filter(item => item !== value),
    }));
  };

  // Determine which steps to show based on insurance type
  const getSteps = () => {
    const baseSteps = [
      { index: 0, label: 'Personal Info', key: 'personal' },
      { index: 1, label: 'Address', key: 'address' },
      { index: 2, label: 'Insurance Type', key: 'type' },
    ];

    const conditionalSteps = [];
    
    if (formData.insuranceType === 'car' || formData.insuranceType === 'both') {
      conditionalSteps.push({ index: 3, label: 'Car Details', key: 'car' });
    }
    
    if (formData.insuranceType === 'home' || formData.insuranceType === 'both') {
      conditionalSteps.push({ index: 4, label: 'Home Details', key: 'home' });
    }

    const finalSteps = [
      { index: 5, label: 'Coverage', key: 'coverage' },
      { index: 6, label: 'Review', key: 'review' },
    ];

    return [...baseSteps, ...conditionalSteps, ...finalSteps];
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowWarning(true);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowWarning(true);
      window.scrollTo(0, 0);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const confirmationNumber = `IC-${timestamp.toString().slice(-6)}-${random.toString().padStart(4, '0')}`;

    console.log('Form submitted:', formData);
    console.log('Confirmation Number:', confirmationNumber);

    navigate('/signup/confirmation', {
      state: { confirmationNumber }
    });
  };

  const isStepValid = () => {
    const stepFields = {
      personal: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'],
      address: ['streetAddress', 'city', 'state', 'zipCode'],
      type: ['insuranceType'],
      car: ['carMake', 'carModel', 'carYear'],
      home: ['homeType', 'homeYear'],
      coverage: ['coverageLevel', 'deductible'],
    };

    const currentKey = currentStepData?.key;
    if (!currentKey || currentKey === 'review') return true;

    const fieldsToValidate = stepFields[currentKey] || [];

    // Check if any required field is empty or has an error
    return fieldsToValidate.every(field => {
      const value = formData[field];
      const error = validateField(field, value);
      return value && !error;
    });
  };

  const getInvalidState = (field) => {
    const error = errors[field] || validateField(field, formData[field]);
    return touched[field] && !!error ? { invalid: true, invalidText: error } : {};
  };

  const renderStepContent = () => {
    switch (currentStepData?.key) {
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
              onBlur={() => handleBlur('firstName')}
              required
              {...getInvalidState('firstName')}
            />
            <TextInput
              id="lastName"
              labelText="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              required
              {...getInvalidState('lastName')}
            />
            <TextInput
              id="email"
              labelText="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              required
              {...getInvalidState('email')}
            />
            <TextInput
              id="phone"
              labelText="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              required
              {...getInvalidState('phone')}
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
              onClose={() => handleBlur('dateOfBirth')}
            >
              <DatePickerInput
                id="dateOfBirth"
                labelText="Date of Birth"
                placeholder="mm/dd/yyyy"
                value={formData.dateOfBirth}
                onBlur={() => handleBlur('dateOfBirth')}
                {...getInvalidState('dateOfBirth')}
              />
            </DatePicker>
          </Stack>
        );

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
              onBlur={() => handleBlur('streetAddress')}
              required
              {...getInvalidState('streetAddress')}
            />
            <TextInput
              id="city"
              labelText="City"
              placeholder="Your city"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              required
              {...getInvalidState('city')}
            />
            <Select
              id="state"
              labelText="State"
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
              onBlur={() => handleBlur('state')}
              required
              {...getInvalidState('state')}
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
              id="zipCode"
              labelText="Zip"
              placeholder="12345"
              value={formData.zipCode}
              onChange={(e) => updateFormData('zipCode', e.target.value)}
              onBlur={() => handleBlur('zipCode')}
              required
              {...getInvalidState('zipCode')}
            />
          </Stack>
        );

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
              <RadioTile
                id="insurance-car"
                value="car"
                className="signup-radio-tile"
              >
                <div className="signup-tile-content">
                  <div className="signup-tile-icon">
                    <Car size={30} />
                  </div>
                  <div className="signup-tile-text">
                    <h4 className="signup-tile-title">Car Insurance</h4>
                    <p className="signup-tile-desc">Get comprehensive coverage for your vehicle</p>
                  </div>
                </div>
              </RadioTile>

              <RadioTile
                id="insurance-home"
                value="home"
                className="signup-radio-tile"
              >
                <div className="signup-tile-content">
                  <div className="signup-tile-icon">
                    <HomeIcon size={30} />
                  </div>
                  <div className="signup-tile-text">
                    <h4 className="signup-tile-title">Home Insurance</h4>
                    <p className="signup-tile-desc">Protect your most important asset for your family</p>
                  </div>
                </div>
              </RadioTile>

              <RadioTile
                id="insurance-both"
                value="both"
                className="signup-radio-tile"
              >
                <div className="signup-tile-content">
                  <div className="signup-tile-icon signup-tile-icon--dual">
                    <Car size={30} />
                    <HomeIcon size={30} />
                  </div>
                  <div className="signup-tile-text">
                    <h4 className="signup-tile-title">Both Home and Car</h4>
                    <p className="signup-tile-desc">Insure both and get bundle savings</p>
                  </div>
                </div>
              </RadioTile>
            </TileGroup>
          </Stack>
        );

      case 'car':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Car Details</Heading>
            <p className="signup-step-description">
              Tell us about your car
            </p>
            <TextInput
              id="carMake"
              labelText="Make"
              placeholder="e.g. Toyota, Ford"
              value={formData.carMake}
              onChange={(e) => updateFormData('carMake', e.target.value)}
              onBlur={() => handleBlur('carMake')}
              required
              {...getInvalidState('carMake')}
            />
            <TextInput
              id="carModel"
              labelText="Model"
              placeholder="e.g. Corolla, Bronco"
              value={formData.carModel}
              onChange={(e) => updateFormData('carModel', e.target.value)}
              onBlur={() => handleBlur('carModel')}
              required
              {...getInvalidState('carModel')}
            />
            <Select
              id="carYear"
              labelText="Year"
              value={formData.carYear}
              onChange={(e) => updateFormData('carYear', e.target.value)}
              onBlur={() => handleBlur('carYear')}
              required
              {...getInvalidState('carYear')}
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
              step={1000}
              value={formData.carMileage}
              onChange={(e, { value }) => updateFormData('carMileage', value ?? 0)}
            />
            <NumberInput
              id="carMilesPerYear"
              label="Miles driven per year"
              min={0}
              max={100000}
              step={1000}
              value={formData.carMilesPerYear}
              onChange={(e, { value }) => updateFormData('carMilesPerYear', value ?? 0)}
            />
            <TextInput
              id="carVin"
              labelText="VIN (optional)"
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
            <Heading className="signup-step-heading">Property Details</Heading>
            <p className="signup-step-description">
              Tell us about your home
            </p>
            <Select
              id="homeType"
              labelText="Home Type"
              value={formData.homeType}
              onChange={(e) => updateFormData('homeType', e.target.value)}
              onBlur={() => handleBlur('homeType')}
              required
              {...getInvalidState('homeType')}
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
              onBlur={() => handleBlur('homeYear')}
              required
              {...getInvalidState('homeYear')}
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
              onChange={(e, { value }) => updateFormData('homeSquareFeet', value ?? 0)}
              helperText="We'll confirm this more accurately later"
            />
            <NumberInput
              id="homeValue"
              label="Estimated Home Value"
              min={10000}
              max={10000000}
              step={1000}
              value={formData.homeValue}
              onChange={(e, { value }) => updateFormData('homeValue', value ?? 0)}
              helperText="We'll confirm this more accurately later"
            />
          </Stack>
        );

      case 'coverage':
        return (
          <Stack gap={6}>
            <Heading className="signup-step-heading">Coverage Preferences</Heading>
            <p className="signup-step-description">
              Choose your coverage level and deductible.
            </p>
            <RadioButtonGroup
              name="coverageLevel"
              legendText="Coverage Level"
              orientation="vertical"
              valueSelected={formData.coverageLevel}
              onChange={(value) => updateFormData('coverageLevel', value)}
              {...getInvalidState('coverageLevel')}
            >
              <RadioButton
                labelText="Basic - Essential coverage at lower cost"
                value="basic"
                id="coverage-basic"
              />
              <RadioButton
                labelText="Standard - Recommended coverage for most"
                value="standard"
                id="coverage-standard"
              />
              <RadioButton
                labelText="Premium - Comprehensive protection"
                value="premium"
                id="coverage-premium"
              />
            </RadioButtonGroup>

            <Select
              id="deductible"
              labelText="Deductible"
              value={formData.deductible}
              onChange={(e) => updateFormData('deductible', e.target.value)}
              onBlur={() => handleBlur('deductible')}
              required
              {...getInvalidState('deductible')}
            >
              <SelectItem value="" text="Select deductible" />
              <SelectItem value="250" text="$250" />
              <SelectItem value="500" text="$500" />
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
                <div>
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <strong>Email:</strong> {formData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {formData.phone}
                </div>
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
                  <div>
                    <strong>Mileage:</strong> {formData.carMileage?.toLocaleString()} mi
                  </div>
                </div>
              </Tile>
            )}

            {(formData.insuranceType === 'home' || formData.insuranceType === 'both') && (
              <Tile className="signup-review-section">
                <h4 className="signup-review-title">Property Details</h4>
                <div className="signup-review-grid">
                  <div>
                    <strong>Type:</strong> {formData.homeType}
                  </div>
                  <div>
                    <strong>Size:</strong> {formData.homeSquareFeet} sq ft
                  </div>
                  <div>
                    <strong>Year Built:</strong> {formData.homeYear}
                  </div>
                </div>
              </Tile>
            )}

            <Tile className="signup-review-section">
              <h4 className="signup-review-title">Coverage</h4>
              <div className="signup-review-grid">
                <div>
                  <strong>Level:</strong> {formData.coverageLevel}
                </div>
                <div>
                  <strong>Deductible:</strong> ${formData.deductible}
                </div>
                {formData.additionalCoverage.length > 0 && (
                  <div>
                    <strong>Additional:</strong> {formData.additionalCoverage.join(', ')}
                  </div>
                )}
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
        {/* Top Navigation Breadcrumbs */}
        <div className="signup-top-nav">
          <Breadcrumb noTrailingSlash aria-label="Page navigation">
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              Sign Up
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* Red gradient header */}
        <header className="signup-header">
          <Heading className="signup-title">Sign Up for InsureCo</Heading>
          <p className="signup-subtitle">
            Get started with your insurance coverage in just a few steps
          </p>
        </header>

        {/* Step progress indicator */}
        <div className="signup-progress">
          <StepBreadcrumb
            steps={steps.map(s => ({ label: s.label, key: s.key }))}
            currentIndex={currentStep}
            spaceEqually
          />
        </div>

        {/* Warning banner — shown only on Car Details step */}
        {currentStepData?.key === 'car' && showWarning && (
          <div className="signup-warning-banner">
            <div className="signup-warning-banner__content">
              <WarningAlt size={16} className="signup-warning-banner__icon" />
              <span className="signup-warning-banner__text">This is a warning message</span>
            </div>
            <button
              className="signup-warning-banner__dismiss"
              onClick={() => setShowWarning(false)}
              type="button"
            >
              Dismiss
            </button>
          </div>
        )}

        <Form className="signup-form" onSubmit={handleSubmit}>
          <Stack gap={7} className="signup-step-content">
            {renderStepContent()}
          </Stack>

          <div className="signup-actions">
            {/* Cancel button only on car step */}
            {currentStepData?.key === 'car' && (
              <Button
                kind="tertiary"
                onClick={handleCancel}
                renderIcon={ArrowLeft}
                iconDescription="Cancel"
              >
                Cancel
              </Button>
            )}

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
          </div>
        </Form>
      </Column>
    </Grid>
  );
}
