import BigNumber from 'bignumber.js';
import { ChainId } from '../token';
import { Interaction } from '@multiversx/sdk-core/out';

export type SorSwap = {
  poolId: string;
  assetInIndex: number;
  assetOutIndex: number;
  amount: string;
  returnAmount: string;
  assetIn: string;
  assetOut: string;
  functionName: string;
  arguments: string[];
};
export type SorHop = {
  poolId: string;
  tokenInAmount: string;
  tokenOutAmount: string;
  tokenIn: string;
  tokenOut: string;
  pool: {
    allTokens: Array<{ address: string; decimal: number }>;
    type: string;
  };
};
export type SorRoute = {
  hops: SorHop[];
  share: number;
  tokenIn: string;
  tokenInAmount: string;
  tokenOut: string;
  tokenOutAmount: string;
};

export type SorSwapResponseFromServer = {
  effectivePrice: number;
  effectivePriceReserved: number;
  priceImpact: number;
  swapAmount: string;
  returnAmount: string;
  returnAmountWithDecimal: string;
  returnAmountConsiderGasFees: string;
  returnAmountWithoutSwapFees: string;
  swapAmountWithDecimal: string;
  tokenAddresses: string[];
  tokenIn: string;
  tokenOut: string;
  marketSp: string;
  routes: SorRoute[];
  swaps: SorSwap[];
  warning: string;
};

export type SorSwapResponse = SorSwapResponseFromServer & {
  minReturnAmount: string;
  minReturnAmountWithDecimal: string;
};

export type AgResponse = {
  /** paths, rate, price impact... */
  sorResponse: SorSwapResponse;
  /** interaction for swap that is ready to sign and send to the network */
  getInteraction: (resolveWarning: (warning: string) => Promise<boolean> ) => Promise<Interaction>;
};

export type AggregatorConfig = {
  /** override the default aggregator API*/
  api?: string;
  /** ex: 0.1% = 100, set static fee to skip fetching protocol fee from contract*/
  fee?: number;
  /** whitelisted protocol address to be credited with fees */
  protocol?: string;
  chainId?: ChainId.Devnet | ChainId.Mainnet;
};
export type AggregatorStep = {
  token_in: string;
  token_out: string;
  amount_in: BigNumber;
  pool_address: string;
  function_name: string;
  arguments: Buffer[];
};
