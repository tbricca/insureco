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
  InlineNotification,
  Form,
  Stack,
} from '@carbon/react';
import {
  ArrowRight,
  ArrowLeft,
  Checkmark,
} from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import './SignUpPage.scss';

const CarGlyph = (props) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M27.5063 14.9437L20.2594 12.3375L17.2219 8.53125C16.9582 8.20912 16.6264 7.94952 16.2503 7.77118C15.8742 7.59285 15.4631 7.50023 15.0469 7.5H7.54688C7.08935 7.50236 6.63932 7.61631 6.2358 7.83196C5.83228 8.0476 5.48746 8.35844 5.23125 8.7375L2.69062 12.4875C2.16433 13.2587 1.88032 14.1695 1.875 15.1031V22.5C1.875 22.7486 1.97377 22.9871 2.14959 23.1629C2.3254 23.3387 2.56386 23.4375 2.8125 23.4375H4.81875C5.03464 24.2319 5.50594 24.9332 6.15993 25.4332C6.81393 25.9332 7.61428 26.2041 8.4375 26.2041C9.26072 26.2041 10.0611 25.9332 10.7151 25.4332C11.3691 24.9332 11.8404 24.2319 12.0562 23.4375H17.9437C18.1596 24.2319 18.6309 24.9332 19.2849 25.4332C19.9389 25.9332 20.7393 26.2041 21.5625 26.2041C22.3857 26.2041 23.1861 25.9332 23.8401 25.4332C24.4941 24.9332 24.9654 24.2319 25.1813 23.4375H27.1875C27.4361 23.4375 27.6746 23.3387 27.8504 23.1629C28.0262 22.9871 28.125 22.7486 28.125 22.5V15.825C28.1249 15.6323 28.0655 15.4444 27.9548 15.2867C27.844 15.129 27.6874 15.0093 27.5063 14.9437ZM8.4375 24.375C8.06666 24.375 7.70415 24.265 7.39581 24.059C7.08746 23.853 6.84714 23.5601 6.70523 23.2175C6.56331 22.8749 6.52618 22.4979 6.59853 22.1342C6.67087 21.7705 6.84945 21.4364 7.11167 21.1742C7.3739 20.912 7.70799 20.7334 8.07171 20.661C8.43542 20.5887 8.81242 20.6258 9.15503 20.7677C9.49764 20.9096 9.79048 21.15 9.99651 21.4583C10.2025 21.7666 10.3125 22.1292 10.3125 22.5C10.3125 22.9973 10.115 23.4742 9.76332 23.8258C9.41169 24.1775 8.93478 24.375 8.4375 24.375ZM21.5625 24.375C21.1917 24.375 20.8291 24.265 20.5208 24.059C20.2125 23.853 19.9721 23.5601 19.8302 23.2175C19.6883 22.8749 19.6512 22.4979 19.7235 22.1342C19.7959 21.7705 19.9745 21.4364 20.2367 21.1742C20.4989 20.912 20.833 20.7334 21.1967 20.661C21.5604 20.5887 21.9374 20.6258 22.28 20.7677C22.6226 20.9096 22.9155 21.15 23.1215 21.4583C23.3275 21.7666 23.4375 22.1292 23.4375 22.5C23.4375 22.9973 23.24 23.4742 22.8883 23.8258C22.5367 24.1775 22.0598 24.375 21.5625 24.375ZM26.25 21.5625H25.1813C24.9654 20.7681 24.4941 20.0668 23.8401 19.5668C23.1861 19.0668 22.3857 18.7959 21.5625 18.7959C20.7393 18.7959 19.9389 19.0668 19.2849 19.5668C18.6309 20.0668 18.1596 20.7681 17.9437 21.5625H12.0562C11.8404 20.7681 11.3691 20.0668 10.7151 19.5668C10.0611 19.0668 9.26072 18.7959 8.4375 18.7959C7.61428 18.7959 6.81393 19.0668 6.15993 19.5668C5.50594 20.0668 5.03464 20.7681 4.81875 21.5625H3.75V15.1031C3.74964 14.538 3.91952 13.9859 4.2375 13.5188L6.77812 9.76875C6.86622 9.64498 6.98307 9.54448 7.11862 9.47589C7.25417 9.4073 7.40435 9.37268 7.55625 9.375H15.0562C15.194 9.37478 15.3301 9.4049 15.4548 9.46323C15.5796 9.52157 15.69 9.60667 15.7781 9.7125L18.9656 13.7156C19.0756 13.8489 19.2175 13.9521 19.3781 14.0156L26.25 16.4813V21.5625Z" fill="currentColor" />
  </svg>
);

const HomeGlyph = (props) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15.574 2.07551C15.4076 1.94565 15.2026 1.87512 14.9915 1.87512C14.7804 1.87512 14.5754 1.94565 14.409 2.07551L0.9375 12.5808L2.10253 14.0542L3.75 12.7697V24.3751C3.75102 24.872 3.94889 25.3484 4.3003 25.6998C4.65171 26.0512 5.12803 26.249 5.625 26.2501H24.375C24.872 26.2491 25.3484 26.0513 25.6998 25.6999C26.0512 25.3484 26.2491 24.8721 26.25 24.3751V12.7782L27.8975 14.0626L29.0625 12.589L15.574 2.07551ZM16.875 24.3751H13.125V16.8751H16.875V24.3751ZM18.75 24.3751V16.8751C18.7494 16.378 18.5517 15.9014 18.2002 15.5499C17.8487 15.1984 17.3721 15.0006 16.875 15.0001H13.125C12.6279 15.0006 12.1512 15.1983 11.7997 15.5498C11.4482 15.9013 11.2505 16.3779 11.25 16.8751V24.3751H5.625V11.3077L15 4.0046L24.375 11.3176V24.3751H18.75Z" fill="currentColor" />
  </svg>
);

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
  carMileage: '',
  carMilesPerYear: '',
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
  const [carWarningDismissed, setCarWarningDismissed] = useState(false);

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
        <p className="signup-step__description">Let us know where you live</p>
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
            placeholder="Your city"
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
              labelText="Zip"
              placeholder="(555) 123-4567"
              value={formData.zipCode}
              onChange={(e) => update('zipCode', e.target.value)}
              size="lg"
            />
          </div>
        </Stack>
      </Form>
    </div>
  );

  const renderInsuranceType = () => {
    const options = [
      {
        value: INSURANCE_TYPES.CAR,
        title: 'Car Insurance',
        description: 'Get comprehensive coverage for your vehicle',
        icon: <CarGlyph className="signup-insurance-tile__icon" />,
      },
      {
        value: INSURANCE_TYPES.HOME,
        title: 'Home Insurance',
        description: 'Protect your most important asset for your family',
        icon: <HomeGlyph className="signup-insurance-tile__icon" />,
      },
      {
        value: INSURANCE_TYPES.BOTH,
        title: 'Both Home and Car',
        description: 'Insure both and get bundle savings',
        icon: (
          <span className="signup-insurance-tile__dual-icons">
            <CarGlyph className="signup-insurance-tile__icon" />
            <HomeGlyph className="signup-insurance-tile__icon" />
          </span>
        ),
      },
    ];

    return (
      <div className="signup-step">
        <div className="signup-step__header">
          <h2 className="signup-step__title">What Will You Insure</h2>
          <p className="signup-step__description">Which insurance coverage are you looking for</p>
        </div>
        <div className="signup-insurance-tiles" role="radiogroup" aria-label="Insurance type">
          {options.map((option) => {
            const selected = formData.insuranceType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`signup-insurance-tile${selected ? ' signup-insurance-tile--selected' : ''}`}
                onClick={() => update('insuranceType', option.value)}
              >
                {option.icon}
                <span className="signup-insurance-tile__text">
                  <span className="signup-insurance-tile__title">{option.title}</span>
                  <span className="signup-insurance-tile__desc">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCarDetails = () => (
    <div className="signup-step">
      {!carWarningDismissed && (
        <InlineNotification
          kind="warning"
          title="This is a warning message"
          onCloseButtonClick={() => setCarWarningDismissed(true)}
          aria-label="Dismiss warning notification"
          statusIconDescription="warning"
          className="signup-step__warning"
          lowContrast
        />
      )}
      <div className="signup-step__header">
        <h2 className="signup-step__title">Car Details</h2>
        <p className="signup-step__description">Tell us about your car</p>
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
            <SelectItem value="" text="" />
            {CAR_YEARS.map((y) => (
              <SelectItem key={y} value={y} text={y} />
            ))}
          </Select>
          <NumberInput
            id="carMileage"
            label="Mileage"
            value={formData.carMileage}
            onChange={(e, { value }) => update('carMileage', value)}
            min={0}
            step={1000}
            size="lg"
          />
          <NumberInput
            id="carMilesPerYear"
            label="Miles driven per year"
            value={formData.carMilesPerYear}
            onChange={(e, { value }) => update('carMilesPerYear', value)}
            min={0}
            step={1000}
            size="lg"
          />
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
        <h2 className="signup-step__title">Property Details</h2>
        <p className="signup-step__description">Tell us about your property</p>
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
            <SelectItem value="" text="" />
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
            <SelectItem value="" text="" />
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
          <NumberInput
            id="homeValue"
            label="Estimated Home Value"
            helperText="We'll confirm this more accurately later"
            value={formData.homeValue}
            onChange={(e, { value }) => update('homeValue', value)}
            min={0}
            step={1000}
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
          <div className="signup-nav__spacer" />
          {currentStepKey === 'car-details' && (
            <Button
              kind="tertiary"
              size="lg"
              renderIcon={ArrowLeft}
              onClick={() => navigate('/dashboard')}
              className="signup-nav__cancel"
            >
              Cancel
            </Button>
          )}
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
