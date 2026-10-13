import { useEffect, useState } from 'react';

import { requestSwapQuote } from '../services/quote.service';

const useSwapQuote = (amount, fromCurrency, toCurrency) => {
  const [quote, setQuote] = useState(null);
  const [requestState, setRequestState] = useState('idle');

  useEffect(() => {
    const requestedAmount = Number(amount);

    if (!amount || !Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      return undefined;
    }

    const controller = new AbortController();

    const debounce = window.setTimeout(async () => {
      setRequestState('loading');

      try {
        const nextQuote = await requestSwapQuote({
          amount: requestedAmount,
          fromCurrency,
          toCurrency,
          signal: controller.signal,
        });

        setQuote(nextQuote);
        setRequestState('success');
      } catch (error) {
        if (error.name !== 'AbortError') setRequestState('error');
      }
    }, 500);

    return () => {
      window.clearTimeout(debounce);
      controller.abort();
    };
  }, [amount, fromCurrency, toCurrency]);

  const clearQuote = () => {
    setQuote(null);
    setRequestState('idle');
  };

  return { quote, requestState, clearQuote };
};

export default useSwapQuote;
