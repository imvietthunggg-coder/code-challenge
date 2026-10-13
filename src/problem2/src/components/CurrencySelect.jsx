import CurrencyIcon from './CurrencyIcon';
import { currencies } from '../utils/constants';

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

export default CurrencySelect;
