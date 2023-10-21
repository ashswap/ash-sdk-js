import { Address } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import farmControllerAbi from "../../abi/farm_controller.abi.json";
import { ChainId } from "../token";
import Contract from "./contract";

class FarmControllerContract extends Contract<typeof farmControllerAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, farmControllerAbi, chainId, apiAddress);
    }

    async voteForFarmWeights(farmAddress: Address, weight: BigNumber) {
        let interaction = this.contract.methods.voteForFarmWeights([
            farmAddress,
            weight,
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    /**
     * other endpoints
     */

    async commitTransferOwnership(farmAddress: Address) {
        let interaction = this.contract.methods.commitTransferOwnership([
            farmAddress,
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    async applyTransferOwnership() {
        let interaction = this.contract.methods.commitTransferOwnership([]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    async addFarm(farmAddress: Address, farmType: number, weight: BigNumber) {
        let interaction = this.contract.methods.addFarm([
            farmAddress,
            farmType,
            weight
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    async checkpoint() {
        let interaction = this.contract.methods.checkpoint([]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    async checkpointFarm(farmAddress: Address) {
        let interaction = this.contract.methods.checkpointFarm([
            farmAddress,
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    async getFarmRelativeWeight(farmAddress: Address, time: number) {
        let interaction = this.contract.methods.getFarmRelativeWeight([
            farmAddress,
            time
        ]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async addType(name: string, weight: BigNumber) {
        let interaction = this.contract.methods.addType([
            name,
            weight
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    async changeTypeWeight(farmType: number, weight: BigNumber) {
        let interaction = this.contract.methods.changeTypeWeight([
            farmType,
            weight
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

    async changeFarmWeight(farmAddress: Address, weight: BigNumber) {
        let interaction = this.contract.methods.changeFarmWeight([
            farmAddress,
            weight
        ]);
        interaction.withGasLimit(500_000_000);
        return this.interceptInteraction(interaction);
    }

}

export default FarmControllerContract;
