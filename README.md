## Setup
This project is using yarn, but you can delete the `yarn.lock` file and use `npm`, `pnpm` or whatever fits you best.

After cloning the project, run
```bash
cd path/to/the/project

# install dependencies
yarn

# run project
yarn dev
```

## Possible errors
As for the current setup, it may not run the project see [github issue](https://github.com/ProjectOpenSea/opensea-js/issues/421).

So to have it running, go to `src/pages/index.js` and comment line **5**.

```javascript
5 // import { OpenSeaPort, Network } from "opensea-js";
```

## The task is to create a simple nextjs app that:

- [x] Allows a user to connect their web3 wallet (can take inspiration from uniswap connect: https://app.uniswap.org/#/swap?chain=mainnet)
- [x] Renders all owned NFTs in simple components using the zora sdk: https://github.com/ourzora/nft-components
- [x] Allows a user to list (can be direct sale) an NFT on opensea via their SDK: https://github.com/ProjectOpenSea/opensea-js