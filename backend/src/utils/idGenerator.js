/**
 * Generates StayEase-style booking IDs: STE-XXXXXX
 */
const generateBookingId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `STE-${num}`;
};

/**
 * Generates PNR-style IDs: SE-{CITY}-{XXXX}
 */
const generatePNR = (city = 'IND') => {
  const code = city.substring(0, 3).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SE-${code}-${num}`;
};

/**
 * Generates transaction IDs: TXN-XXXXXX
 */
const generateTxnId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TXN-${num}`;
};

/**
 * Generates refund IDs: REF-YYYY-XXXX
 */
const generateRefundId = () => {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `REF-${year}-${num}`;
};

module.exports = {
  generateBookingId,
  generatePNR,
  generateTxnId,
  generateRefundId,
};
