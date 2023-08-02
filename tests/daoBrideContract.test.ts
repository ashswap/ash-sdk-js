import { Address, Transaction } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "../src/const/ashswapConfig";
import { ContractManager } from "../src/helper/contracts";

describe("testing dao bride constract", () => {
    const contract = ContractManager.getDAOBribeContract(
        ASHSWAP_CONFIG.dappContractDevnetAlpha.daoBribe
    );

    test("#claimReward", async () => {
        const tx = await contract.claimReward(0, []);

        expect(tx).toBeInstanceOf(Transaction);
    });

    test("#addRewardAmount", async () => {
        const tx = await contract.addRewardAmount(Address.Zero().bech32(), 0, []);

        expect(tx).toBeInstanceOf(Transaction);
    });

    test("#withdrawReward", async () => {
        const tx = await contract.withdrawReward(0);

        expect(tx).toBeInstanceOf(Transaction);
    });
   
});