// Configuration file for backend

export const config = {
    // Blockchain settings
    rpc: {
        bahamut: process.env.RPC_URL || "https://rpc1-horizon.bahamut.io",
        assetHub:
            process.env.ASSET_HUB_RPC_URL ||
            "https://westend-asset-hub-eth-rpc.polkadot.io",
    },

    // Contract addresses
    contracts: {
        registry:
            process.env.REGISTRY_ADDRESS ||
            "0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4",
        stamp:
            process.env.POLKADOT_ADDRESS ||
            "0xbf41Cc7AA17b40F453bb4375b0f7b172A99F0Cd7",
    },

    // Private key for the hot wallet
    wallet: {
        privateKey: process.env.PRIVATE_KEY,
    },

    // API settings
    api: {
        rateLimit: {
            requests: Number(process.env.RATE_LIMIT_REQUESTS || 10),
            windowSeconds: Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60),
        },
    },
};

// Validation
if (!config.wallet.privateKey) {
    console.warn(
        "WARNING: No private key set. The API will not be able to send transactions."
    );
}

export default config;
