import { Address } from "@multiversx/sdk-core/out";
import { Aggregator, ChainId } from "../src/helper";

// Permit the user to convert one EGLD to ASH with a 0.1% slippage.
// Based on the fee configuration, xPortal will also receive a small amount of fees.
const swap = async () => {
    const xPortalProtocol = 'erd...';
    const agService = new Aggregator({chainId: ChainId.Mainnet, protocol: xPortalProtocol});
    const interaction = await agService.aggregate('EGLD', 'ASH-a642d1', 1e18, 100);
    // remember to set the sender (caller) before sending the tx
    const tx = interaction.withSender(new Address('erd...')).check().buildTransaction();
    // sign and send tx to the network
    // sendTransactions({
    //     transactions: [tx],
    // })
}
// can get the paths to display and re-use the same results to create aggregated transactions
const swapWithPaths = async () => {
    const xPortalProtocol = 'erd...';
    const agService = new Aggregator({chainId: ChainId.Mainnet, protocol: xPortalProtocol});
    const sorswap = await agService.getPaths('EGLD', 'ASH-a642d1', 1e18);
    // use the response to display on the UI
    if (!sorswap) throw new Error(`Could not find any paths for EGLD to ASH`);
    const interaction = await agService.aggregateFromPaths(sorswap, 100);
    // remember to set the sender (caller) before sending the tx
    const tx = interaction.withSender(new Address('erd...')).check().buildTransaction();
    // sign and send tx to the network
    // sendTransactions({
    //     transactions: [tx],
    // })
}