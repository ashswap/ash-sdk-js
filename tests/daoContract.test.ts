import { Interaction } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { AshNetwork } from "../src/const";
import { getDappContract } from "../src/const/ashswapConfig";
import { ChainId } from "../src/helper";
import { AshContractsManager } from "../src/helper/contracts";

describe("testing dao constract", () => {
    const contractManager = new AshContractsManager(ChainId.Devnet);
    const contract = contractManager.getDAOContract(
        getDappContract(AshNetwork.DevnetBeta).dao
    );

    test("#execute", async () => {
        const tx = await contract.execute(0);

        expect(tx).toBeInstanceOf(Interaction);
    });

    test("#vote", async () => {
        const tx = await contract.vote(0, new BigNumber(0), new BigNumber(0));

        expect(tx).toBeInstanceOf(Interaction);
    });

});