import { ethers } from "hardhat";

const WESTEND_REGISTRY_ADDRESS = "0x21fB2C1afac88201928A04AbBcEF9F40141e6124"; // Westend Asset Hub
const NFC_ID = ethers.encodeBytes32String("example-nfc-id-1");
const NAME = "Eiffel Tower 2";
const SYMBOL = "EIFFEL";
const IMG = "https://i.imgur.com/BizZUKQ.png";
const DESC = "Tower.";
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying StampNFTwith account:", deployer.address);

    // Deploy the registry, setting the deployer as the initial owner
    const StampNFT = await ethers.getContractFactory("StampNFT");
    const stamp = await StampNFT.deploy(
        NAME,
        SYMBOL,
        // IMG,
        // DESC,
        NFC_ID,
        WESTEND_REGISTRY_ADDRESS
    );

    await stamp.waitForDeployment();
    const stampAddress = await stamp.getAddress();

    console.log(`StampNFT deployed to: ${stampAddress}`);
    console.log(`Owner: ${await stamp.owner()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
