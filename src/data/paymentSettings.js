// Replace `qrImage` with your own Bakong / bank QR image whenever needed.
// This checkout intentionally does not call a payment API.
import khqr from '../../public/khqr.png';
export const localBankPayments = [
  {
    id: 'aba',
    name: 'ABA Bank',
    accountName: 'TEN11 Store',
    accountNumber: '000 000 000',
    qrImage: khqr,
  },
  {
    id: 'acleda',
    name: 'ACLEDA Bank',
    accountName: 'TEN11 Store',
    accountNumber: '000 000 000',
    qrImage: khqr,
  },
];

export const cardPayments = [
  { id: 'card', name: 'Credit / Debit Card' },
  { id: 'apple-pay', name: 'Apple Pay' },
];
