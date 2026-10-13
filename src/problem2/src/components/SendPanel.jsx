import AssetPanel from './AssetPanel';
import CurrencySelect from './CurrencySelect';

const SendPanel = ({ amount, currency, hasError, confirming, onAmountChange, onCurrencyChange }) => (
  <AssetPanel label="You send" detail="Market price" amountId="send-amount" hasError={hasError}>
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
      onChange={(event) => onAmountChange(event.target.value)}
      aria-describedby={hasError ? 'amount-error' : undefined}
    />
    <CurrencySelect
      id="send-currency"
      label="Currency to send"
      value={currency}
      disabled={confirming}
      onChange={(event) => onCurrencyChange(event.target.value)}
    />
  </AssetPanel>
);

export default SendPanel;
