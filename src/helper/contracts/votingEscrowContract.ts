import { TokenTransfer } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import votingEscowAbi from "../../abi/voting_escrow.abi.json";
import { ChainId } from "../token";
import Contract from "./contract";
class VotingEscrowContract extends Contract<typeof votingEscowAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, votingEscowAbi, chainId, apiAddress);
    }

    async createLock(tokenPayment: TokenTransfer, unlockTS: number) {
        let interaction = this.contract.methods.create_lock([unlockTS]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(100_000_000);// 7m
        return this.interceptInteraction(interaction);
    }

    async increaseAmount(tokenPayment: TokenTransfer) {
        let interaction = this.contract.methods.increase_amount([]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(100_000_000);//7m
        return this.interceptInteraction(interaction);
    }

    async increaseUnlockTime(unlockTS: number) {
        let interaction = this.contract.methods.increase_unlock_time([
            unlockTS,
        ]);
        interaction.withGasLimit(100_000_000);//7m
        return this.interceptInteraction(interaction);
    }

    async withdraw() {
        let interaction = this.contract.methods.withdraw([]);
        interaction.withGasLimit(100_000_000);//7m
        return this.interceptInteraction(interaction);
    }

    async getUserLocked(
        address: string
    ): Promise<{ amount: BigNumber; end: BigNumber }> {
        let interaction = this.contract.methods.getUserLocked([address]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }

    /**
     * other endponts
     */

    async checkpoint() {
        let interaction = this.contract.methods.checkpoint([]);
        interaction.withGasLimit(100_000_000);//7m
        return this.interceptInteraction(interaction);
    }

    async depositFor(tokenPayment: TokenTransfer, address: string) {
        let interaction = this.contract.methods.deposit_for([address]);
        interaction
            .withSingleESDTTransfer(tokenPayment)
            .withGasLimit(100_000_000);//7m
        return this.interceptInteraction(interaction);
    }

    async getUserBalanceAtTs(address: string, ts: number) {
        let interaction = this.contract.methods.getUserBalanceAtTs([address, ts]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getUserBalanceAtBlock(address: string, block: number) {
        let interaction = this.contract.methods.getUserBalanceAtBlock([address, block]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getTotalSupplyAtTs(ts: number) {
        let interaction = this.contract.methods.getTotalSupplyAtTs([ts]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getTotalSupplyAtBlock(block: number) {
        let interaction = this.contract.methods.getTotalSupplyAtBlock([block]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getLockedToken() {
        let interaction = this.contract.methods.getLockedToken([]);
        interaction.withGasLimit(100_000_000);//7m
        return this.interceptInteraction(interaction);
    }

    async getEpoch() {
        let interaction = this.contract.methods.getEpoch([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }

    async getPointHistory(
        epoch: number
    ): Promise<{ bias: BigNumber; slope: BigNumber; ts: number, block: number }> {
        let interaction = this.contract.methods.getPointHistory([epoch]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }

    async getUserPointHistory(
        address: string,
        epoch: number
    ): Promise<{ bias: BigNumber; slope: BigNumber; ts: number, block: number }> {
        let interaction = this.contract.methods.getPointHistory([address, epoch]);
        const { firstValue } = await this.runQuery(interaction);
        return firstValue?.valueOf();
    }

    async getUserPointEpoch(address: string) {
        let interaction = this.contract.methods.getUserPointEpoch([address]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }

    async getTotalLocked() {
        let interaction = this.contract.methods.getTotalLocked([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getSlopeChanges(time: number) {
        let interaction = this.contract.methods.getSlopeChanges([time]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }
}

export default VotingEscrowContract;
