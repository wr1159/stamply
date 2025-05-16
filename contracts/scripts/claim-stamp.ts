import { ethers } from "hardhat";
import { Signer } from "ethers";

// EDIT these values as needed:
// const REGISTRY_ADDRESS = "0x21fB2C1afac88201928A04AbBcEF9F40141e6124"; // Westend Asset Hub
const REGISTRY_ADDRESS = "0x478e6ebb4d015aa9bf4063b4d499ad1db58483b4"; // Bahamut
const NFC_ID = ethers.encodeBytes32String("cntower");
const RECIPIENT = "0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb";

async function main() {
    const [caller] = await ethers.getSigners();
    const registry = await ethers.getContractAt(
        "StamplyRegistry",
        REGISTRY_ADDRESS,
        caller as unknown as Signer
    );

    console.log(
        `Claiming stamp with NFC ID: ${NFC_ID} for recipient: ${RECIPIENT}...`
    );

    const tx = await registry.claimStamp(NFC_ID, RECIPIENT);
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
