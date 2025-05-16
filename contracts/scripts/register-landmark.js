const hre = require("hardhat");

// EDIT these values as needed:
const REGISTRY_ADDRESS = "0x94c719Aa2Bf7d18D6e7f3d263118274a5bd16558"; // Westend Asset Hub (Old without register existing landmark)
// const REGISTRY_ADDRESS = "0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4"; // Bahamut

const NFC_ID = hre.ethers.encodeBytes32String("example-nfc-id-1");
const NAME = "Eiffel Tower";
const SYMBOL = "EIFFEL";
const IMG =
    "https://i.natgeofe.com/k/c41b4f59-181c-4747-ad20-ef69987c8d59/eiffel-tower-night.jpg";
const DESC = "The famous Paris landmark.";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Registry: ${REGISTRY_ADDRESS}`);
    const registry = await hre.ethers.getContractAt(
        "StamplyRegistry",
        REGISTRY_ADDRESS,
        deployer
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
            const parsed = registry.interface.parseLog(log);
            if (parsed && parsed.name === "LandmarkRegistered") {
                found = true;
                console.log("✅ Landmark registered successfully!");
                console.log("NFC ID:", parsed.args.nfcId);
                console.log("Collection address:", parsed.args.collection);

                // Get the StampNFT contract to show additional details
                const landmarkNFT = await hre.ethers.getContractAt(
                    "StampNFT",
                    parsed.args.collection,
                    deployer
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
    process.exitCode = 1;
});
