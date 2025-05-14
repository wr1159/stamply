import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying StamplyRegistry with account:", deployer.address);

    // Deploy the registry, setting the deployer as the initial owner
    const RegistryFactory = await ethers.getContractFactory("StamplyRegistry");
    const registry = await RegistryFactory.deploy(deployer.address);

    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();

    console.log(`StamplyRegistry deployed to: ${registryAddress}`);
    console.log(`Owner: ${await registry.owner()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
