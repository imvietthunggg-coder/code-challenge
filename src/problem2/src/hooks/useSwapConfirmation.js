import { useEffect, useState } from 'react';

import formatAmount from '../utils/formatAmount';

const useSwapConfirmation = () => {
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirmed) return undefined;

    const timeout = window.setTimeout(() => setConfirmed(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [confirmed]);

  const clearConfirmation = () => {
    setMessage('');
    setConfirmed(false);
    setConfirming(false);
  };

  const confirmSwap = async ({ amount, fromCurrency, toCurrency, quote }) => {
    setConfirming(true);
    setMessage('');
    await new Promise((resolve) => window.setTimeout(resolve, 1000));

    setMessage(
      `Swap confirmed: ${formatAmount(amount)} ${fromCurrency} for ${formatAmount(quote.amount)} ${toCurrency}`,
    );
    setConfirming(false);
    setConfirmed(true);
  };

  return { message, confirmed, confirming, clearConfirmation, confirmSwap };
};

export default useSwapConfirmation;
