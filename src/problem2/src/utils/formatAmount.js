const formatAmount = (value) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 1 ? 6 : 8,
  }).format(value);

export default formatAmount;
