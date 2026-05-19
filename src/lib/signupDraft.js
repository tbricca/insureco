const DRAFT_KEY = 'insureco-signup-draft';
const DRAFT_VERSION = 1;

export function loadDraft() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== DRAFT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft({ formData, currentStep }) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      version: DRAFT_VERSION,
      savedAt: Date.now(),
      currentStep,
      formData,
    };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // Storage may be full or disabled; ignore.
  }
}

export function clearDraft() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
