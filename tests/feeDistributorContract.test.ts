import { Address, Interaction } from "@multiversx/sdk-core/out";
import { AshNetwork } from "../src/const";
import { getDappContract } from "../src/const/ashswapConfig";
import { ChainId } from "../src/helper";
import { AshContractsManager } from "../src/helper/contracts";

describe("testing fee distributor contract", () => {
    const fdContract = new AshContractsManager(ChainId.Devnet).getFeeDistributorContract(
        getDappContract(AshNetwork.DevnetBeta).feeDistributor
    );

    test("claim test case", async () => {
        const tx = await fdContract.claim(Address.Zero());

        expect(tx).toBeInstanceOf(Interaction);
    });

    test("checkpointToken test case", async () => {
        const tx = await fdContract.checkpointToken();

        expect(tx).toBeInstanceOf(Interaction);
    });
});