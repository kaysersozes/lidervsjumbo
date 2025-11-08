/**
 * Format price in Chilean pesos
 * @param {number} price - Price in CLP
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  if (price === null || price === undefined) {
    return 'N/A';
  }

  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Calculate price difference between two stores
 * @param {number} price1 - Price from store 1
 * @param {number} price2 - Price from store 2
 * @returns {object} Object with difference and percentage
 */
export function calculateDifference(price1, price2) {
  if (!price1 || !price2) {
    return { difference: 0, percentage: 0 };
  }

  const difference = price1 - price2;
  const percentage = ((difference / price2) * 100).toFixed(1);

  return {
    difference,
    percentage: parseFloat(percentage)
  };
}

/**
 * Determine which store has the better price
 * @param {number} liderPrice - Lider price
 * @param {number} jumboPrice - Jumbo price
 * @returns {string} 'lider', 'jumbo', or 'same'
 */
export function getBestPrice(liderPrice, jumboPrice) {
  if (!liderPrice && jumboPrice) return 'jumbo';
  if (liderPrice && !jumboPrice) return 'lider';
  if (!liderPrice && !jumboPrice) return 'none';
  if (liderPrice === jumboPrice) return 'same';

  return liderPrice < jumboPrice ? 'lider' : 'jumbo';
}
