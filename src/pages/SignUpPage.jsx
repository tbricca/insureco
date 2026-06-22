import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Select,
  SelectItem,
  NumberInput,
  Button,
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import { ArrowLeft, ArrowRight } from '@carbon/icons-react';
import StepBreadcrumb from '../components/StepBreadcrumb';
import { calculateEstimate } from '../utils/quoteEstimator';
import './SignUpPage.scss';

// ─── Constants ────────────────────────────────────────────────────────────────

const COVERAGE_OPTIONS = [
  {
    id: 'car',
    title: 'Car Insurance',
    description: 'Get comprehensive coverage for your vehicle',
    icon: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27.5063 14.9437L20.2594 12.3375L17.2219 8.53125C16.9582 8.20912 16.6264 7.94952 16.2503 7.77118C15.8742 7.59285 15.4631 7.50023 15.0469 7.5H7.54688C7.08935 7.50236 6.63932 7.61631 6.2358 7.83196C5.83228 8.0476 5.48746 8.35844 5.23125 8.7375L2.69062 12.4875C2.16433 13.2587 1.88032 14.1695 1.875 15.1031V22.5C1.875 22.7486 1.97377 22.9871 2.14959 23.1629C2.3254 23.3387 2.56386 23.4375 2.8125 23.4375H4.81875C5.03464 24.2319 5.50594 24.9332 6.15993 25.4332C6.81393 25.9332 7.61428 26.2041 8.4375 26.2041C9.26072 26.2041 10.0611 25.9332 10.7151 25.4332C11.3691 24.9332 11.8404 24.2319 12.0562 23.4375H17.9437C18.1596 24.2319 18.6309 24.9332 19.2849 25.4332C19.9389 25.9332 20.7393 26.2041 21.5625 26.2041C22.3857 26.2041 23.1861 25.9332 23.8401 25.4332C24.4941 24.9332 24.9654 24.2319 25.1813 23.4375H27.1875C27.4361 23.4375 27.6746 23.3387 27.8504 23.1629C28.0262 22.9871 28.125 22.7486 28.125 22.5V15.825C28.1249 15.6323 28.0655 15.4444 27.9548 15.2867C27.844 15.129 27.6874 15.0093 27.5063 14.9437ZM8.4375 24.375C8.06666 24.375 7.70415 24.265 7.39581 24.059C7.08746 23.853 6.84714 23.5601 6.70523 23.2175C6.56331 22.8749 6.52618 22.4979 6.59853 22.1342C6.67087 21.7705 6.84945 21.4364 7.11167 21.1742C7.3739 20.912 7.70799 20.7334 8.07171 20.661C8.43542 20.5887 8.81242 20.6258 9.15503 20.7677C9.49764 20.9096 9.79048 21.15 9.99651 21.4583C10.2025 21.7666 10.3125 22.1292 10.3125 22.5C10.3125 22.9973 10.115 23.4742 9.76332 23.8258C9.41169 24.1775 8.93478 24.375 8.4375 24.375ZM21.5625 24.375C21.1917 24.375 20.8291 24.265 20.5208 24.059C20.2125 23.853 19.9721 23.5601 19.8302 23.2175C19.6883 22.8749 19.6512 22.4979 19.7235 22.1342C19.7959 21.7705 19.9745 21.4364 20.2367 21.1742C20.4989 20.912 20.833 20.7334 21.1967 20.661C21.5604 20.5887 21.9374 20.6258 22.28 20.7677C22.6226 20.9096 22.9155 21.15 23.1215 21.4583C23.3275 21.7666 23.4375 22.1292 23.4375 22.5C23.4375 22.9973 23.24 23.4742 22.8883 23.8258C22.5367 24.1775 22.0598 24.375 21.5625 24.375ZM26.25 21.5625H25.1813C24.9654 20.7681 24.4941 20.0668 23.8401 19.5668C23.1861 19.0668 22.3857 18.7959 21.5625 18.7959C20.7393 18.7959 19.9389 19.0668 19.2849 19.5668C18.6309 20.0668 18.1596 20.7681 17.9437 21.5625H12.0562C11.8404 20.7681 11.3691 20.0668 10.7151 19.5668C10.0611 19.0668 9.26072 18.7959 8.4375 18.7959C7.61428 18.7959 6.81393 19.0668 6.15993 19.5668C5.50594 20.0668 5.03464 20.7681 4.81875 21.5625H3.75V15.1031C3.74964 14.538 3.91952 13.9859 4.2375 13.5188L6.77812 9.76875C6.86622 9.64498 6.98307 9.54448 7.11862 9.47589C7.25417 9.4073 7.40435 9.37268 7.55625 9.375H15.0562C15.194 9.37478 15.3301 9.4049 15.4548 9.46323C15.5796 9.52157 15.69 9.60667 15.7781 9.7125L18.9656 13.7156C19.0756 13.8489 19.2175 13.9521 19.3781 14.0156L26.25 16.4813V21.5625Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'home',
    title: 'Home Insurance',
    description: 'Protect your most important asset for your family',
    icon: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.574 2.07551C15.4076 1.94565 15.2026 1.87512 14.9915 1.87512C14.7804 1.87512 14.5754 1.94565 14.409 2.07551L0.9375 12.5808L2.10253 14.0542L3.75 12.7697V24.3751C3.75102 24.872 3.94889 25.3484 4.3003 25.6998C4.65171 26.0512 5.12803 26.249 5.625 26.2501H24.375C24.872 26.2491 25.3484 26.0513 25.6998 25.6999C26.0512 25.3484 26.2491 24.8721 26.25 24.3751V12.7782L27.8975 14.0626L29.0625 12.589L15.574 2.07551ZM16.875 24.3751H13.125V16.8751H16.875V24.3751ZM18.75 24.3751V16.8751C18.7494 16.378 18.5517 15.9014 18.2002 15.5499C17.8487 15.1984 17.3721 15.0006 16.875 15.0001H13.125C12.6279 15.0006 12.1512 15.1983 11.7997 15.5498C11.4482 15.9013 11.2505 16.3779 11.25 16.8751V24.3751H5.625V11.3077L15 4.0046L24.375 11.3176V24.3751H18.75Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'both',
    title: 'Both Home and Car',
    description: 'Insure both and get bundle savings',
    icons: (
      <>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M27.5063 14.9437L20.2594 12.3375L17.2219 8.53125C16.9582 8.20912 16.6264 7.94952 16.2503 7.77118C15.8742 7.59285 15.4631 7.50023 15.0469 7.5H7.54688C7.08935 7.50236 6.63932 7.61631 6.2358 7.83196C5.83228 8.0476 5.48746 8.35844 5.23125 8.7375L2.69062 12.4875C2.16433 13.2587 1.88032 14.1695 1.875 15.1031V22.5C1.875 22.7486 1.97377 22.9871 2.14959 23.1629C2.3254 23.3387 2.56386 23.4375 2.8125 23.4375H4.81875C5.03464 24.2319 5.50594 24.9332 6.15993 25.4332C6.81393 25.9332 7.61428 26.2041 8.4375 26.2041C9.26072 26.2041 10.0611 25.9332 10.7151 25.4332C11.3691 24.9332 11.8404 24.2319 12.0562 23.4375H17.9437C18.1596 24.2319 18.6309 24.9332 19.2849 25.4332C19.9389 25.9332 20.7393 26.2041 21.5625 26.2041C22.3857 26.2041 23.1861 25.9332 23.8401 25.4332C24.4941 24.9332 24.9654 24.2319 25.1813 23.4375H27.1875C27.4361 23.4375 27.6746 23.3387 27.8504 23.1629C28.0262 22.9871 28.125 22.7486 28.125 22.5V15.825C28.1249 15.6323 28.0655 15.4444 27.9548 15.2867C27.844 15.129 27.6874 15.0093 27.5063 14.9437ZM8.4375 24.375C8.06666 24.375 7.70415 24.265 7.39581 24.059C7.08746 23.853 6.84714 23.5601 6.70523 23.2175C6.56331 22.8749 6.52618 22.4979 6.59853 22.1342C6.67087 21.7705 6.84945 21.4364 7.11167 21.1742C7.3739 20.912 7.70799 20.7334 8.07171 20.661C8.43542 20.5887 8.81242 20.6258 9.15503 20.7677C9.49764 20.9096 9.79048 21.15 9.99651 21.4583C10.2025 21.7666 10.3125 22.1292 10.3125 22.5C10.3125 22.9973 10.115 23.4742 9.76332 23.8258C9.41169 24.1775 8.93478 24.375 8.4375 24.375ZM21.5625 24.375C21.1917 24.375 20.8291 24.265 20.5208 24.059C20.2125 23.853 19.9721 23.5601 19.8302 23.2175C19.6883 22.8749 19.6512 22.4979 19.7235 22.1342C19.7959 21.7705 19.9745 21.4364 20.2367 21.1742C20.4989 20.912 20.833 20.7334 21.1967 20.661C21.5604 20.5887 21.9374 20.6258 22.28 20.7677C22.6226 20.9096 22.9155 21.15 23.1215 21.4583C23.3275 21.7666 23.4375 22.1292 23.4375 22.5C23.4375 22.9973 23.24 23.4742 22.8883 23.8258C22.5367 24.1775 22.0598 24.375 21.5625 24.375ZM26.25 21.5625H25.1813C24.9654 20.7681 24.4941 20.0668 23.8401 19.5668C23.1861 19.0668 22.3857 18.7959 21.5625 18.7959C20.7393 18.7959 19.9389 19.0668 19.2849 19.5668C18.6309 20.0668 18.1596 20.7681 17.9437 21.5625H12.0562C11.8404 20.7681 11.3691 20.0668 10.7151 19.5668C10.0611 19.0668 9.26072 18.7959 8.4375 18.7959C7.61428 18.7959 6.81393 19.0668 6.15993 19.5668C5.50594 20.0668 5.03464 20.7681 4.81875 21.5625H3.75V15.1031C3.74964 14.538 3.91952 13.9859 4.2375 13.5188L6.77812 9.76875C6.86622 9.64498 6.98307 9.54448 7.11862 9.47589C7.25417 9.4073 7.40435 9.37268 7.55625 9.375H15.0562C15.194 9.37478 15.3301 9.4049 15.4548 9.46323C15.5796 9.52157 15.69 9.60667 15.7781 9.7125L18.9656 13.7156C19.0756 13.8489 19.2175 13.9521 19.3781 14.0156L26.25 16.4813V21.5625Z" fill="currentColor"/>
        </svg>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.574 2.07551C15.4076 1.94565 15.2026 1.87512 14.9915 1.87512C14.7804 1.87512 14.5754 1.94565 14.409 2.07551L0.9375 12.5808L2.10253 14.0542L3.75 12.7697V24.3751C3.75102 24.872 3.94889 25.3484 4.3003 25.6998C4.65171 26.0512 5.12803 26.249 5.625 26.2501H24.375C24.872 26.2491 25.3484 26.0513 25.6998 25.6999C26.0512 25.3484 26.2491 24.8721 26.25 24.3751V12.7782L27.8975 14.0626L29.0625 12.589L15.574 2.07551ZM16.875 24.3751H13.125V16.8751H16.875V24.3751ZM18.75 24.3751V16.8751C18.7494 16.378 18.5517 15.9014 18.2002 15.5499C17.8487 15.1984 17.3721 15.0006 16.875 15.0001H13.125C12.6279 15.0006 12.1512 15.1983 11.7997 15.5498C11.4482 15.9013 11.2505 16.3779 11.25 16.8751V24.3751H5.625V11.3077L15 4.0046L24.375 11.3176V24.3751H18.75Z" fill="currentColor"/>
        </svg>
      </>
    ),
  },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const CAR_YEARS = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => String(2025 - i));
const HOME_YEARS = Array.from({ length: 2025 - 1800 + 1 }, (_, i) => String(2025 - i));
const HOME_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Mobile Home'];

// ─── Validation Rules ──────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const ZIP_RE   = /^\d{5}(-\d{4})?$/;
const DOB_RE   = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

function validatePersonal(data) {
  const errors = {};
  if (!data.firstName.trim())   errors.firstName   = 'First name is required';
  if (!data.lastName.trim())    errors.lastName    = 'Last name is required';
  if (!data.email.trim())       errors.email       = 'Email address is required';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'Enter a valid email address';
  if (!data.phone.trim())       errors.phone       = 'Phone number is required';
  else if (!PHONE_RE.test(data.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number';
  if (!data.dob.trim())         errors.dob         = 'Date of birth is required';
  else if (!DOB_RE.test(data.dob.trim())) errors.dob = 'Enter a valid date (mm/dd/yyyy)';
  else {
    const parsed = new Date(data.dob);
    const now = new Date();
    const age = now.getFullYear() - parsed.getFullYear();
    if (age < 18) errors.dob = 'You must be at least 18 years old';
    if (parsed > now) errors.dob = 'Date of birth cannot be in the future';
  }
  return errors;
}

function validateAddress(data) {
  const errors = {};
  if (!data.streetAddress.trim()) errors.streetAddress = 'Street address is required';
  if (!data.city.trim())          errors.city          = 'City is required';
  if (!data.state)                errors.state         = 'State is required';
  if (!data.zip.trim())           errors.zip           = 'ZIP code is required';
  else if (!ZIP_RE.test(data.zip.trim())) errors.zip   = 'Enter a valid 5-digit ZIP code';
  return errors;
}

function validateCar(data) {
  const errors = {};
  if (!data.make.trim())  errors.make  = 'Vehicle make is required';
  if (!data.model.trim()) errors.model = 'Vehicle model is required';
  if (!data.year)         errors.year  = 'Vehicle year is required';
  if (!data.mileage || Number(data.mileage) <= 0) errors.mileage = 'Enter a valid mileage (must be greater than 0)';
  if (!data.milesPerYear || Number(data.milesPerYear) <= 0) errors.milesPerYear = 'Enter annual mileage greater than 0';
  if (data.vin && data.vin.trim().length !== 17) errors.vin = 'VIN must be exactly 17 characters';
  return errors;
}

function validateProperty(data) {
  const errors = {};
  if (!data.homeType)  errors.homeType  = 'Home type is required';
  if (!data.yearBuilt) errors.yearBuilt = 'Year built is required';
  if (!data.squareFeet || Number(data.squareFeet) <= 0) errors.squareFeet = 'Enter a valid square footage greater than 0';
  if (!data.homeValue  || Number(data.homeValue)  <= 0) errors.homeValue  = 'Enter a valid estimated home value greater than 0';
  return errors;
}

// ─── Step Definitions ──────────────────────────────────────────────────────────

function getSteps(coverage) {
  const base = [
    { key: 'coverage', label: 'Coverage' },
    { key: 'personal', label: 'Personal Info' },
    { key: 'address',  label: 'Address' },
  ];
  if (coverage === 'car'  || coverage === 'both') base.push({ key: 'car',  label: 'Car Details' });
  if (coverage === 'home' || coverage === 'both') base.push({ key: 'home', label: 'Property Details' });
  return base;
}

// ─── Step Components ───────────────────────────────────────────────────────────

function CoverageStep({ selected, onChange, error }) {
  return (
    <div className="signup-form-section">
      <div className="signup-form-header">
        <h2 className="signup-form-title">What Will You Insure</h2>
      </div>
      <p className="signup-form-description">Which insurance coverage are you looking for</p>
      {error && <p className="signup-coverage-error">{error}</p>}
      <div className="signup-coverage-options">
        {COVERAGE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`signup-coverage-tile ${selected === option.id ? 'signup-coverage-tile--selected' : ''}`}
            onClick={() => onChange(option.id)}
          >
            <div className="signup-coverage-tile__icons">
              {option.icons || option.icon}
            </div>
            <div className="signup-coverage-tile__text">
              <span className="signup-coverage-tile__title">{option.title}</span>
              <span className="signup-coverage-tile__description">{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PersonalInfoStep({ data, onChange, errors }) {
  return (
    <div className="signup-form-section">
      <div className="signup-form-header">
        <h2 className="signup-form-title">Personal Information</h2>
      </div>
      <p className="signup-form-description">Let's start with some basic information about you.</p>
      <div className="signup-fields">
        <TextInput
          id="firstName"
          labelText="First Name"
          placeholder="Enter your first name"
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          invalid={!!errors.firstName}
          invalidText={errors.firstName}
          size="lg"
        />
        <TextInput
          id="lastName"
          labelText="Last Name"
          placeholder="Enter your last name"
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          invalid={!!errors.lastName}
          invalidText={errors.lastName}
          size="lg"
        />
        <TextInput
          id="email"
          labelText="Email Address"
          placeholder="your.email@example.com"
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          invalid={!!errors.email}
          invalidText={errors.email}
          size="lg"
        />
        <TextInput
          id="phone"
          labelText="Phone Number"
          placeholder="(555) 123-4567"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          invalid={!!errors.phone}
          invalidText={errors.phone}
          size="lg"
        />
        <DatePicker
          datePickerType="single"
          dateFormat="m/d/Y"
          onChange={(dates) => {
            if (dates[0]) {
              const d = dates[0];
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              const yyyy = d.getFullYear();
              onChange('dob', `${mm}/${dd}/${yyyy}`);
            }
          }}
        >
          <DatePickerInput
            id="dob"
            labelText="Date of Birth"
            placeholder="mm/dd/yyyy"
            size="lg"
            invalid={!!errors.dob}
            invalidText={errors.dob}
          />
        </DatePicker>
      </div>
    </div>
  );
}

function AddressStep({ data, onChange, errors }) {
  return (
    <div className="signup-form-section">
      <div className="signup-form-header">
        <h2 className="signup-form-title">Your Address</h2>
      </div>
      <p className="signup-form-description">Let us know where you live</p>
      <div className="signup-fields">
        <TextInput
          id="streetAddress"
          labelText="Street Address"
          placeholder="123 Main Street"
          value={data.streetAddress}
          onChange={(e) => onChange('streetAddress', e.target.value)}
          invalid={!!errors.streetAddress}
          invalidText={errors.streetAddress}
          size="lg"
        />
        <TextInput
          id="city"
          labelText="City"
          placeholder="Your city"
          value={data.city}
          onChange={(e) => onChange('city', e.target.value)}
          invalid={!!errors.city}
          invalidText={errors.city}
          size="lg"
        />
        <Select
          id="state"
          labelText="State"
          value={data.state}
          onChange={(e) => onChange('state', e.target.value)}
          invalid={!!errors.state}
          invalidText={errors.state}
          size="lg"
        >
          <SelectItem value="" text="" />
          {US_STATES.map((s) => (
            <SelectItem key={s} value={s} text={s} />
          ))}
        </Select>
        <TextInput
          id="zip"
          labelText="Zip"
          placeholder="12345"
          value={data.zip}
          onChange={(e) => onChange('zip', e.target.value)}
          invalid={!!errors.zip}
          invalidText={errors.zip}
          size="lg"
        />
      </div>
    </div>
  );
}

function CarDetailsStep({ data, onChange, errors, showWarning, onDismissWarning }) {
  return (
    <div className="signup-form-section">
      {showWarning && (
        <div className="signup-warning-banner">
          <div className="signup-warning-banner__content">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0)">
                <path d="M8.125 5.647V8.784M8.125 10.667H8.131M14.4 8C14.4 11.465 11.59 14.275 8.125 14.275C4.66 14.275 1.85 11.465 1.85 8C1.85 4.535 4.66 1.725 8.125 1.725C11.59 1.725 14.4 4.535 14.4 8Z" stroke="#946C00" strokeWidth="1.882" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs><clipPath id="clip0"><rect width="16" height="16" fill="white"/></clipPath></defs>
            </svg>
            <span>Please double-check your vehicle information before proceeding.</span>
          </div>
          <button type="button" className="signup-warning-banner__dismiss" onClick={onDismissWarning}>
            Dismiss
          </button>
        </div>
      )}
      <div className="signup-form-header">
        <h2 className="signup-form-title">Car Details</h2>
      </div>
      <p className="signup-form-description">Tell us about your car</p>
      <div className="signup-fields">
        <TextInput
          id="carMake"
          labelText="Make"
          placeholder="e.g. Toyota, Ford"
          value={data.make}
          onChange={(e) => onChange('make', e.target.value)}
          invalid={!!errors.make}
          invalidText={errors.make}
          size="lg"
        />
        <TextInput
          id="carModel"
          labelText="Model"
          placeholder="e.g. Corolla, Bronco"
          value={data.model}
          onChange={(e) => onChange('model', e.target.value)}
          invalid={!!errors.model}
          invalidText={errors.model}
          size="lg"
        />
        <Select
          id="carYear"
          labelText="Year"
          value={data.year}
          onChange={(e) => onChange('year', e.target.value)}
          invalid={!!errors.year}
          invalidText={errors.year}
          size="lg"
        >
          <SelectItem value="" text="" />
          {CAR_YEARS.map((y) => (
            <SelectItem key={y} value={y} text={y} />
          ))}
        </Select>
        <NumberInput
          id="mileage"
          label="Mileage"
          value={data.mileage}
          min={0}
          step={1000}
          onChange={(e, { value } = {}) => onChange('mileage', value ?? e.target.value)}
          invalid={!!errors.mileage}
          invalidText={errors.mileage}
          size="lg"
        />
        <NumberInput
          id="milesPerYear"
          label="Miles driven per year"
          value={data.milesPerYear}
          min={0}
          step={1000}
          onChange={(e, { value } = {}) => onChange('milesPerYear', value ?? e.target.value)}
          invalid={!!errors.milesPerYear}
          invalidText={errors.milesPerYear}
          size="lg"
        />
        <TextInput
          id="vin"
          labelText="VIN (optional)"
          placeholder=""
          helperText="17 characters"
          value={data.vin}
          onChange={(e) => onChange('vin', e.target.value)}
          invalid={!!errors.vin}
          invalidText={errors.vin}
          size="lg"
        />
      </div>
    </div>
  );
}

function PropertyDetailsStep({ data, onChange, errors }) {
  return (
    <div className="signup-form-section">
      <div className="signup-form-header">
        <h2 className="signup-form-title">Property Details</h2>
      </div>
      <p className="signup-form-description">Tell us about your home</p>
      <div className="signup-fields">
        <Select
          id="homeType"
          labelText="Home Type"
          value={data.homeType}
          onChange={(e) => onChange('homeType', e.target.value)}
          invalid={!!errors.homeType}
          invalidText={errors.homeType}
          size="lg"
        >
          <SelectItem value="" text="" />
          {HOME_TYPES.map((t) => (
            <SelectItem key={t} value={t} text={t} />
          ))}
        </Select>
        <Select
          id="yearBuilt"
          labelText="Year Built"
          value={data.yearBuilt}
          onChange={(e) => onChange('yearBuilt', e.target.value)}
          invalid={!!errors.yearBuilt}
          invalidText={errors.yearBuilt}
          size="lg"
        >
          <SelectItem value="" text="" />
          {HOME_YEARS.map((y) => (
            <SelectItem key={y} value={y} text={y} />
          ))}
        </Select>
        <NumberInput
          id="squareFeet"
          label="Square Feet"
          helperText="We'll confirm this more accurately later"
          value={data.squareFeet}
          min={0}
          step={100}
          onChange={(e, { value } = {}) => onChange('squareFeet', value ?? e.target.value)}
          invalid={!!errors.squareFeet}
          invalidText={errors.squareFeet}
          size="lg"
        />
        <NumberInput
          id="homeValue"
          label="Estimated Home Value"
          helperText="We'll confirm this more accurately later"
          value={data.homeValue}
          min={0}
          step={10000}
          onChange={(e, { value } = {}) => onChange('homeValue', value ?? e.target.value)}
          invalid={!!errors.homeValue}
          invalidText={errors.homeValue}
          size="lg"
        />
      </div>
    </div>
  );
}

// ─── Quote Estimate Panel ────────────────────────────────────────────────────

function QuoteEstimatePanel({ estimate, coverage }) {
  if (!coverage || coverage === '') return null;

  const hasRange = estimate && !estimate.isPartial;

  return (
    <div className="quote-estimate-panel">
      <div className="quote-estimate-panel__label-group">
        {/* Tag icon */}
        <svg className="quote-estimate-panel__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.9375 1H9.0625C8.89674 1 8.73777 1.06585 8.62056 1.18306L1.68306 8.12056C1.44868 8.35493 1.44868 8.73507 1.68306 8.96944L6.03056 13.3169C6.26493 13.5513 6.64507 13.5513 6.87944 13.3169L13.8169 6.37944C13.9342 6.26223 14 6.10326 14 5.9375V1.0625C14 1.02772 13.9723 1 13.9375 1ZM11.5 4.75C11.0858 4.75 10.75 4.41421 10.75 4C10.75 3.58579 11.0858 3.25 11.5 3.25C11.9142 3.25 12.25 3.58579 12.25 4C12.25 4.41421 11.9142 4.75 11.5 4.75Z" fill="currentColor"/>
        </svg>
        <span className="quote-estimate-panel__label">Estimated Monthly Premium</span>
      </div>
      <div className="quote-estimate-panel__price">
        {hasRange
          ? <>${estimate.low} &ndash; ${estimate.high}<span className="quote-estimate-panel__per-mo">/mo</span></>
          : <>Starting from ${estimate?.base ?? '--'}<span className="quote-estimate-panel__per-mo">/mo</span></>}
      </div>
      {!hasRange && (
        <span className="quote-estimate-panel__note">Updates as you fill in details</span>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const navigate = useNavigate();

  const [coverage, setCoverage]               = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showWarning, setShowWarning]          = useState(true);

  const [personalData, setPersonalData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '',
  });
  const [addressData, setAddressData] = useState({
    streetAddress: '', city: '', state: '', zip: '',
  });
  const [carData, setCarData] = useState({
    make: '', model: '', year: '', mileage: 1000, milesPerYear: 1000, vin: '',
  });
  const [propertyData, setPropertyData] = useState({
    homeType: '', yearBuilt: '', squareFeet: 1000, homeValue: 1000,
  });

  // Per-step error state
  const [personalErrors,  setPersonalErrors]  = useState({});
  const [addressErrors,   setAddressErrors]   = useState({});
  const [carErrors,       setCarErrors]       = useState({});
  const [propertyErrors,  setPropertyErrors]  = useState({});
  const [coverageError,   setCoverageError]   = useState('');

  const steps       = getSteps(coverage);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep  = currentStepIndex === steps.length - 1;

  // ── Validate current step and return whether it passed ──
  function validateCurrentStep() {
    switch (currentStep?.key) {
      case 'coverage': {
        if (!coverage) {
          setCoverageError('Please select a coverage type to continue');
          return false;
        }
        setCoverageError('');
        return true;
      }
      case 'personal': {
        const errs = validatePersonal(personalData);
        setPersonalErrors(errs);
        return Object.keys(errs).length === 0;
      }
      case 'address': {
        const errs = validateAddress(addressData);
        setAddressErrors(errs);
        return Object.keys(errs).length === 0;
      }
      case 'car': {
        const errs = validateCar(carData);
        setCarErrors(errs);
        return Object.keys(errs).length === 0;
      }
      case 'home': {
        const errs = validateProperty(propertyData);
        setPropertyErrors(errs);
        return Object.keys(errs).length === 0;
      }
      default:
        return true;
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    if (isLastStep) {
      navigate('/dashboard');
    } else {
      setCurrentStepIndex((i) => i + 1);
    }
  }

  function handleBack() {
    setCurrentStepIndex((i) => i - 1);
  }

  function handleCancel() {
    navigate('/');
  }

  // Clear field-level error as user edits
  function handlePersonalChange(field, value) {
    setPersonalData((d) => ({ ...d, [field]: value }));
    if (personalErrors[field]) setPersonalErrors((e) => ({ ...e, [field]: '' }));
  }

  function handleAddressChange(field, value) {
    setAddressData((d) => ({ ...d, [field]: value }));
    if (addressErrors[field]) setAddressErrors((e) => ({ ...e, [field]: '' }));
  }

  function handleCarChange(field, value) {
    setCarData((d) => ({ ...d, [field]: value }));
    if (carErrors[field]) setCarErrors((e) => ({ ...e, [field]: '' }));
  }

  function handlePropertyChange(field, value) {
    setPropertyData((d) => ({ ...d, [field]: value }));
    if (propertyErrors[field]) setPropertyErrors((e) => ({ ...e, [field]: '' }));
  }

  function handleCoverageChange(val) {
    setCoverage(val);
    setCoverageError('');
  }

  function renderStep() {
    switch (currentStep?.key) {
      case 'coverage':
        return (
          <CoverageStep
            selected={coverage}
            onChange={handleCoverageChange}
            error={coverageError}
          />
        );
      case 'personal':
        return (
          <PersonalInfoStep
            data={personalData}
            onChange={handlePersonalChange}
            errors={personalErrors}
          />
        );
      case 'address':
        return (
          <AddressStep
            data={addressData}
            onChange={handleAddressChange}
            errors={addressErrors}
          />
        );
      case 'car':
        return (
          <CarDetailsStep
            data={carData}
            onChange={handleCarChange}
            errors={carErrors}
            showWarning={showWarning}
            onDismissWarning={() => setShowWarning(false)}
          />
        );
      case 'home':
        return (
          <PropertyDetailsStep
            data={propertyData}
            onChange={handlePropertyChange}
            errors={propertyErrors}
          />
        );
      default:
        return null;
    }
  }

  const isCarStep = currentStep?.key === 'car';
  const showEstimate = currentStepIndex > 0;

  // Live estimate — recalculates whenever any form field changes
  const estimate = useMemo(
    () =>
      showEstimate
        ? calculateEstimate(coverage, personalData, addressData, carData, propertyData)
        : null,
    [showEstimate, coverage, personalData, addressData, carData, propertyData],
  );

  return (
    <div className="signup-page">
      <div className="signup-page__inner">
        {/* Header Banner */}
        <div className="signup-header">
          <h1 className="signup-header__title">Sign Up for InsureCo</h1>
          <p className="signup-header__subtitle">
            Get started with your insurance coverage in just a few steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="signup-progress">
          <StepBreadcrumb steps={steps} currentIndex={currentStepIndex} />
        </div>

        {/* Form Card */}
        <div className="signup-card">
          {renderStep()}

          {/* Live Quote Estimate */}
          {showEstimate && (
            <QuoteEstimatePanel estimate={estimate} coverage={coverage} />
          )}

          {/* Navigation Buttons */}
          <div className="signup-actions">
            {isCarStep && (
              <Button
                kind="tertiary"
                renderIcon={ArrowLeft}
                iconDescription="Cancel"
                onClick={handleCancel}
                size="lg"
              >
                Cancel
              </Button>
            )}
            {!isFirstStep && (
              <Button
                kind="secondary"
                renderIcon={ArrowLeft}
                iconDescription="Back"
                onClick={handleBack}
                size="lg"
              >
                Back
              </Button>
            )}
            <Button
              kind="danger"
              renderIcon={ArrowRight}
              iconDescription="Next"
              onClick={handleNext}
              size="lg"
            >
              {isLastStep ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
