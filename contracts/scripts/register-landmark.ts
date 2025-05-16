import { ethers } from "hardhat";
import { Signer } from "ethers";

// EDIT these values as needed:
// const REGISTRY_ADDRESS = "0xC3Cc8b8040DEbe4d44C160dA2beFf7499B0f39aF"; // Westend Asset Hub
const REGISTRY_ADDRESS = "0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4"; // Bahamut

const NFC_ID = ethers.encodeBytes32String("aquarium");
const NAME = "Ripley's Aquarium of Canada";
const SYMBOL = "AQUARIUM";
const IMG = "https://i.imgur.com/qNQA2ex.png";
const DESC =
    "An aquarium in Toronto, Canada with more than 10,000 aquatic creatures.";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);
    const registry = await ethers.getContractAt(
        "StamplyRegistry",
        REGISTRY_ADDRESS,
        deployer as unknown as Signer
    );

    console.log(`Registering landmark "${NAME}" with NFC ID: ${NFC_ID}...`);
    console.log(`Symbol: ${SYMBOL}, Image: ${IMG}`);
    console.log(`Description: ${DESC}`);

    const tx = await registry.registerLandmark(NFC_ID, NAME, SYMBOL, IMG, DESC);
    console.log(`Transaction hash: ${tx.hash}`);

    const receipt = await tx.wait();
    if (!receipt) {
        console.error("Transaction receipt is null, could not get event logs");
        return;
    }

    // Find the event in the logs
    let found = false;
    for (const log of receipt.logs) {
        try {
            const parsed = registry.interface.parseLog(log as any);
            if (parsed && parsed.name === "LandmarkRegistered") {
                found = true;
                console.log("✅ Landmark registered successfully!");
                console.log("NFC ID:", parsed.args.nfcId);
                console.log("Collection address:", parsed.args.collection);

                // Get the StampNFT contract to show additional details
                const landmarkNFT = await ethers.getContractAt(
                    "StampNFT",
                    parsed.args.collection,
                    deployer as unknown as Signer
                );
                console.log("Verification - StampNFT details:");
                console.log("  Name:", await landmarkNFT.name());
                console.log("  Symbol:", await landmarkNFT.symbol());
                console.log("  Owner:", await landmarkNFT.owner());
            }
        } catch (e) {
            // Ignore parsing errors for logs that aren't from our contract
        }
    }

    if (!found) {
        console.log(
            "⚠️ LandmarkRegistered event not found in the logs. The transaction may have failed silently."
        );
    }
}

main().catch((error) => {
    console.error("Error occurred:", error);
    process.exit(1);
});
