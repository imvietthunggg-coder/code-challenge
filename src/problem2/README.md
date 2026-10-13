# Problem 2: Fancy Form

A responsive currency swap form built with React, Vite, and Tailwind CSS.

## Features

- Currency and token selection with Switcheo token icons
- Automatic quote requests after a 500 ms input debounce
- Simulated backend latency with cancellable requests
- Prices from the challenge's [price feed](https://interview.switcheo.com/prices.json)
- Loading, validation, API error, and confirmation states
- Responsive and accessible form controls

## Requirements

- Node.js
- Yarn 1.x

## Install

From the repository root:

```sh
cd src/problem2
yarn install --frozen-lockfile
```

## Run

```sh
yarn dev
```

Open the local URL printed by Vite.

## Checks

```sh
yarn lint
yarn build
```

To preview the production build:

```sh
yarn preview
```
