// ─── Base Rates by Coverage Type ─────────────────────────────────────────────

const BASE_RATES = {
  car:  79,
  home: 69,
  both: 129, // bundle discount built in
};

// ─── High-cost states ─────────────────────────────────────────────────────────

const HIGH_COST_STATES = new Set(['CA', 'NY', 'FL', 'TX', 'NJ', 'MA']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAgeFromDob(dob) {
  if (!dob) return null;
  const parsed = new Date(dob);
  if (isNaN(parsed)) return null;
  const now = new Date();
  const age = now.getFullYear() - parsed.getFullYear();
  const hadBirthday =
    now.getMonth() > parsed.getMonth() ||
    (now.getMonth() === parsed.getMonth() && now.getDate() >= parsed.getDate());
  return hadBirthday ? age : age - 1;
}

// ─── Main Estimator ───────────────────────────────────────────────────────────

/**
 * Calculate an estimated monthly premium range.
 *
 * @param {string} coverage        - 'car' | 'home' | 'both'
 * @param {object} personalData    - { dob, ... }
 * @param {object} addressData     - { state, ... }
 * @param {object} carData         - { year, milesPerYear, ... }
 * @param {object} propertyData    - { homeValue, ... }
 * @returns {{ low: number, high: number, isPartial: boolean }}
 */
export function calculateEstimate(coverage, personalData, addressData, carData, propertyData) {
  const base = BASE_RATES[coverage];
  if (!base) return null;

  let multiplier = 1;
  let factorsApplied = 0;

  // ── Age factor ──────────────────────────────────────────────────────────────
  const age = getAgeFromDob(personalData?.dob);
  if (age !== null) {
    factorsApplied++;
    if (age < 25)      multiplier *= 1.30;
    else if (age > 65) multiplier *= 1.10;
    // 25–65: ×1.00 (no change)
  }

  // ── State factor ─────────────────────────────────────────────────────────────
  const state = addressData?.state;
  if (state) {
    factorsApplied++;
    if (HIGH_COST_STATES.has(state)) multiplier *= 1.20;
  }

  // ── Car-specific factors ─────────────────────────────────────────────────────
  if (coverage === 'car' || coverage === 'both') {
    const carYear = parseInt(carData?.year, 10);
    if (!isNaN(carYear)) {
      factorsApplied++;
      if      (carYear >= 2020) multiplier *= 1.25;
      else if (carYear >= 2015) multiplier *= 1.10;
      else if (carYear >= 2010) multiplier *= 1.00;
      else                      multiplier *= 0.90;
    }

    const miles = parseInt(carData?.milesPerYear, 10);
    if (!isNaN(miles) && miles > 0) {
      factorsApplied++;
      if      (miles > 15000) multiplier *= 1.15;
      else if (miles < 10000) multiplier *= 0.90;
      // 10,000–15,000: ×1.00
    }
  }

  // ── Property-specific factors ────────────────────────────────────────────────
  if (coverage === 'home' || coverage === 'both') {
    const homeValue = parseInt(propertyData?.homeValue, 10);
    if (!isNaN(homeValue) && homeValue > 0) {
      factorsApplied++;
      if      (homeValue > 500000)  multiplier *= 1.30;
      else if (homeValue > 300000)  multiplier *= 1.15;
      else if (homeValue >= 150000) multiplier *= 1.00;
      else                          multiplier *= 0.90;
    }
  }

  const estimate = base * multiplier;

  return {
    low:       Math.round(estimate * 0.9),
    high:      Math.round(estimate * 1.1),
    base,
    isPartial: factorsApplied === 0,
  };
}
