import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import farmBribeAbi from "../../abi/farm_bribe.abi.json";
import { ChainId } from "../token";
import Contract from "./contract";

class FarmBribeContract extends Contract<typeof farmBribeAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, farmBribeAbi, chainId, apiAddress);
    }

    async addRewardAmount(sender: string, farmAddress: Address, tokenPayments: TokenTransfer[]) {
        const interaction = this.contract.methods
            .addRewardAmount([farmAddress])
            .withMultiESDTNFTTransfer(tokenPayments)
            .withSender(new Address(sender))
            .withGasLimit(50_000_000 + tokenPayments.length * 2_000_000);
        return this.interceptInteraction(interaction);
    }

    async claimReward(farmAddress: Address, tokenId: string){
        const interaction = this.contract.methods.claimReward([farmAddress, tokenId]).withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    /**
     * other endpoints
     */
    
    async commitTransferOwnership(farmAddress: Address) {
        const interaction = this.contract.methods
            .commitTransferOwnership([farmAddress])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async applyTransferOwnership() {
        const interaction = this.contract.methods
            .applyTransferOwnership()
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async addWhitelistToken(tokenId: string) {
        const interaction = this.contract.methods
            .addWhitelistToken([tokenId])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async removeWhitelistToken(tokenId: string) {
        const interaction = this.contract.methods
            .removeWhitelistToken([tokenId])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async checkpointRewardPerToken(farmAddress: Address, tokenId: string) {
        const interaction = this.contract.methods
            .checkpointRewardPerToken([farmAddress, tokenId])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async getClaimable(address: Address, farmAddress: Address, tokenId: string) {
        const interaction = this.contract.methods
            .getClaimable([address, farmAddress, tokenId])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    /**
     * @returns Address
     */
    async getAdmin() {
        const interaction = this.contract.methods
            .getAdmin()
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async getFutureAdmin() {
        const interaction = this.contract.methods
            .getFutureAdmin()
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async getFarmControllerAddress() {
        const interaction = this.contract.methods
            .getFarmControllerAddress()
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async getClaimsPerFarm(farmAddress: Address, tokenId: string) {
        const interaction = this.contract.methods
            .getClaimsPerFarm([farmAddress, tokenId])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async getRewardPerFarm(farmAddress: Address, tokenId: string) {
        const interaction = this.contract.methods
            .getRewardPerFarm([farmAddress, tokenId])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async getActivePeriod(farmAddress: Address, tokenId: string) {
        const interaction = this.contract.methods.getActivePeriod([farmAddress, tokenId]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }

    async getLastUserClaim(address: Address, farmAddress: Address, tokenId: string) {
        const interaction = this.contract.methods.getLastUserClaim([address, farmAddress, tokenId]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }

    async getRewardsPerFarm(address: Address) {
        const interaction = this.contract.methods
            .getRewardsPerFarm([address])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

    async getWhitelistTokens(tokenId: string) {
        const interaction = this.contract.methods
            .getWhitelistTokens([tokenId])
            .withGasLimit(50_000_000);
        return this.interceptInteraction(interaction);
    }

}

export default FarmBribeContract;
