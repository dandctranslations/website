// Regions offered in the invoice tool's dropdown. Only labels + currencies live
// in the public bundle — the actual bank account details are server-side in
// `api/accounts.js`, so they never ship to the browser.
export const REGIONS = [
  { code: 'AU', label: 'Australia', currency: 'AUD' },
  { code: 'UZ', label: 'Uzbekistan', currency: 'UZS' },
];
