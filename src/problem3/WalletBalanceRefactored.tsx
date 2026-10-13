import { useMemo } from 'react';

interface WalletBalance {
  // The blockchain field is required by the filter, sort, and row key.
  blockchain: string;
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Fixed lookup outside the component avoids rebuilding the priority function each render.
const priorities: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// BoxProps, useWalletBalances, usePrices, and WalletRow are supplied by the host app.
// This page only renders wallet rows; the caller provides their row class, not children.
type Props = Omit<BoxProps, 'children'> & { classes: { row: string } };

const WalletPage = ({ classes, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // With a stable balances reference, price updates do not redo filtering, sorting, or formatting.
  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      // Display positive holdings only, and exclude chains without a priority.
      .filter(
        (balance: WalletBalance) =>
          balance.amount > 0 && priorities[balance.blockchain] !== undefined,
      )
      // Numeric subtraction returns 0 for equal priorities.
      .sort(
        (left: WalletBalance, right: WalletBalance) =>
          priorities[right.blockchain] - priorities[left.blockchain],
      )
      // Format the same balances that will be rendered, once per balance update.
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      }));
  }, [balances]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance) => {
        const price = prices[balance.currency];
        // Wait for a price instead of passing NaN as the USD value.
        if (price == null) return null;

        // React list key: use the blockchain/currency pair instead of the array index.
        // This assumes each pair uniquely identifies a balance.
        return (
          <WalletRow
            key={`${balance.blockchain}:${balance.currency}`}
            className={classes.row}
            amount={balance.amount}
            usdValue={price * balance.amount}
            formattedAmount={balance.formatted}
          />
        );
      })}
    </div>
  );
};

export default WalletPage;
