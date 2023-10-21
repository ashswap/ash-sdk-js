import routerAbi from "../../abi/router.abi.json";
import { ChainId } from "../token";
import Contract from "./contract";

class RouterContract extends Contract<typeof routerAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, routerAbi, chainId, apiAddress);
    }
}

export default RouterContract;
