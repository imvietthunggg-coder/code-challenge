import formatAmount from '../utils/formatAmount';

const ConfirmationOverlay = ({ amount, fromCurrency, toCurrency, quote }) => (
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
      {formatAmount(amount)} {fromCurrency} to {formatAmount(quote.amount)}{' '}
      {toCurrency}
    </span>
  </div>
);

export default ConfirmationOverlay;
