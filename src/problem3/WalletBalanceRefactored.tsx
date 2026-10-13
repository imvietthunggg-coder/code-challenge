import { useMemo } from 'react';

interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

const priorities: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

type Props = BoxProps;

const WalletPage = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          balance.amount > 0 && priorities[balance.blockchain] !== undefined,
      )
      .sort(
        (left: WalletBalance, right: WalletBalance) =>
          priorities[right.blockchain] - priorities[left.blockchain],
      )
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      }));
  }, [balances]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance) => {
        const price = prices[balance.currency];
        if (price == null) return null;

        return (
          <WalletRow
            key={`${balance.blockchain}:${balance.currency}`}
            amount={balance.amount}
            usdValue={price * balance.amount}
            formattedAmount={balance.formatted}
          />
        );
      })}
      {children}
    </div>
  );
};

export default WalletPage;
