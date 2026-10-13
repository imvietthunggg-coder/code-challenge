import AssetPanel from './AssetPanel';
import CurrencySelect from './CurrencySelect';
import formatAmount from '../utils/formatAmount';

const ReceivePanel = ({ currency, quote, loading, confirming, onCurrencyChange }) => (
  <AssetPanel label="You receive" detail="Estimated" amountId="receive-amount" receiving>
    <output
      className="w-full min-w-0 text-[clamp(27px,7vw,36px)] leading-[1.15] font-medium tracking-[-0.045em] text-[#f7faf7]"
      id="receive-amount"
      aria-live="polite"
    >
      {loading ? (
        <span className="flex h-8 items-center gap-2" aria-label="Updating quote">
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
      value={currency}
      disabled={confirming}
      onChange={(event) => onCurrencyChange(event.target.value)}
    />
  </AssetPanel>
);

export default ReceivePanel;
