import { IESDTInfo } from "../helper/token/token";
import BigNumber from "bignumber.js";

export enum EPoolType {
    PlainPool, LendingPool, MetaPool, PoolV2
}
export default interface IPool {
    address: string;
    tokens: IESDTInfo[];
    lpToken: IESDTInfo;
    type: EPoolType;
}

export interface RemoveLiquidityAttributes {
    token: string,
    attribute: string,
    amount_removed: BigNumber
}

export interface RemoveLiquidityResultType {
    burn_amount: BigNumber, 
    tokens: RemoveLiquidityAttributes[]
}

export interface TokenAttributes {
    reserve: BigNumber,
    rate: BigNumber,
}

export interface AddLiquidityAttributes {
    token: string,
    attribute: TokenAttributes,
    amount_added: BigNumber,
    total_fee: BigNumber,
    admin_fee: BigNumber,
}

export interface AddLiquidityResultType {
    mint_amount: BigNumber,
    tokens: AddLiquidityAttributes[]
}

export interface ExchangeAttributes {
    token: string,
    attribute: TokenAttributes,
    final_amount: BigNumber,
}

export interface ExchangeResultType {
    total_fee: BigNumber,
    admin_fee: BigNumber,
    token_in: ExchangeAttributes,
    token_out: ExchangeAttributes
}