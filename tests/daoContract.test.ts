import { Address, SmartContract, Transaction } from "@multiversx/sdk-core/out";
import { ASHSWAP_CONFIG } from "../src/const/ashswapConfig";
import { ContractManager } from "../src/helper/contracts";
import BigNumber from "bignumber.js";

describe("testing dao constract", () => {
    const contract = ContractManager.getDAOContract(
        ASHSWAP_CONFIG.dappContractDevnetAlpha.dao
    );

    test("#execute", async () => {
        const tx = await contract.execute(0);

        expect(tx).toBeInstanceOf(Transaction);
    });

    test("#vote", async () => {
        const tx = await contract.vote(0, new BigNumber(0), new BigNumber(0));

        expect(tx).toBeInstanceOf(Transaction);
    });

});