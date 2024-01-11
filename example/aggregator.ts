import { Address } from "@multiversx/sdk-core/out";
import { Aggregator, ChainId } from "../src/helper";

// dummy open modal service
const openModal = () => new Promise((resolve, reject) => {});

// Permit the user to convert one EGLD to ASH with a 0.1% slippage.
// Based on the fee configuration, xPortal will also receive a small amount of fees.
const swap = async () => {
    const xPortalProtocol = 'erd...';
    const agService = new Aggregator({chainId: ChainId.Mainnet, protocol: xPortalProtocol});
    const {sorResponse, getInteraction} = await agService.aggregate('EGLD', 'ASH-a642d1', 1e18, 100);
    // remember to set the sender (caller) before sending the tx
    const tx = await getInteraction(async (warning) => {
        console.log('tx warning:', warning);
        const swapAnyway = await openModal().then(() => true).catch(() => false);
        return swapAnyway;
    }).catch(() => null);
    if (!tx) return;
    tx.withSender(new Address('erd...')).check().buildTransaction();
    // sign and send tx to the network
    // sendTransactions({
    //     transactions: [tx],
    // })
}

// can get the paths to display and re-use the same results to create aggregated transactions
// below is the example to swap 1 EGLD to ASH with slippage 1% 
const swapWithPaths = async () => {
    const xPortalProtocol = 'erd...';
    const agService = new Aggregator({chainId: ChainId.Mainnet, protocol: xPortalProtocol});
    const sorswap = await agService.getPaths('EGLD', 'ASH-a642d1', 1e18, 1000);
    // use the response to display on the UI
    if (!sorswap) throw new Error(`Could not find any paths for EGLD to ASH`);
    // should set the slippage as the same as the slippage in getPaths
    const interaction = await agService.aggregateFromPaths(sorswap, 1000, async (warning) => {
        console.log('tx warning:', warning);
        const swapAnyway = await openModal().then(() => true).catch(() => false);
        return swapAnyway;
    });
    // remember to set the sender (caller) before sending the tx
    const tx = interaction.withSender(new Address('erd...')).check().buildTransaction();
    // sign and send tx to the network
    // sendTransactions({
    //     transactions: [tx],
    // })
}