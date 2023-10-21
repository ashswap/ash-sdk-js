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