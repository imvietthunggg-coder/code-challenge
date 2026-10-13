# Problem 3: Wallet balances

The original snippet is in [WalletBalance.tsx](./WalletBalance.tsx).
A refactored version is in [WalletBalanceRefactored.tsx](./WalletBalanceRefactored.tsx).

## Computational inefficiencies

1. **Prices unnecessarily invalidate the sorted balances.** `useMemo` depends on both `balances` and `prices`, but filtering and sorting only use `balances`. Each price update repeats the filter and the `O(n log n)` sort. Depend on `balances` alone; calculate USD values when rendering rows so prices can update without re-sorting.
2. **Priority is recalculated for each comparison.** Sorting calls `getPriority` twice per comparison. A lookup table simplifies these repeated checks. For a large list, priority could also be cached alongside each balance before sorting; with this small fixed mapping, the lookup itself is inexpensive.
3. **Formatting work is thrown away.** `formattedBalances` maps over every sorted balance, but the rows are built from `sortedBalances`. Either render `formattedBalances` or remove the unused map.
4. **Derived arrays are rebuilt outside the memo.** Formatting occurs on every render, including price-only renders. Derive formatted balances in the same memo as filtering and sorting when `balances` has a stable reference. If the hook returns a new array on every render, the memo cannot prevent recomputation and should be reconsidered.

## Correctness and React/TypeScript anti-patterns

1. **The filter references an undefined variable.** It computes `balancePriority` but checks `lhsPriority`. This prevents the code from compiling. Check the calculated priority instead.
2. **The amount condition appears inverted.** The filter retains balances with `amount <= 0`, which excludes positive holdings. Assuming the page displays holdings, use `amount > 0`.
3. **The balance type omits `blockchain`.** Both the filter and comparator read `balance.blockchain`, but `WalletBalance` does not declare it. Add the field and avoid `any` for the priority lookup.
4. **The comparator has no result for equal priorities.** It returns `undefined` on a tie instead of `0`. Return the difference between the two priorities so the comparator always returns a number.
5. **Rows are typed as formatted balances without being formatted.** `sortedBalances.map` labels each item `FormattedWalletBalance`, even though only `formattedBalances` has a `formatted` property. Consequently `formattedAmount` is undefined at runtime. Map over the formatted array.
6. **Array indexes are used as React keys.** When filtering or sorting changes the order, React can associate a row with a different balance. Use a stable, unique key. The refactor uses blockchain and currency together, which assumes each pair appears only once; otherwise use a balance ID.
7. **Missing prices produce `NaN`.** Multiplying an unavailable `prices[balance.currency]` by an amount yields `NaN`. The refactor skips rows until their prices are available. Another display policy can be used if unpriced balances should remain visible.
8. **`children` are destructured but never used.** Since this page only displays wallet rows, the refactor excludes `children` from its props rather than rendering them.
9. **`getPriority` is recreated on every render.** Moving fixed priority data outside the component is clearer. This is a minor allocation, not the main performance problem.
10. **Some surrounding definitions are absent from the snippet.** `BoxProps`, `useWalletBalances`, and `usePrices` must come from the host application; `WalletRow` and its `className` prop must also be available. `classes.row` has no definition in the original snippet. The refactor receives `classes` explicitly through props and uses `classes.row` for each row. The empty `Props extends BoxProps` interface and explicit `React.FC<Props>` add no benefit in this example.

The refactor assumes positive amounts are the balances to show, one balance per blockchain/currency pair, and that rows without a price should be hidden until a price is available.
