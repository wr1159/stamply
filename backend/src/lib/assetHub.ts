import { defineChain } from "viem";

// Configure the Asset Hub chain
export const assetHub = defineChain({
    id: 420420421,
    name: "Westend Asset Hub",
    network: "westend-asset-hub",
    nativeCurrency: {
        decimals: 18,
        name: "WND",
        symbol: "WND",
    },
    rpcUrls: {
        default: {
            http: ["https://westend-asset-hub-eth-rpc.polkadot.io"],
        },
    },
});
