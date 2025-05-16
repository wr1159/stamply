const hre = require("hardhat");

// EDIT these values as needed:
const REGISTRY_ADDRESS = "0x21fB2C1afac88201928A04AbBcEF9F40141e6124"; // Westend Asset Hub
// const REGISTRY_ADDRESS = "0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4"; // Bahamut
const STAMP_ADDRESS = "0x66b7a4AE4dAfAc28D852ea1f7E5B6C470330FD0D";

// const NFC_ID = hre.ethers.encodeBytes32String("stamp-f9435");
const NFC_ID = hre.ethers.encodeBytes32String("stamp-66b7a");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Registry: ${REGISTRY_ADDRESS}`);
    const registry = await hre.ethers.getContractAt(
        "StamplyRegistry",
        REGISTRY_ADDRESS,
        deployer
    );

    const tx = await registry.registerLandmarkExisting(NFC_ID, STAMP_ADDRESS);
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
