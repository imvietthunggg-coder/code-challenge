import { PRICES_URL, SIMULATED_LATENCY } from '../utils/constants';

const wait = (milliseconds, signal) =>
  new Promise((resolve, reject) => {
    const timeout = window.setTimeout(resolve, milliseconds);

    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException('Request aborted', 'AbortError'));
      },
      { once: true },
    );
  });

export const requestSwapQuote = async ({
  amount,
  fromCurrency,
  toCurrency,
  signal,
}) => {
  await wait(SIMULATED_LATENCY, signal);

  const response = await fetch(PRICES_URL, { signal });
  if (!response.ok) throw new Error('Could not load prices');

  const prices = await response.json();
  const selectedPrices = prices.reduce((result, item) => {
    if (item.currency !== fromCurrency && item.currency !== toCurrency)
      return result;

    const current = result[item.currency];
    if (!current || new Date(item.date) >= new Date(current.date)) {
      result[item.currency] = item;
    }

    return result;
  }, {});

  const fromPrice = selectedPrices[fromCurrency]?.price;
  const toPrice = selectedPrices[toCurrency]?.price;
  if (!fromPrice || !toPrice)
    throw new Error('A selected currency is unavailable');

  const rate = fromPrice / toPrice;
  return { amount: amount * rate, rate };
};
