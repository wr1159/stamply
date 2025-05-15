// Configuration file for backend

export const config = {
    // Blockchain settings
    rpc: {
        url: process.env.RPC_URL || "https://rpc1-horizon.bahamut.io",
    },

    // Contract addresses
    contracts: {
        registry:
            process.env.REGISTRY_ADDRESS ||
            "0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4",
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
