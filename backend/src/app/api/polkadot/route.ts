import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import config from "@/config";
import { stampNFTAbi } from "@/lib/abis/StampNFT";
import { isValidEthereumAddress } from "@/lib/isEthAddress";
import { assetHub } from "@/lib/assetHub";
// Create the wallet account from private key
const account = privateKeyToAccount(config.wallet.privateKey as `0x${string}`);

// Initialize viem clients
const publicClient = createPublicClient({
    chain: assetHub,
    transport: http(config.rpc.assetHub),
});

const walletClient = createWalletClient({
    account,
    chain: assetHub,
    transport: http(config.rpc.assetHub),
});

// API endpoint to claim an NFT based on an NFC ID
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { toAddress } = body;

        // Validate request parameters
        if (!toAddress) {
            return NextResponse.json(
                {
                    error: "Missing required parameters: toAddress is required",
                },
                { status: 400 }
            );
        }

        // Validate Ethereum address format
        if (!isValidEthereumAddress(toAddress)) {
            return NextResponse.json(
                { error: "Invalid Ethereum address format" },
                { status: 400 }
            );
        }

        console.log(
            `Claiming stamp ${config.contracts.stamp} for recipient: ${toAddress}...`
        );

        // Simulate the transaction to check if it would succeed
        const { request: simulateRequest } =
            await publicClient.simulateContract({
                // address: config.contracts.stamp as `0x${string}`,
                address: "0x66b7a4AE4dAfAc28D852ea1f7E5B6C470330FD0D",
                abi: stampNFTAbi,
                functionName: "mint",
                args: [toAddress as `0x${string}`],
                account,
            });

        // Execute the transaction
        const hash = await walletClient.writeContract(simulateRequest);
        console.log(`Transaction hash: ${hash}`);

        // Wait for transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Return successful response with event data
        return NextResponse.json({
            success: true,
            transactionHash: hash,
            blockNumber: receipt.blockNumber.toString(),
            toAddress: toAddress,
        });
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error("Error claiming stamp:", error);

        if (error.message?.includes("execution reverted")) {
            return NextResponse.json(
                { error: "Transaction reverted: " + error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to claim stamp: " + error.message },
            { status: 500 }
        );
    }
}
