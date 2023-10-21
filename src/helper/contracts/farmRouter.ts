import farmRouterAbi from "../../abi/farm_router.abi.json";
import { ChainId } from "../token";
import Contract from "./contract";

class FarmRouterContract extends Contract<typeof farmRouterAbi> {
    constructor(address: string, chainId?: ChainId, apiAddress?: string) {
        super(address, farmRouterAbi, chainId, apiAddress);
    }
}

export default FarmRouterContract;
