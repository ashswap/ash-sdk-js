import { Interaction } from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";
import { AshNetwork } from "../src/const";
import { getWrappedEgld } from "../src/const/wrappedEGLD";
import { ChainId } from "../src/helper";
import { AshContractsManager } from "../src/helper/contracts";

describe("testing wrapped EGLD contract", () => {
    const contract = new AshContractsManager(ChainId.Devnet).getWrappedEGLDContract(
        getWrappedEgld(AshNetwork.DevnetBeta).wegldContracts[0]
    );

    test("#wrapEgld", async () => {
        const tx = await contract.wrapEgld(new BigNumber(0));

        expect(tx).toBeInstanceOf(Interaction);
    });

   
});