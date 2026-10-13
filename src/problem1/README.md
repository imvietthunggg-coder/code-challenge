# Problem 1: Three Ways to Sum to N

This solution implements three functions that calculate the sum of integers from `1` through a positive integer `n`.

## Implementations

| Function     | Approach      | Time complexity | Space complexity |
| ------------ | ------------- | --------------- | ---------------- |
| `sum_to_n_a` | Simple loop   | O(n)            | O(1)             |
| `sum_to_n_b` | Maths formula | O(1)            | O(1)             |
| `sum_to_n_c` | Recursion     | O(n)            | O(n)             |

## Run

From the repository root:

```sh
node src/problem1/index.js
```

The included example uses `n = 5`, so each implementation prints `15`.
