import { MVXProxyNetworkAddress } from "../../const";
import { ChainId } from "../token";
import AggregatorContract from "./aggregator";
import DAOBribeContract from "./daoBribeContract";
import DAOContract from "./daoContract";
import FarmBribeContract from "./farmBribeContract";
import FarmContract from "./farmContract";
import FarmControllerContract from "./farmControllerContract";
import FarmRouterContract from "./farmRouter";
import FeeDistributorContract from "./feeDistributorContract";
import PoolContract from "./pool";
import PoolV2Contract from "./poolV2Contract";
import RouterContract from "./routerContract";
import VotingEscrowContract from "./votingEscrowContract";
import WrappedEGLDContract from "./wrappedEGLD";

export class AshContractsManager {
    chainId: ChainId;
    apiAddress: string;
    constructor(chainId?: ChainId, apiAddress?: string) {
        this.chainId = chainId || ChainId.Mainnet;
        this.apiAddress = apiAddress || MVXProxyNetworkAddress[this.chainId];
    }

    private poolContracts: Record<string, PoolContract> = {};
    private poolV2Contracts: Record<string, PoolV2Contract> = {};
    private farmContracts: Record<string, FarmContract> = {};
    private veContracts: Record<string, VotingEscrowContract> = {};
    private feeDistributorContracts: Record<string, FeeDistributorContract> = {};
    private farmControllerContracts: Record<string, FarmControllerContract> = {};
    private farmBribeContracts: Record<string, FarmBribeContract> = {};
    private wrappedEGLDContracts: Record<string, WrappedEGLDContract> = {};
    private daoContracts: Record<string, DAOContract> = {};
    private routerContracts: Record<string, RouterContract> = {};
    private farmRouterContracts: Record<string, FarmRouterContract> = {};
    private daoBribeContracts: Record<string, DAOBribeContract> = {};
    private aggregatorContracts: Record<string, AggregatorContract> = {};

    getPoolContract(address: string) {
        return (
            this.poolContracts[address] ??
            (this.poolContracts[address] = new PoolContract(address, this.chainId, this.apiAddress))
        );
    };
    
    getPoolV2Contract(address: string) {
        return (
            this.poolV2Contracts[address] ??
            (this.poolV2Contracts[address] = new PoolV2Contract(address, this.chainId, this.apiAddress))
        );
    };
    
    getFarmContract = (address: string) => {
        return (
            this.farmContracts[address] ??
            (this.farmContracts[address] = new FarmContract(address, this.chainId, this.apiAddress))
        );
    };
    
    getVotingEscrowContract = (address: string) => {
        return (
            this.veContracts[address] ??
            (this.veContracts[address] = new VotingEscrowContract(address, this.chainId, this.apiAddress))
        );
    };
    getFeeDistributorContract = (address: string) => {
        return (
            this.feeDistributorContracts[address] ??
            (this.feeDistributorContracts[address] = new FeeDistributorContract(address, this.chainId, this.apiAddress))
        );
    };
    getFarmControllerContract = (address: string) => {
        return (
            this.farmControllerContracts[address] ??
            (this.farmControllerContracts[address] = new FarmControllerContract(address, this.chainId, this.apiAddress))
        );
    };
    getFarmBribeContract = (address: string) => {
        return (
            this.farmBribeContracts[address] ??
            (this.farmBribeContracts[address] = new FarmBribeContract(address, this.chainId, this.apiAddress))
        );
    };
    getWrappedEGLDContract = (address: string) => {
        return (
            this.wrappedEGLDContracts[address] ??
            (this.wrappedEGLDContracts[address] = new WrappedEGLDContract(address, this.chainId, this.apiAddress))
        );
    };
    getDAOContract = (address: string) => {
        return (
            this.daoContracts[address] ??
            (this.daoContracts[address] = new DAOContract(address, this.chainId, this.apiAddress))
        );
    };
    getRouterContract = (address: string) => {
        return (
            this.routerContracts[address] ??
            (this.routerContracts[address] = new RouterContract(address, this.chainId, this.apiAddress))
        );
    };
    getFarmRouterContract = (address: string) => {
        return (
            this.farmRouterContracts[address] ??
            (this.farmRouterContracts[address] = new FarmRouterContract(address, this.chainId, this.apiAddress))
        );
    };
    getDAOBribeContract = (address: string) => {
        return (
            this.daoBribeContracts[address] ??
            (this.daoBribeContracts[address] = new DAOBribeContract(address, this.chainId, this.apiAddress))
        );
    };
    getAggregatorContract = (address: string) => {
        return (
            this.aggregatorContracts[address] ??
            (this.aggregatorContracts[address] = new AggregatorContract(address, this.chainId, this.apiAddress))
        );
    };
}

export const ContractManager = new AshContractsManager();