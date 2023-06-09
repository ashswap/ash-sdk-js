import { ashNetwork } from "../helper";
import { AshNetwork } from "./env";

type DappContracts = {
    voteEscrowedContract: string;
    feeDistributor: string;
    farmController: string;
    farmBribe: string;
    farmRouter: string;
    router: string;
    dao: string;
    daoBribe: string;
};
type DappContractConfig = {
    alpha: DappContracts;
    beta: DappContracts;
};
const dappContractDevnet: DappContractConfig = {
    beta: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgqynvujuhqhrn6qxf3cl49dmnpxt8mqqzc2gespkqv78",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqqxxm63jzwrwyyzc0qaawcxv8zfrpe4je2geshjzzwf",
        farmController:
            "erd1qqqqqqqqqqqqqpgq89qwwl0rw5vr9ej9uu76ycladefeg8d72ges7l09uv",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqug6hxflvk0yglgcvdhe40hv45tzzaxf42geslxp3gp",
        farmRouter: "erd1qqqqqqqqqqqqqpgqgnk6usl4ekqnlqv4aeh3fvsxddz64tfg2ges4tlpax",
        router: "erd1qqqqqqqqqqqqqpgqmj4lt9xd87fvafnyjwut66palhnpdr5v2gesvjepfr",
        dao: "erd1qqqqqqqqqqqqqpgqpdafdulu42f6g8pn9pavufgmdkltnctf2gesh48l44",
        daoBribe: "erd1qqqqqqqqqqqqqpgqqdt2ckhgn3yw6qxskawmywc98dv5jegg2ges40ygkh",
    },
    alpha: {
        voteEscrowedContract:
            "erd1qqqqqqqqqqqqqpgq7jclp49cydmjvxsx5ufurycujzrpwmv0rmcqqvrk7d",
        feeDistributor:
            "erd1qqqqqqqqqqqqqpgqsn7eq3gshrt70snx2fzxltshlg7h4gf6rmcqgsw4l3",
        farmController:
            "erd1qqqqqqqqqqqqqpgq420z44g8k8hc9ask4qwgz78dt7kdkk9mrmcqmh967w",
        farmBribe:
            "erd1qqqqqqqqqqqqqpgqqf669mq7ndfe9re6ggkvxltnkghfjertrmcqz8sgrg",
        farmRouter:
            "erd1qqqqqqqqqqqqqpgqh72fp6sat60d9nws64fahluglh22gyk5rmcqslvmnl",
        router: "erd1qqqqqqqqqqqqqpgq4jhlpam8wyju963p63a2fu9hdlcfqjm6rmcqarsvsx",
        dao: "erd1qqqqqqqqqqqqqpgqfns0zp9qacd52au5rhdq9e4t0yd0g2j5rmcq2g3gf8",
        daoBribe: "erd1qqqqqqqqqqqqqpgqyn2tfquw9ca8pfgzrfyuxmv6u0s7fcnlrmcqwyagxt"
    },
};

const dappContractMainnet: DappContracts = {
    voteEscrowedContract:
        "erd1qqqqqqqqqqqqqpgq58elfqng8edp0z83pywy3825vzhawfqp4fvsaldek8",
    feeDistributor:
        "erd1qqqqqqqqqqqqqpgqjrlge5rgml6d48tjgu3afqvems88lqzw4fvs9f7lhs",
    farmController:
        "erd1qqqqqqqqqqqqqpgqzhm689ehkacadr7elzkc3z70h6cqmz0q4fvsftax5t",
    farmBribe: "erd1qqqqqqqqqqqqqpgqgulmfcu8prrv2pmx3nqn5stqu3c42fsz4fvsa9rwdl",
    farmRouter: "",
    router: "",
    dao: "",
    daoBribe: "",
};


export function getDappContract() {
    switch (ashNetwork) {
        case AshNetwork.DevnetAlpha:
            return dappContractDevnet.alpha;
        case AshNetwork.DevnetBeta:
            return dappContractDevnet.beta;
        default:
            return dappContractMainnet;
    }
}
