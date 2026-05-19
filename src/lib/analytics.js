// Lightweight analytics shim. Replace with GA/Segment/etc. later by wiring
// the underlying provider here; callers don't need to change.
export function trackEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;
  const provider = window.__analytics;
  if (provider && typeof provider.track === 'function') {
    try {
      provider.track(name, payload);
    } catch {
      // Swallow provider errors; analytics must never break the app.
    }
    return;
  }
  if (import.meta?.env?.DEV) {
    // Visible in dev to confirm events fire; silent in prod.
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, payload);
  }
}
