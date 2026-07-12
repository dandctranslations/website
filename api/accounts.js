// Bank accounts clients transfer into, keyed by region.
//
// These live server-side (not in the public React bundle) and are rendered only
// into the invoice email that the owner sends to a specific customer.
//
// TODO: replace the placeholder values below with the real account details.
const ACCOUNTS = {
  AU: {
    label: 'Australia',
    currency: 'AUD',
    // `fields` render in order in the invoice email.
    fields: [
      { label: 'Bank', value: 'Commonwealth Bank' },
      { label: 'Account name', value: 'D&C Translations' },
      { label: 'BSB', value: '000-000' },
      { label: 'Account number', value: '0000 0000' },
    ],
  },
  UZ: {
    label: 'Uzbekistan',
    currency: 'UZS',
    fields: [
      { label: 'Bank', value: 'Kapitalbank' },
      { label: 'Account name', value: 'D&C Translations' },
      { label: 'Card number', value: '0000 0000 0000 0000' },
      { label: 'MFO', value: '00000' },
    ],
  },
};

module.exports = { ACCOUNTS };
