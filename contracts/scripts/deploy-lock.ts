import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Calculate unlockTime (e.g., 1 year from now)
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

    // Set the value to send with the deployment (for the payable constructor)
    // Example: 1 Gwei. Adjust as needed.
    const lockedAmount = ethers.parseUnits("1", "gwei");

    console.log(
        `Attempting to deploy Lock contract with unlock time ${unlockTime} and sending ${ethers.formatUnits(
            lockedAmount,
            "gwei"
        )} GWEI...`
    );

    const LockFactory = await ethers.getContractFactory("Lock");
    const lock = await LockFactory.deploy(unlockTime, { value: lockedAmount });

    await lock.waitForDeployment();
    const lockAddress = await lock.getAddress();

    console.log(
        `Lock contract with ${ethers.formatUnits(
            lockedAmount,
            "gwei"
        )} GWEI deployed to ${lockAddress}`
    );
    console.log(
        `Unlock time set to: ${new Date(unlockTime * 1000).toISOString()}`
    );

    // You can add verification steps here if using Hardhat Etherscan plugin, e.g.:
    // await hre.run("verify:verify", {
    //     address: lockAddress,
    //     constructorArguments: [unlockTime],
    // });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
