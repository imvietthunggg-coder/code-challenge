import { ICON_URL } from '../utils/constants';

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

export default CurrencyIcon;
