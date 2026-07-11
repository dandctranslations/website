// Bank accounts clients transfer into, keyed by region.
//
// These ship in the public JS bundle. Account/BSB numbers aren't secret — they
// go on every invoice you send — so this is fine for the current setup. If you
// ever want them hidden, that's the reason to move to a backend (see the plan).
//
// TODO: replace the placeholder values below with your real account details.
export const ACCOUNTS = {
  AU: {
    label: 'Australia',
    currency: 'AUD',
    // `fields` render in order on the payment page. `copy: true` shows a copy button.
    fields: [
      { label: 'Bank', value: 'Commonwealth Bank' },
      { label: 'Account name', value: 'D&C Translations' },
      { label: 'BSB', value: '000-000', copy: true },
      { label: 'Account number', value: '0000 0000', copy: true },
    ],
  },
  UZ: {
    label: 'Uzbekistan',
    currency: 'UZS',
    fields: [
      { label: 'Bank', value: 'Kapitalbank' },
      { label: 'Account name', value: 'D&C Translations' },
      { label: 'Card number', value: '0000 0000 0000 0000', copy: true },
      { label: 'MFO', value: '00000', copy: true },
    ],
  },
};

// Regions offered in the payment-link builder.
export const REGIONS = Object.entries(ACCOUNTS).map(([code, { label, currency }]) => ({
  code,
  label,
  currency,
}));
