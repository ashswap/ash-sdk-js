import {
    AbiRegistry,
    Address,
    ArgSerializer,
    EndpointParameterDefinition,
    Interaction,
    ResultsParser,
    SmartContract,
} from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { MVXProxyNetworkAddress, gasLimitBuffer, gasPrice, maxGasLimit } from '../../const/dappConfig';
import { ChainId } from '../token';

type AbiType = {
    types: Record<string, any>;
};
export default class Contract<T extends AbiType = any> {
    protected chainId: ChainId;
    protected proxy: ProxyNetworkProvider;;

    protected resultParser = new ResultsParser();
    address: Address;
    contract: SmartContract;
    abiRegistry: AbiRegistry;

    constructor(address: string, abi: T, chainId?: ChainId, apiAddress?: string) {
        this.chainId = chainId || ChainId.Mainnet;
        this.proxy = new ProxyNetworkProvider(apiAddress || MVXProxyNetworkAddress[this.chainId]);
        this.address = new Address(address);
        this.abiRegistry = AbiRegistry.create(abi as any);
        this.contract = new SmartContract({
            address: this.address,
            abi: this.abiRegistry,
        });
    }
    protected getProxy() {
        return this.proxy;
    }

    protected interceptInteraction(interaction: Interaction) {
        interaction
            .withChainID(this.chainId)
            .withGasPrice(gasPrice)
            .withGasLimit(
                Math.min(
                    Math.floor(interaction.getGasLimit().valueOf() * gasLimitBuffer),
                    maxGasLimit
                )
            );
        return interaction;
    }

    protected async runQuery(interaction: Interaction) {
        const res = await this.getProxy().queryContract(
            interaction.check().buildQuery()
        );
        return this.resultParser.parseQueryResponse(res, interaction.getEndpoint());
    }

    protected getAbiType(typeName: string) {
        const type = this.abiRegistry.customTypes.find(
            (t) => t.getName() === typeName
        );
        if (!type) throw new Error('invalid custom type');
        return type;
    }

    parseCustomType<U = any>(data: string, typeName: keyof T['types']): U {
        const arg = new ArgSerializer();
        const type = this.getAbiType(typeName as string);
        return arg
            .buffersToValues(
                [Buffer.from(data, 'base64')],
                [new EndpointParameterDefinition('foo', 'bar', type)]
            )[0]
            ?.valueOf();
    }
}
