const AssetPanel = ({ label, detail, amountId, hasError, receiving, children }) => (
  <div
    className={`rounded-[18px] border px-4.5 pt-4.25 pb-4.75 transition-colors focus-within:border-[#a8fe558c] focus-within:bg-[#181e1d] max-sm:px-3.25 max-sm:pt-3.75 max-sm:pb-4.25 ${receiving ? 'bg-[#121718]' : 'bg-[#161b1c]'} ${hasError ? 'border-[#d97676]' : 'border-[#2a3030]'}`}
  >
    <div className="mb-3 flex justify-between text-xs font-semibold text-[#8e9892]">
      <label htmlFor={amountId}>{label}</label>
      <span>{detail}</span>
    </div>
    <div className="flex items-center justify-between gap-4 max-sm:gap-2">
      {children}
    </div>
  </div>
);

export default AssetPanel;
