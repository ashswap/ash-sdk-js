import { ChainId } from "../helper/token";

export const gasPrice = 1000000000;
export const version = 1;
export const gasLimit = 600000000;
export const maxGasLimit = 600000000;
export const gasLimitBuffer = 1.2;
export const gasPerDataByte = 1500;
export const shardId = 1;
export const blockTimeMs = 6000;
export const MVXProxyNetworkAddress: Record<ChainId, string> = {
    [ChainId.Mainnet]: "https://api.multiversx.com",
    [ChainId.Testnet]: "https://testnet-api.multiversx.com",
    [ChainId.Devnet]: "https://devnet-api.multiversx.com",
}