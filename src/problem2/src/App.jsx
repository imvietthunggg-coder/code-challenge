import { useState } from 'react';

import ConfirmationOverlay from './components/ConfirmationOverlay';
import ReceivePanel from './components/ReceivePanel';
import SendPanel from './components/SendPanel';
import SwapButton from './components/SwapButton';
import useSwapConfirmation from './hooks/useSwapConfirmation';
import useSwapQuote from './hooks/useSwapQuote';
import formatAmount from './utils/formatAmount';

const App = () => {
  const [fromCurrency, setFromCurrency] = useState('ETH');
  const [toCurrency, setToCurrency] = useState('USDC');
  const [amount, setAmount] = useState('');
  const { quote, requestState, clearQuote } = useSwapQuote(
    amount,
    fromCurrency,
    toCurrency,
  );
  const { message, confirmed, confirming, clearConfirmation, confirmSwap } =
    useSwapConfirmation();

  const numericAmount = Number(amount);
  const hasError =
    amount !== '' && (!Number.isFinite(numericAmount) || numericAmount <= 0);
  const loading = requestState === 'loading';

  const clearSwap = () => {
    clearQuote();
    clearConfirmation();
  };

  const changeAmount = (value) => {
    setAmount(value);
    clearSwap();
  };

  const changeFromCurrency = (value) => {
    setFromCurrency(value);
    clearSwap();
  };

  const changeToCurrency = (value) => {
    setToCurrency(value);
    clearSwap();
  };

  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    clearSwap();
  };

  const submitSwap = (event) => {
    event.preventDefault();
    if (!quote || hasError || loading || confirming) return;

    confirmSwap({ amount: numericAmount, fromCurrency, toCurrency, quote });
  };

  return (
    <main className="relative grid min-h-screen min-w-80 place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#1a2520_0%,#080b0f_46%)] px-5 py-10 font-sans text-[#f5f7f5] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] before:bg-size-[52px_52px] max-sm:place-items-start max-sm:px-3 max-sm:py-4.5">
      <section
        className="relative z-10 w-full max-w-130 rounded-[28px] border border-white/10 bg-[#111518e6] p-7.5 shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-lg max-sm:rounded-[23px] max-sm:p-4"
        aria-labelledby="swap-title"
      >
        {confirmed && (
          <ConfirmationOverlay
            amount={numericAmount}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            quote={quote}
          />
        )}

        <header className="mb-6.75 flex items-start justify-between max-sm:mb-5.5">
          <div>
            <p className="mb-1.75 text-[11px] font-bold tracking-[0.16em] text-[#a8fe55] uppercase">
              Instant exchange
            </p>
            <h1
              className="m-0 text-[clamp(25px,6vw,32px)] font-semibold tracking-[-0.045em]"
              id="swap-title"
            >
              Swap currencies
            </h1>
          </div>
          <div className="mt-1 flex items-center gap-1.75 rounded-full border border-[#a8fe552e] bg-[#a8fe550d] px-2.5 py-1.75 text-[11px] font-semibold text-[#b4bcb7]">
            <span className="size-1.5 rounded-full bg-[#a8fe55] shadow-[0_0_10px_#a8fe55]" />{' '}
            Quote service
          </div>
        </header>

        <form onSubmit={submitSwap} noValidate>
          <SendPanel
            amount={amount}
            currency={fromCurrency}
            hasError={hasError}
            confirming={confirming}
            onAmountChange={changeAmount}
            onCurrencyChange={changeFromCurrency}
          />

          <div className="flex h-10.5 items-center gap-2.5 px-2">
            <span className="h-px w-full bg-[#252b2c]" />
            <button
              className="grid size-9.5 shrink-0 place-items-center rounded-xl border border-[#343c3b] bg-[#181e1e] text-[#a8fe55] transition duration-200 hover:rotate-180 hover:border-[#a8fe55]"
              type="button"
              onClick={switchCurrencies}
              disabled={confirming}
              aria-label="Switch currencies"
            >
              <svg
                className="w-4.5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m8 7 4-4 4 4M12 3v14M16 17l-4 4-4-4" />
              </svg>
            </button>
            <span className="h-px w-full bg-[#252b2c]" />
          </div>

          <ReceivePanel
            currency={toCurrency}
            quote={quote}
            loading={loading}
            confirming={confirming}
            onCurrencyChange={changeToCurrency}
          />

          <div
            className="min-h-9.5 px-0.5 pt-2.25 text-xs font-medium"
            aria-live="polite"
          >
            {hasError && (
              <p id="amount-error" className="m-0 text-[#ef9292]">
                Enter an amount greater than zero.
              </p>
            )}
            {requestState === 'error' && (
              <p className="m-0 text-[#ef9292]">
                The quote service is unavailable. Please try again.
              </p>
            )}
            {message && <p className="m-0 text-[#a8fe55]">{message}</p>}
          </div>

          <div className="mb-4.5 flex items-center justify-between gap-3 text-xs text-[#7f8983]">
            <span>Exchange rate</span>
            <strong className="font-semibold text-[#b8c0bb]">
              {quote
                ? `1 ${fromCurrency} = ${formatAmount(quote.rate)} ${toCurrency}`
                : loading
                  ? 'Updating rate...'
                  : 'Enter an amount to see the rate'}
            </strong>
          </div>

          <SwapButton
            loading={loading}
            confirming={confirming}
            disabled={loading || confirming || hasError || !numericAmount || !quote}
          />
        </form>

        <p className="mt-3.75 mb-0 text-center text-[11px] text-[#68716c]">
          Quotes use the latest available market prices.
        </p>
      </section>
    </main>
  );
};

export default App;
