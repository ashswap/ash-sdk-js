import { Address } from "@multiversx/sdk-core/out";
import feeDistributorAbi from "../../abi/fee_distributor.abi.json";
import { ChainId } from "../token";
import Contract from "./contract";

class FeeDistributorContract extends Contract<typeof feeDistributorAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, feeDistributorAbi, chainId, apiAddress);
    }

    async claim(address: Address) {
        let interaction = this.contract.methods.claim([address]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    /**
     * other endponts
     */
    async checkpointToken() {
        let interaction = this.contract.methods.checkpoint_token();
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }


}

export default FeeDistributorContract;
