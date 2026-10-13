import { useEffect, useState } from 'react';

import { currencies, requestSwapQuote } from './services/quote.service';

const ICON_URL =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const formatAmount = (value) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 1 ? 6 : 8,
  }).format(value);

const CurrencyIcon = ({ currency }) => (
  <span
    className="relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-[#a8fe55] text-xs font-extrabold text-[#172017] max-sm:size-6"
    aria-hidden="true"
  >
    <img
      className="absolute z-10 size-full object-cover"
      src={`${ICON_URL}/${currency}.svg`}
      alt=""
      onError={(event) => {
        event.currentTarget.hidden = true;
      }}
    />
    <span>{currency.slice(0, 1).toUpperCase()}</span>
  </span>
);

const CurrencySelect = ({ id, label, value, onChange, disabled }) => (
  <div>
    <label className="sr-only" htmlFor={id}>
      {label}
    </label>
    <div className="relative flex min-w-31.25 shrink-0 items-center rounded-full border border-[#303737] bg-[#202626] py-1.75 pr-7.75 pl-2 max-sm:min-w-28 max-sm:pr-6.75">
      <CurrencyIcon currency={value} />
      <select
        className="relative z-10 w-full appearance-none border-0 bg-transparent py-0 pr-0 pl-2.25 text-sm font-bold text-[#eef2ef] outline-none disabled:cursor-wait option:bg-[#202626]"
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      >
        {currencies.map((currency) => (
          <option value={currency} key={currency}>
            {currency}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.75 w-3.75 fill-none stroke-[#9ba59f] stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="m5 7.5 5 5 5-5" />
      </svg>
    </div>
  </div>
);

const App = () => {
  const [fromCurrency, setFromCurrency] = useState('ETH');
  const [toCurrency, setToCurrency] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState(null);
  const [requestState, setRequestState] = useState('idle');
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const numericAmount = Number(amount);
  const hasError =
    amount !== '' && (!Number.isFinite(numericAmount) || numericAmount <= 0);
  const loading = requestState === 'loading';

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

  useEffect(() => {
    if (!confirmed) return undefined;

    const timeout = window.setTimeout(() => setConfirmed(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [confirmed]);

  const clearQuote = () => {
    setQuote(null);
    setRequestState('idle');
    setMessage('');
    setConfirmed(false);
    setConfirming(false);
  };

  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    clearQuote();
  };

  const submitSwap = async (event) => {
    event.preventDefault();
    if (!quote || hasError || loading || confirming) return;

    setConfirming(true);
    setMessage('');
    await new Promise((resolve) => window.setTimeout(resolve, 1000));

    setMessage(
      `Swap confirmed: ${formatAmount(numericAmount)} ${fromCurrency} for ${formatAmount(quote.amount)} ${toCurrency}`,
    );
    setConfirming(false);
    setConfirmed(true);
  };

  const assetPanelClass =
    'rounded-[18px] border bg-[#161b1c] px-4.5 pt-4.25 pb-4.75 transition-colors focus-within:border-[#a8fe558c] focus-within:bg-[#181e1d] max-sm:px-3.25 max-sm:pt-3.75 max-sm:pb-4.25';

  return (
    <main className="relative grid min-h-screen min-w-80 place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#1a2520_0%,#080b0f_46%)] px-5 py-10 font-sans text-[#f5f7f5] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] before:bg-size-[52px_52px] max-sm:place-items-start max-sm:px-3 max-sm:py-4.5">
      <section
        className="relative z-10 w-full max-w-130 rounded-[28px] border border-white/10 bg-[#111518e6] p-7.5 shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-lg max-sm:rounded-[23px] max-sm:p-4"
        aria-labelledby="swap-title"
      >
        {confirmed && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[28px] bg-[#0b100ded] backdrop-blur-sm max-sm:rounded-[23px]"
            role="status"
          >
            <div className="relative mb-5 grid size-20 place-items-center">
              <span className="absolute size-full animate-ping rounded-full bg-[#a8fe55]/25" />
              <span className="relative grid size-16 animate-bounce place-items-center rounded-full bg-[#a8fe55] text-[#0b0f0c] shadow-[0_0_36px_rgba(168,254,85,0.35)]">
                <svg
                  className="size-8 fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </span>
            </div>
            <strong className="text-xl font-bold tracking-[-0.03em]">
              Swap confirmed
            </strong>
            <span className="mt-1.5 text-sm text-[#9aa59e]">
              {formatAmount(numericAmount)} {fromCurrency} to{' '}
              {formatAmount(quote.amount)} {toCurrency}
            </span>
          </div>
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
          <div
            className={`${assetPanelClass} ${hasError ? 'border-[#d97676]' : 'border-[#2a3030]'}`}
          >
            <div className="mb-3 flex justify-between text-xs font-semibold text-[#8e9892]">
              <label htmlFor="send-amount">You send</label>
              <span>Market price</span>
            </div>
            <div className="flex items-center justify-between gap-4 max-sm:gap-2">
              <input
                className="w-full min-w-0 appearance-none border-0 bg-transparent text-[clamp(27px,7vw,36px)] leading-[1.15] font-medium tracking-[-0.045em] text-[#f7faf7] outline-none placeholder:text-[#657069] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                id="send-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0"
                value={amount}
                disabled={confirming}
                onChange={(event) => {
                  setAmount(event.target.value);
                  clearQuote();
                }}
                aria-describedby={hasError ? 'amount-error' : undefined}
              />
              <CurrencySelect
                id="send-currency"
                label="Currency to send"
                value={fromCurrency}
                disabled={confirming}
                onChange={(event) => {
                  setFromCurrency(event.target.value);
                  clearQuote();
                }}
              />
            </div>
          </div>

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

          <div className={`${assetPanelClass} border-[#2a3030] bg-[#121718]`}>
            <div className="mb-3 flex justify-between text-xs font-semibold text-[#8e9892]">
              <label htmlFor="receive-amount">You receive</label>
              <span>Estimated</span>
            </div>
            <div className="flex items-center justify-between gap-4 max-sm:gap-2">
              <output
                className="w-full min-w-0 text-[clamp(27px,7vw,36px)] leading-[1.15] font-medium tracking-[-0.045em] text-[#f7faf7]"
                id="receive-amount"
                aria-live="polite"
              >
                {loading ? (
                  <span
                    className="flex h-8 items-center gap-2"
                    aria-label="Updating quote"
                  >
                    <span className="size-2.5 animate-bounce rounded-full bg-[#a8fe55] [animation-delay:-0.3s]" />
                    <span className="size-2.5 animate-bounce rounded-full bg-[#a8fe55] [animation-delay:-0.15s]" />
                    <span className="size-2.5 animate-bounce rounded-full bg-[#a8fe55]" />
                  </span>
                ) : quote ? (
                  formatAmount(quote.amount)
                ) : (
                  '0'
                )}
              </output>
              <CurrencySelect
                id="receive-currency"
                label="Currency to receive"
                value={toCurrency}
                disabled={confirming}
                onChange={(event) => {
                  setToCurrency(event.target.value);
                  clearQuote();
                }}
              />
            </div>
          </div>

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

          <button
            className="flex h-13.5 w-full items-center justify-center gap-2.5 rounded-[15px] border-0 bg-[#a8fe55] text-sm font-bold text-[#0b0f0c] shadow-[0_12px_30px_rgba(168,254,85,0.12)] transition hover:not-disabled:-translate-y-px hover:not-disabled:bg-[#baff6e] disabled:cursor-not-allowed disabled:opacity-40"
            type="submit"
            disabled={
              loading || confirming || hasError || !numericAmount || !quote
            }
          >
            {loading || confirming ? (
              <svg
                className="size-4.5 animate-spin"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="fill-none stroke-current opacity-25"
                  cx="12"
                  cy="12"
                  r="9"
                  strokeWidth="3"
                />
                <path
                  className="fill-current opacity-75"
                  d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6z"
                />
              </svg>
            ) : (
              <svg
                className="w-4.5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M4 10h12m-5-5 5 5-5 5" />
              </svg>
            )}
            {confirming
              ? 'Confirming swap...'
              : loading
                ? 'Updating quote...'
                : 'Confirm swap'}
          </button>
        </form>

        <p className="mt-3.75 mb-0 text-center text-[11px] text-[#68716c]">
          Quotes use the latest available market prices.
        </p>
      </section>
    </main>
  );
};

export default App;
