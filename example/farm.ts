import { Address, TokenTransfer } from "@multiversx/sdk-core/out";
import { IMetaESDT } from "../src/interface/tokens";
import BigNumber from "bignumber.js";
import { FarmBoostInfo, FarmTokenAttrs } from "../src/interface/farm";
import { getFarm } from "../src/const/farms";
import { AshContractsManager, ChainId, calcYieldBoost, calcYieldBoostFromFarmToken } from "../src/helper";
import { getDappContract } from "../src/const/ashswapConfig";

const contractManager = new AshContractsManager(ChainId.Mainnet);
const farmAddress = "erd1qqqqqqqqqqqqqpgqe9hhqvvw9ssj6y388pf6gznwhuavhkzc4fvs0ra2fe"

stake()

async function stake() {
    const farm = getFarm(farmAddress);
    const farmContract = contractManager.getFarmContract(
        farm.farm_address
    );
    const stakeAmt = new BigNumber(1);

    const farmTokenInWallet: IMetaESDT[] = [];

    const tokenPayments = farmTokenInWallet.map((t) =>
        TokenTransfer.metaEsdtFromBigInteger(
            t.collection,
            t.nonce,
            t.balance,
            farm.farm_token_decimal
        )
    );
    tokenPayments.unshift(
        TokenTransfer.fungibleFromBigInteger(
            farm.farming_token_id,
            stakeAmt,
            farm.farming_token_decimal
        )
    );
    const tx = await farmContract.enterFarm(
        Address.Zero().bech32(),
        tokenPayments,
    );
    return tx;
}

async function unstake() {
    const farm = getFarm(farmAddress);
    const farmContract = contractManager.getFarmContract(
        farm.farm_address
    );

    const farmToken: IMetaESDT[] = [];

    const tokenPayments = farmToken.map((t) =>
        TokenTransfer.metaEsdtFromBigInteger(
            t.collection,
            t.nonce,
            t.balance
        )
    );
    const tx = await farmContract.exitFarm(
        Address.Zero().bech32(),
        tokenPayments,
    );
    return tx;
}

async function claim() {
    const farm = getFarm(farmAddress);
    const farmContract = contractManager.getFarmContract(
        farm.farm_address
    );

    const farmToken: IMetaESDT[] = [];

    const tokenPayments = farmToken.map((t) =>
        TokenTransfer.metaEsdtFromBigInteger(
            t.collection,
            t.nonce,
            t.balance,
            farm.farm_token_decimal
        )
    );
    const tx = await farmContract.claimRewards(
        Address.Zero().bech32(),
        tokenPayments,
    );
    return tx;
}

async function calculateRewardsForGivenPosition() {
    const farm = getFarm(farmAddress);
    const farmContract = contractManager.getFarmContract(
        farm.farm_address
    );

    const farmToken: IMetaESDT[] = [];
    const estimateds = await Promise.all(
        farmToken.map((t) => {
            return farmContract.calculateRewardsForGivenPosition(
                t.balance,
                farmContract.parseCustomType<FarmTokenAttrs>(
                    t.attributes,
                    "FarmTokenAttributes"
                )
            );
        })
    );
    const queryReward = estimateds.reduce((s, e) => s.plus(e), new BigNumber(0));
    return queryReward;
}

async function getSlopeBoosted() {
    const farm = getFarm(farmAddress);
    const farmContract = contractManager.getFarmContract(
        farm.farm_address
    );

    return await farmContract.getSlopeBoosted(
        Address.Zero().bech32(),
    );
}

async function queryFarm() {
    const farm = getFarm(farmAddress);
    const farmContract = contractManager.getFarmContract(
        farm.farm_address
    );

    const farmTokenId = await farmContract.getFarmTokenId();
    const rewardTokenId = await farmContract.getRewardTokenId();
    const farmingTokenId = await farmContract.getFarmingTokenId();
    const rewardPerSec = await farmContract.getRewardPerSec();
    const rewardPerShare = await farmContract.getRewardPerShare();
    const lastRewardBlockTs = await farmContract.getLastRewardBlockTs();
    const divisionSafetyConstant = await farmContract.getDivisionSafetyConstant();
}

async function getBoost() {
    const farm = getFarm(farmAddress);
    const farmContract = contractManager.getFarmContract(
        farm.farm_address
    );
    const farmTokenSupply = await farmContract.getFarmTokenSupply();
    const token: IMetaESDT = {
        identifier: "",
        collection: "",
        attributes: "",
        nonce: 0,
        type: "NonFungibleESDT",
        name: "",
        creator: "",
        isWhitelistedStorage: false,
        balance: new BigNumber(0),
        decimals: 0,
        ticker: ""
    }

    const farmTokenAttr = farmContract.parseCustomType<FarmTokenAttrs>(
        token.attributes,
        "FarmTokenAttributes"
    );
    const ownerAddress = farmTokenAttr.booster.bech32();
    const locked = await contractManager.getVotingEscrowContract(
        getDappContract().voteEscrowedContract
    ).getUserLocked(ownerAddress);
    const veSupply = new BigNumber(0);
    const unlockTs = locked.end;

    const slope = token.balance
        .div(farmTokenAttr.initial_farm_amount)
        .multipliedBy(farmTokenAttr.slope_used);
    const ve = slope.multipliedBy(unlockTs.minus(Math.floor(Date.now() / 1000)));
    const perLP = farmTokenAttr.initial_farm_amount.div(
        farmTokenAttr.initial_farming_amount
    );
    const lpAmt = token.balance
    .div(perLP)
    .integerValue(BigNumber.ROUND_FLOOR);

    const lpLockedAmt = new BigNumber(0); // farming token balance

    const veForMaxBoost = lpAmt
    .multipliedBy(veSupply)
    .div(lpLockedAmt);

    const currentBoost: FarmBoostInfo = {
        boost: calcYieldBoostFromFarmToken(
            farmTokenSupply,
            token.balance,
            lpAmt,
            farm
        ),
        veForBoost: ve
    }

    const maxBoost: FarmBoostInfo = {
        boost: calcYieldBoost(
            lpAmt,
            lpLockedAmt,
            veForMaxBoost,
            veSupply,
            farmTokenSupply,
            token.balance
        ),
        veForBoost: veForMaxBoost
    }
}