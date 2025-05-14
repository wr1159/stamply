import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@parity/hardhat-polkadot";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    resolc: {
        compilerSource: "npm",
    },
    networks: {
        hardhat: {
            polkavm: true,
            // Uncomment to deploy to a local fork of the westend network.
            forking: {
                url: "wss://westend-asset-hub-rpc.polkadot.io",
            },
            // Uncomment to deploy to a local node using the node binary
            // nodeConfig: {
            //     nodeBinaryPath:
            //         "/Users/weirong/Developer/consensus-2025/contracts/binaries/substrate-node",
            //     rpcPort: 8000,
            //     dev: true,
            // },
            adapterConfig: {
                adapterBinaryPath:
                    "/Users/weirong/Developer/consensus-2025/contracts/binaries/eth-rpc",
                dev: true,
            },
        },
        localNode: {
            polkavm: true,
            url: `http://127.0.0.1:8545`,
        },
        westendAssetHub: {
            polkavm: true,
            url: "https://westend-asset-hub-eth-rpc.polkadot.io",
            accounts: [vars.get("WESTEND_HUB_PK")],
        },
    },
    ignition: {
        requiredConfirmations: 1,
    },
};

export default config;
