interface WalletBalance {
  // Missing blockchain: the filter and sort below both access balance.blockchain.
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// BoxProps and the hooks/WalletRow below come from the host app; they are not defined here.
// This empty interface and React.FC<Props> add no useful type information.
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  // children is destructured from props but never included in the rendered output.
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Fixed priorities need not be recreated on every render; `any` also hides type errors.
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  // Price changes needlessly rerun this filter and sort, which only depend on balances.
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // lhsPriority is undefined; this should check the calculated balancePriority.
        if (lhsPriority > -99) {
          // Once the priority typo is fixed, this keeps non-positive balances instead of holdings.
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // Priority is looked up twice for every comparison, even for the same balances.
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Equal priorities return undefined instead of the comparator's required 0.
      });
  }, [balances, prices]);

  // This runs on every render, even for price-only updates, and its result is never used.
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // These items are unformatted WalletBalance values, despite the callback's type.
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // An unavailable price makes usdValue NaN.
      const usdValue = prices[balance.currency] * balance.amount;
      // classes is not declared in this snippet; index keys can attach state to the wrong row after reordering.
      // formatted is undefined because rows use sortedBalances, not formattedBalances.
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    },
  );

  return <div {...rest}>{rows}</div>;
};
