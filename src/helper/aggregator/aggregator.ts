import { Address, Interaction, TokenTransfer } from '@multiversx/sdk-core/out';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import AggregatorContract from '../contracts/aggregator';
import { ChainId } from '../token';
import {
  AgResponse,
  AggregatorConfig,
  AggregatorStep,
  SorSwapResponse,
  SorSwapResponseFromServer,
} from './type';
import WrappedEGLDContract from '../contracts/wrappedEGLD';
const DEFAULT_CONFIG: Record<
  string,
  { API: string; CONTRACT: string; WEGLD: string; WEGLD_CONTRACT: string }
> = {
  D: {
    API: 'https://aggregator-devnet2.ashswap.io',
    CONTRACT: 'erd1qqqqqqqqqqqqqpgqzshqdqcdzdl43vhy7p7q8uhc5xzu5x7zh2usyz5kg6',
    WEGLD: 'WEGLD-a28c59',
    WEGLD_CONTRACT:
      'erd1qqqqqqqqqqqqqpgqpv09kfzry5y4sj05udcngesat07umyj70n4sa2c0rp',
  },
  '1': {
    API: 'https://aggregator.ashswap.io',
    CONTRACT: 'erd1qqqqqqqqqqqqqpgqcc69ts8409p3h77q5chsaqz57y6hugvc4fvs64k74v',
    WEGLD: 'WEGLD-bd4d79',
    WEGLD_CONTRACT:
      'erd1qqqqqqqqqqqqqpgqhe8t5jewej70zupmh44jurgn29psua5l2jps3ntjj3',
  },
};
const MAX_PERCENT = 100_000;

export class Aggregator {
  api: string;
  fee?: number;
  protocol?: string;
  chainId: ChainId;
  private aggregatorContract: AggregatorContract;
  private address: Address;

  constructor(config?: AggregatorConfig) {
    this.chainId = config?.chainId || ChainId.Mainnet;
    this.api = config?.api || this.defaultConfig.API;
    this.protocol = config?.protocol;
    this.fee =
      !!this.protocol && this.protocol !== Address.Zero().bech32()
        ? config?.fee
        : 0;

    this.address = new Address(this.defaultConfig.CONTRACT);
    this.aggregatorContract = new AggregatorContract(
      this.address.bech32(),
      this.chainId
    );
  }

  private get defaultConfig() {
    return DEFAULT_CONFIG[this.chainId];
  }

  private isEgld(id: string) {
    return id === 'EGLD';
  }

  private getTokenId(id: string) {
    return this.isEgld(id) ? this.defaultConfig.WEGLD : id;
  }

  /**
   * get all supported tokens
   * @returns list of supported tokens
   */
  async getTokens() {
    const res = await axios.get<
      Array<{ id: string; decimal?: number; coingeckoId?: string }>
    >(`${this.api}/tokens`);
    return res?.data || [];
  }

  /**
   *
   * @param from token id | EGLD
   * @param to token id | EGLD
   * @param amount amount of token "from" with decimals ex: 1 EGLD = 1e18
   * @param slippage default = 1_000 = 1%
   * @returns paths, rate, price impact..., return undefined if cannot find any paths
   */
  async getPaths(
    from: string,
    to: string,
    amount: BigNumber.Value,
    slippage = 1000
  ): Promise<SorSwapResponse | undefined> {
    if (this.getTokenId(from) === this.getTokenId(to)) {
      if (this.getTokenId(from) === this.defaultConfig.WEGLD) {
        const amt = new BigNumber(amount);
        const res: SorSwapResponse = {
          effectivePrice: 1,
          effectivePriceReserved: 1,
          marketSp: '0',
          priceImpact: 0,
          returnAmount: amt.div(1e18).toString(10),
          returnAmountConsiderGasFees: amt.toString(10),
          returnAmountWithDecimal: amt.toString(10),
          returnAmountWithoutSwapFees: amt.toString(10),
          tokenAddresses: [],
          swaps: [],
          swapAmount: amt.div(1e18).toString(10),
          swapAmountWithDecimal: amt.toString(10),
          tokenIn: from,
          tokenOut: to,
          routes: [],
          minReturnAmount: amt.div(1e18).toString(10),
          minReturnAmountWithDecimal: amt.toString(10),
          warning: 'None',
          __from: from,
          __to: to,
          __amount: new BigNumber(amount).toString(10),
        } as SorSwapResponse;
        return res;
      }
      return;
    }
    const fee =
      this.fee ??
      (this.protocol
        ? await this.aggregatorContract.getProtocolFeePercent(this.protocol)
        : 0);
    this.fee = fee;
    const amt = new BigNumber(amount)
      .multipliedBy(MAX_PERCENT - fee)
      .idiv(MAX_PERCENT)
      .toString(10);
    const data = await axios.get<SorSwapResponseFromServer>(
      `${this.api}/aggregate`,
      {
        params: {
          from: this.getTokenId(from),
          to: this.getTokenId(to),
          amount: amt,
        },
      }
    );
    const scale = new BigNumber(data.data.returnAmountWithDecimal).div(
      data.data.returnAmount
    );
    const minReturnAmountWithDecimal = new BigNumber(
      data.data.returnAmountWithDecimal
    )
      .multipliedBy(MAX_PERCENT - slippage)
      .idiv(MAX_PERCENT);
    return {
      ...data.data,
      minReturnAmount: minReturnAmountWithDecimal.div(scale).toString(10),
      minReturnAmountWithDecimal: minReturnAmountWithDecimal.toString(10),
      __from: from,
      __to: to,
      __amount: new BigNumber(amount).toString(10),
    } as SorSwapResponse;
  }

  /**
   *
   * @param from token id | EGLD
   * @param to token id | EGLD
   * @param amount amount of token "from" with decimals ex: 1 EGLD = 1e18
   * @param slippage 1% = 1_000
   * @returns agResponse
   */
  async aggregate(
    from: string,
    to: string,
    amount: BigNumber.Value,
    slippage: number
  ): Promise<AgResponse> {
    const res = await this.getPaths(from, to, amount, slippage);
    if (!res) throw new Error(`Could not find any paths for ${from} to ${to}`);
    return {
      sorResponse: res,
      getInteraction: async (resolveWarning) => {
        return await this.aggregateFromPaths(res, slippage, resolveWarning);
      },
    };
  }

  /**
   *
   * @param sorswap can get from getPaths methods
   * @param slippage 1% = 1_000
   * @param resolveWarning resolve and return true if the user confirm to swap anyway and vice versa
   * @returns interaction that is ready to sign and send to the network
   */
  async aggregateFromPaths(
    sorswap: SorSwapResponse,
    slippage: number,
    resolveWarning: (warning: string) => Promise<boolean> | boolean
  ): Promise<Interaction> {
    if (sorswap.warning && sorswap.warning !== 'None') {
      const resolved = await resolveWarning(sorswap.warning);
      if (!resolved)
        throw new Error(
          `Cannot resolve ${sorswap.warning} or users reject the transaction.`
        );
    }

    const {
      __from: from,
      __to: to,
      __amount: amount,
    } = (sorswap as SorSwapResponse & {
      __from: string;
      __to: string;
      __amount: string;
    }) || {};

    if (!sorswap || !from || !to || !amount)
      throw new Error('Invalid swap response');

    if (this.getTokenId(from) === this.getTokenId(to)) {
      const wegldContract = new WrappedEGLDContract(
        this.defaultConfig.WEGLD_CONTRACT,
        this.chainId
      );
      const isWrap = this.isEgld(from) && to === this.defaultConfig.WEGLD;
      const isUnwrap = this.isEgld(to) && from === this.defaultConfig.WEGLD;
      if (isWrap) {
        return await wegldContract.wrapEgld(new BigNumber(amount));
      }
      if (isUnwrap) {
        return await wegldContract.unwrapEgld(
          TokenTransfer.fungibleFromBigInteger(this.defaultConfig.WEGLD, amount)
        );
      }
      throw new Error('Invalid swap response');
    }

    if (
      this.getTokenId(from) !== sorswap.tokenIn ||
      this.getTokenId(to) !== sorswap.tokenOut
    )
      throw new Error('Invalid swap response');
    const protocol = this.protocol;

    const swaps = sorswap?.swaps || [];
    const hopTokenIds = sorswap?.tokenAddresses || [];
    const steps: AggregatorStep[] = swaps.map((s) => {
      const step: AggregatorStep = {
        token_in: s.assetIn,
        token_out: s.assetOut,
        amount_in: new BigNumber(s.amount),
        pool_address: s.poolId,
        function_name: s.functionName,
        arguments: s.arguments.map((arg) => Buffer.from(arg, 'base64')),
      };
      return step;
    });

    const hopLimits = hopTokenIds
      .filter((id) => id !== this.getTokenId(to))
      .map((id) => ({ token: id, amount: new BigNumber(0) }));
    const outputLimits = [
      {
        token: this.getTokenId(to),
        amount: new BigNumber(sorswap.returnAmountWithDecimal)
          .multipliedBy(MAX_PERCENT - slippage)
          .idiv(MAX_PERCENT),
      },
    ];
    if (this.isEgld(from)) {
      return await this.aggregatorContract.aggregateEgld(
        amount,
        steps,
        [...hopLimits, ...outputLimits],
        protocol
      );
    }
    return await this.aggregatorContract.aggregateEsdt(
      TokenTransfer.fungibleFromBigInteger(from, amount),
      steps,
      [...hopLimits, ...outputLimits],
      this.isEgld(to),
      protocol
    );
  }
}
