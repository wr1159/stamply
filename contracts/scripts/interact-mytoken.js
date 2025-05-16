const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const MyToken = await hre.ethers.getContractFactory("MyToken");

    // Replace with your deployed contract address
    const contractAddress = "0x478E6ebb4D015Aa9bf4063b4D499Ad1db58483B4";

    // Attach to existing contract
    const token = await MyToken.attach(contractAddress);

    // Get signers
    const [deployer] = await hre.ethers.getSigners();

    // Read contract state
    const name = await token.name();
    const symbol = await token.symbol();
    const totalSupply = await token.totalSupply();
    const balance = await token.balanceOf(deployer.address);

    console.log(`Token: ${name} (${symbol})`);
    console.log(
        `Total Supply: ${hre.ethers.formatUnits(totalSupply, 18)} tokens`
    );
    console.log(
        `Deployer Balance: ${hre.ethers.formatUnits(balance, 18)} tokens`
    );
    const paused = await token.pause();
    console.log(`Paused: ${paused.hash}`);
    const unpaused = await token.unpause();
    console.log(`Unpaused: ${unpaused.hash}`);
    const minted = await token.mint(deployer.address, 1000);
    console.log(`Minted: ${minted.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
