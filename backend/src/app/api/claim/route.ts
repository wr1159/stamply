import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { registryAbi } from "@/lib/abis/StamplyRegistry";
import config from "@/config";
import { bahamutHorizon } from "@/lib/bahamutHorizon";

// Create the wallet account from private key
const account = privateKeyToAccount(config.wallet.privateKey as `0x${string}`);

// Initialize viem clients
const publicClient = createPublicClient({
    chain: bahamutHorizon,
    transport: http(config.rpc.url),
});

const walletClient = createWalletClient({
    account,
    chain: bahamutHorizon,
    transport: http(config.rpc.url),
});

// API endpoint to claim an NFT based on an NFC ID
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { nfcId, toAddress } = body;

        // Validate request parameters
        if (!nfcId || !toAddress) {
            return NextResponse.json(
                {
                    error: "Missing required parameters: nfcId and toAddress are required",
                },
                { status: 400 }
            );
        }

        // Convert nfcId to bytes32
        const nfcIdBytes32 = convertToBytes32(nfcId);

        // Validate Ethereum address format
        if (!isValidEthereumAddress(toAddress)) {
            return NextResponse.json(
                { error: "Invalid Ethereum address format" },
                { status: 400 }
            );
        }

        console.log(
            `Claiming stamp with NFC ID: ${nfcId} for recipient: ${toAddress}...`
        );

        // Simulate the transaction to check if it would succeed
        const { request: simulateRequest } =
            await publicClient.simulateContract({
                address: config.contracts.registry as `0x${string}`,
                abi: registryAbi,
                functionName: "claimStamp",
                args: [nfcIdBytes32, toAddress as `0x${string}`],
                account,
            });

        // Execute the transaction
        const hash = await walletClient.writeContract(simulateRequest);
        console.log(`Transaction hash: ${hash}`);

        // Wait for transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Check for the StampClaimed event
        const claimEvents = await publicClient.getContractEvents({
            address: config.contracts.registry as `0x${string}`,
            abi: registryAbi,
            eventName: "StampClaimed",
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
            args: {
                nfcId: nfcIdBytes32,
                to: toAddress as `0x${string}`,
            },
        });
        let tokenId = null;
        if (claimEvents.length === 1) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const ourEvent = claimEvents[0] as any;
            console.log("ourEvent:", ourEvent);
            tokenId = ourEvent.args?.tokenId;
        }

        // Return successful response with event data
        return NextResponse.json({
            success: true,
            transactionHash: hash,
            blockNumber: receipt.blockNumber.toString(),
            tokenId: tokenId?.toString(),
            nfcId: nfcId,
            toAddress: toAddress,
        });
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error("Error claiming stamp:", error);

        // Handle different error types with appropriate responses
        if (error.message?.includes("LandmarkUnknown")) {
            return NextResponse.json(
                { error: "Landmark not found for the given NFC ID" },
                { status: 404 }
            );
        }

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

// Helper function to convert string to bytes32
function convertToBytes32(input: string): `0x${string}` {
    // If it's already a hex string starting with 0x and 66 chars long (0x + 64 hex chars), assume it's bytes32
    if (input.startsWith("0x") && input.length === 66) {
        return input as `0x${string}`;
    }

    // Otherwise encode the string to bytes32
    // Pad with zeros if necessary to make it 32 bytes
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(input);
    const buffer = new Uint8Array(32).fill(0);

    // Copy the encoded text into the buffer (up to 32 bytes)
    buffer.set(encodedText.slice(0, 32));

    // Convert to hex string
    const hex = Array.from(buffer)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return `0x${hex}` as `0x${string}`;
}

// Helper function to validate Ethereum address format
function isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
