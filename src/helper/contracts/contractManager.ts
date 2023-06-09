import { AshNetwork } from "../../const/env";
import FarmBribeContract from "./farmBribeContract";
import FarmContract from "./farmContract";
import FarmControllerContract from "./farmControllerContract";
import FeeDistributorContract from "./feeDistributorContract";
import PoolContract from "./pool";
import PoolV2Contract from "./poolV2Contract";
import VotingEscrowContract from "./votingEscrowContract";
import WrappedEGLDContract from "./wrappedEGLD";

const poolContracts: Record<string, PoolContract> = {};
const poolV2Contracts: Record<string, PoolV2Contract> = {};
const farmContracts: Record<string, FarmContract> = {};
const veContracts: Record<string, VotingEscrowContract> = {};
const feeDistributorContracts: Record<string, FeeDistributorContract> = {};
const farmControllerContracts: Record<string, FarmControllerContract> = {};
const farmBribeContracts: Record<string, FarmBribeContract> = {};
const wrappedEGLDContracts: Record<string, WrappedEGLDContract> = {};
const getPoolContract = (address: string, ) => {
    return (
        poolContracts[address] ??
        (poolContracts[address] = new PoolContract(address))
    );
};

const getPoolV2Contract = (address: string) => {
    return (
        poolV2Contracts[address] ??
        (poolV2Contracts[address] = new PoolV2Contract(address))
    );
};

const getFarmContract = (address: string) => {
    return (
        farmContracts[address] ??
        (farmContracts[address] = new FarmContract(address))
    );
};

const getVotingEscrowContract = (address: string) => {
    return (
        veContracts[address] ??
        (veContracts[address] = new VotingEscrowContract(address))
    );
};
const getFeeDistributorContract = (address: string) => {
    return (
        feeDistributorContracts[address] ??
        (feeDistributorContracts[address] = new FeeDistributorContract(address))
    );
};
const getFarmControllerContract = (address: string) => {
    return (
        farmControllerContracts[address] ??
        (farmControllerContracts[address] = new FarmControllerContract(address))
    );
};
const getFarmBribeContract = (address: string) => {
    return (
        farmBribeContracts[address] ??
        (farmBribeContracts[address] = new FarmBribeContract(address))
    );
};
const getWrappedEGLDContract = (address: string) => {
    return (
        wrappedEGLDContracts[address] ??
        (wrappedEGLDContracts[address] = new WrappedEGLDContract(address))
    );
};

export let ashNetwork = AshNetwork.Mainnet
const setAshNetwork = (network: AshNetwork) => {
    ashNetwork = network
}

export const ContractManager = {
    getPoolContract,
    getFarmContract,
    getVotingEscrowContract,
    getFeeDistributorContract,
    getFarmControllerContract,
    getFarmBribeContract,
    getPoolV2Contract,
    getWrappedEGLDContract,
    setAshNetwork
};