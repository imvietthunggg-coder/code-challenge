const SwapButton = ({ loading, confirming, disabled }) => (
  <button
    className="flex h-13.5 w-full items-center justify-center gap-2.5 rounded-[15px] border-0 bg-[#a8fe55] text-sm font-bold text-[#0b0f0c] shadow-[0_12px_30px_rgba(168,254,85,0.12)] transition hover:not-disabled:-translate-y-px hover:not-disabled:bg-[#baff6e] disabled:cursor-not-allowed disabled:opacity-40"
    type="submit"
    disabled={disabled}
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
);

export default SwapButton;
