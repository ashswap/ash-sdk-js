import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import chunk from "lodash.chunk";
import farmAbi from "../../abi/farm.abi.json";
import { WEEK } from "../../const/ve";
import { FarmTokenAttrs } from "../../interface/farm";
import { ChainId } from "../token";
import Contract from "./contract";
class FarmContract extends Contract<typeof farmAbi> {
    private readonly MAX_TOKEN_PROCESS = 5;
    lastRewardBlockTs = 0;
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, farmAbi, chainId, apiAddress);
    }

    private _getBaseGasLimit() {
        const week = Math.floor(Date.now() / 1000 / WEEK) - Math.floor(this.lastRewardBlockTs / WEEK);
        // each interation by week of checkpoint cost 12_000_000 (farm contract) + checkpoint farm (farm controller) cost 10_000_000
        return week * 12_000_000 + 10_000_000;
    }

    private async _enterFarm(sender: string, tokenPayments: TokenTransfer[], selfBoost = false) {
        let interaction = this.contract.methods.enterFarm([selfBoost]);
        interaction.withMultiESDTNFTTransfer(
            tokenPayments,
        ).withSender(new Address(sender));
        interaction.withGasLimit(20_000_000 + tokenPayments.length * 2_000_000 + this._getBaseGasLimit());
        return this.interceptInteraction(interaction);
    }

    private async _exitFarm(sender: string, tokenPayments: TokenTransfer[]) {
        let interaction = this.contract.methods.exitFarm([]);
        interaction.withMultiESDTNFTTransfer(
            tokenPayments
        ).withSender(new Address(sender));
        interaction.withGasLimit(20_000_000 + tokenPayments.length * 2_000_000 + this._getBaseGasLimit());
        return this.interceptInteraction(interaction);
    }

    private async _claimRewards(
        sender: string,
        tokenPayments: TokenTransfer[],
        selfBoost = false
    ) {
        let interaction = this.contract.methods.claimRewards([selfBoost]);
        interaction.withMultiESDTNFTTransfer(
            tokenPayments
        ).withSender(new Address(sender));
        interaction.withGasLimit(20_000_000 + tokenPayments.length * 2_500_000 + this._getBaseGasLimit());
        return this.interceptInteraction(interaction);
    }

    async enterFarm(sender: string, tokenPayments: TokenTransfer[], selfBoost = false) {
        return await this._enterFarm(sender, tokenPayments.slice(0, this.MAX_TOKEN_PROCESS), selfBoost);
    }

    async exitFarm(sender: string, tokenPayments: TokenTransfer[]) {
        return Promise.all(
            chunk(tokenPayments, this.MAX_TOKEN_PROCESS).map((payments) =>
                this._exitFarm(sender, payments)
            )
        );
    }

    async claimRewards(sender: string, tokenPayments: TokenTransfer[], selfBoost = false) {
        return Promise.all(
            chunk(tokenPayments, this.MAX_TOKEN_PROCESS).map((payments) =>
                this._claimRewards(sender, payments, selfBoost)
            )
        );
    }

    async calculateRewardsForGivenPosition(
        wei: BigNumber,
        attrs: FarmTokenAttrs
    ) {
        let interaction =
            this.contract.methods.calculateRewardsForGivenPosition([
                wei,
                attrs,
            ]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getSlopeBoosted(address: string) {
        let interaction = this.contract.methods.getSlopeBoosted([address]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    withLastRewardBlockTs(ts: number) {
        this.lastRewardBlockTs = ts;
        return this;
    }

    /**
     * other endpoints
     */

    async checkpointFarmRewards() {
        const interaction = this.contract.methods.checkpointFarmRewards([]);
        return this.interceptInteraction(interaction);
    }

    async startProduceRewards() {
        const interaction = this.contract.methods.startProduceRewards([]);
        return this.interceptInteraction(interaction);
    }

    async endProduceRewards() {
        const interaction = this.contract.methods.endProduceRewards([]);
        return this.interceptInteraction(interaction);
    }

    async pause() {
        const interaction = this.contract.methods.pause([]);
        return this.interceptInteraction(interaction);
    }

    async resume() {
        const interaction = this.contract.methods.resume([]);
        return this.interceptInteraction(interaction);
    }

    async getMaxTokenToProcess() {
        let interaction = this.contract.methods.getMaxTokenToProcess([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }

    async setMaxTokenToProcess(maxTokenProcess: number) {
        const interaction = this.contract.methods.setMaxTokenToProcess([maxTokenProcess]);
        return this.interceptInteraction(interaction);
    }

    async getFarmTokenSupply() {
        let interaction = this.contract.methods.getFarmTokenSupply([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getFarmTokenId() {
        const interaction = this.contract.methods.getFarmTokenId([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as string) || "";
    }

    async setFarmTokenId(tokenId: string) {
        const interaction = this.contract.methods.getFarmTokenId([tokenId]);
        return this.interceptInteraction(interaction);
    }

    async getFarmingTokenId() {
        const interaction = this.contract.methods.getFarmingTokenId([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as string) || "";
    }

    async getRewardTokenId() {
        const interaction = this.contract.methods.getRewardTokenId([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as string) || "";
    }

    async getProduceRewardEnabled() {
        let interaction = this.contract.methods.getProduceRewardEnabled([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as boolean) || false;
    }

    async getLastRewardBlockTs() {
        let interaction = this.contract.methods.getLastRewardBlockTs([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as number) || 0;
    }

    async getDivisionSafetyConstant() {
        let interaction = this.contract.methods.getDivisionSafetyConstant([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getRewardPerSec() {
        let interaction = this.contract.methods.getRewardPerSec([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async getRewardPerShare() {
        let interaction = this.contract.methods.getRewardPerShare([]);
        const { firstValue } = await this.runQuery(interaction);
        return (firstValue?.valueOf() as BigNumber) || new BigNumber(0);
    }

    async setAdditionalRewards(tokenId: string, rewardPerSec: BigNumber, periodRewardEnd: number) {
        const interaction = this.contract.methods.setAdditionalRewards([tokenId, rewardPerSec, periodRewardEnd]);
        return this.interceptInteraction(interaction);
    }


}

export default FarmContract;
