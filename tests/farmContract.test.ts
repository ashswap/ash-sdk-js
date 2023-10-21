import { Address, TokenTransfer, Interaction } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { AshNetwork } from "../src/const";
import { getFarms } from "../src/const/farms";
import { ChainId } from "../src/helper";
import { AshContractsManager } from "../src/helper/contracts";
import { IMetaESDT } from "../src/interface/tokens";

describe("testing farm constract", () => {
    const farm = getFarms(AshNetwork.DevnetBeta)[0]
    const farmContract = new AshContractsManager(ChainId.Devnet).getFarmContract(
        farm.farm_address
    );  

    test("#enterFarm", async () => {
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

        expect(tx).toBeInstanceOf(Interaction);
    });

    test("#exitFarm", async () => {
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

        expect(tx).toBeInstanceOf(Array);
    });

    test("#claimRewards", async () => {
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

        expect(tx).toBeInstanceOf(Array);
    });

    test("#checkpointFarmRewards", async () => {
        const tx = await farmContract.checkpointFarmRewards();

        expect(tx).toBeInstanceOf(Interaction);
    });

    test("#queryFarm", async () => {
        
        const farmTokenId = await farmContract.getFarmTokenId();
        const rewardTokenId = await farmContract.getRewardTokenId();
        const farmingTokenId = await farmContract.getFarmingTokenId();
        const rewardPerSec = await farmContract.getRewardPerSec();
        const rewardPerShare = await farmContract.getRewardPerShare();
        const lastRewardBlockTs = await farmContract.getLastRewardBlockTs();
        const divisionSafetyConstant = await farmContract.getDivisionSafetyConstant();
    });

   
});