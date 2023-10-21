import Contract from "./contract";
import agAbi from "../../abi/aggregator.abi.json";
import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { AggregatorStep } from "../aggregator";
import { ChainId } from "../token";

class AggregatorContract extends Contract<typeof agAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, agAbi, chainId, apiAddress);
    }

    /**
 * get protocol fees, protocol was set in the constructor.
 * @returns protocol fees ex: 100 = 0.1%
 */
    async getProtocolFeePercent(protocol: string): Promise<number> {
        if (!protocol || protocol === Address.Zero().bech32()) return 0;
        const query = this.contract.methods.getProtocolFeePercent([protocol]);
        const { firstValue } = await this.runQuery(query);
        console.log('fee', firstValue?.valueOf())
        return firstValue?.valueOf() || 0;
    }

    async aggregateEgld(
        egldAmount: BigNumber.Value,
        steps: AggregatorStep[],
        limits: { token: string; amount: BigNumber }[],
        protocol?: string
    ) {
        const params: any[] = [steps, limits];
        if (protocol && protocol !== Address.Zero().bech32()) {
            params.push(protocol);
        }
        const interaction = this.contract.methods.aggregateEgld(params);
        interaction
            .withValue(TokenTransfer.egldFromBigInteger(egldAmount))
        interaction.withGasLimit(20_000_000 + steps.length * 15_000_000);
        return this.interceptInteraction(interaction);
    }

    async aggregateEsdt(
        esdtPayment: TokenTransfer,
        steps: AggregatorStep[],
        limits: { token: string; amount: BigNumber }[],
        returnEgld: boolean,
        protocol?: string
    ) {
        const params: any[] = [steps, limits, returnEgld];
        if (protocol && protocol !== Address.Zero().bech32()) {
            params.push(protocol);
        }
        const interaction = this.contract.methods.aggregateEsdt(params);
        interaction
            .withSingleESDTTransfer(esdtPayment)
        interaction.withGasLimit(20_000_000 + steps.length * 15_000_000);
        return this.interceptInteraction(interaction);
    }
}

export default AggregatorContract;