import { Address, Interaction } from "@multiversx/sdk-core/out";
import { AshNetwork } from "../src/const";
import { getDappContract } from "../src/const/ashswapConfig";
import { ChainId } from "../src/helper";
import { AshContractsManager } from "../src/helper/contracts";

describe("testing farm bride constract", () => {
    const contract = new AshContractsManager(ChainId.Devnet).getFarmBribeContract(
        getDappContract(AshNetwork.DevnetBeta).farmBribe
    );

    test("#claimReward", async () => {
        const tx = await contract.claimReward(Address.Zero(), "");

        expect(tx).toBeInstanceOf(Interaction);
    });

   
});