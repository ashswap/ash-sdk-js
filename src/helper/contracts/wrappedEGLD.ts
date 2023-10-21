import { TokenTransfer } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import wegldAbi from "../../abi/multiversx-wegld-swap-sc.abi.json";
import { ChainId } from "../token";
import Contract from "./contract";

class WrappedEGLDContract extends Contract<typeof wegldAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, wegldAbi, chainId, apiAddress);
    }

    async wrapEgld(amt: BigNumber) {
        let interaction = this.contract.methods.wrapEgld([]);
        interaction.withValue(amt);
        interaction.withGasLimit(5_000_000);
        return this.interceptInteraction(interaction);
    }

    async unwrapEgld(tokenPayment: TokenTransfer) {
        let interaction = this.contract.methods.unwrapEgld([]);
        interaction.withSingleESDTTransfer(tokenPayment)
        interaction.withGasLimit(5_000_000);
        return this.interceptInteraction(interaction);
    }

    /**
     * other endponts
     */

    async getLockedEgldBalance() {
        let interaction = this.contract.methods.getLockedEgldBalance([]);
        interaction.withGasLimit(5_000_000);
        return this.interceptInteraction(interaction);
    }

    async getWrappedEgldTokenId() {
        let interaction = this.contract.methods.getWrappedEgldTokenId([]);
        interaction.withGasLimit(5_000_000);
        return this.interceptInteraction(interaction);
    }

    async pause() {
        let interaction = this.contract.methods.pause([]);
        interaction.withGasLimit(5_000_000);
        return this.interceptInteraction(interaction);
    }

    async unpause() {
        let interaction = this.contract.methods.unpause([]);
        interaction.withGasLimit(5_000_000);
        return this.interceptInteraction(interaction);
    }

    async isPaused() {
        let interaction = this.contract.methods.isPaused([]);
        interaction.withGasLimit(5_000_000);
        return this.interceptInteraction(interaction);
    }
}

export default WrappedEGLDContract;
