const hre = require("hardhat");

// EDIT these values as needed:
const STAMP_ADDRESS = "0x66b7a4AE4dAfAc28D852ea1f7E5B6C470330FD0D";
const RECIPIENT = "0x12Ede541Bcf2BaA4b8865378fF4ceb3C8e39970b";

async function main() {
    const [caller] = await hre.ethers.getSigners();
    const registry = await hre.ethers.getContractAt(
        "StampNFT",
        STAMP_ADDRESS,
        caller
    );

    console.log(`STAMPNFT: ${STAMP_ADDRESS}`);

    const tx = await registry.mint(RECIPIENT);
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
            if (parsed && parsed.name === "StampClaimed") {
                found = true;
                console.log("✅ Stamp claimed successfully!");
                console.log("NFC ID:", parsed.args.nfcId);
                console.log("Recipient:", parsed.args.to);
                console.log("Token ID:", parsed.args.tokenId.toString());
            }
        } catch (e) {
            // Ignore parsing errors for logs that aren't from our contract
        }
    }

    if (!found) {
        console.log(
            "⚠️ StampClaimed event not found in the logs. The transaction may have failed silently."
        );
    }
}

main().catch((error) => {
    console.error("Error occurred:", error);
    process.exit(1);
});
