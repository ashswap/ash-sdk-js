import { Interaction } from "@multiversx/sdk-core/out";
import { AshNetwork } from "../src/const";
import { getDappContract } from "../src/const/ashswapConfig";
import { ChainId } from "../src/helper";
import { AshContractsManager } from "../src/helper/contracts";

describe("testing vosting escrow constract", () => {
    const veContract = new AshContractsManager(ChainId.Devnet).getVotingEscrowContract(
        getDappContract(AshNetwork.DevnetBeta).voteEscrowedContract
    );

    test("#withdraw", async () => {
        const tx = await veContract.withdraw();

        expect(tx).toBeInstanceOf(Interaction);
    });

   
});