import { defineChain } from "viem";

export const bahamutHorizon = defineChain({
    id: 2552,
    network: "Horizon",
    name: "Bahamut Horizon",
    nativeCurrency: { name: "Fasttoken", symbol: "FTN", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://rpc1-horizon.bahamut.io"],
            webSocket: ["wss://ws1.bahamut.io"],
        },
    },
    blockExplorers: {
        default: {
            name: "Ftnscan",
            url: "https://horizon.ftnscan.com",
        },
    },
});
