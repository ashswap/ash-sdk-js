import { Address, Interaction } from "@multiversx/sdk-core/out";
import { AshNetwork, getDappContract } from "../src/const";
import { ChainId } from "../src/helper";
import { AshContractsManager } from "../src/helper/contracts";

describe("testing dao bride constract", () => {
    const contract = new AshContractsManager(ChainId.Devnet).getDAOBribeContract(
        getDappContract(AshNetwork.DevnetBeta).daoBribe
    );

    test("#claimReward", async () => {
        const tx = await contract.claimReward(0, []);

        expect(tx).toBeInstanceOf(Interaction);
    });

    test("#addRewardAmount", async () => {
        const tx = await contract.addRewardAmount(Address.Zero().bech32(), 0, []);

        expect(tx).toBeInstanceOf(Interaction);
    });

    test("#withdrawReward", async () => {
        const tx = await contract.withdrawReward(0);

        expect(tx).toBeInstanceOf(Interaction);
    });
   
});