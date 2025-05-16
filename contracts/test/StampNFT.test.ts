import { ethers, network } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { StampNFT, StamplyRegistry } from "../typechain-types";
import { Signer } from "ethers";

describe("StampNFT (Simplified)", function () {
    let deployer: HardhatEthersSigner; // Also the initial owner of StamplyRegistry
    let user1: HardhatEthersSigner;
    let user2: HardhatEthersSigner;

    let registry: StamplyRegistry;
    let landmarkNftContract: StampNFT; // The deployed StampNFT instance for testing
    let landmarkNftAddress: string;

    const sampleNfcId = ethers.encodeBytes32String("nftTestNfcId");
    const sampleName = "NFT Test Landmark";
    const sampleSymbol = "NTL";
    const sampleImgUrl = "https://example.com/nft_image.png";
    const sampleDescription = "A specific landmark for NFT testing.";

    async function deployNftThroughRegistryFixture() {
        [deployer, user1, user2] = await ethers.getSigners();

        const registryFactory = await ethers.getContractFactory(
            "StamplyRegistry"
        );
        registry = await registryFactory
            .connect(deployer)
            .deploy(deployer.address);
        await registry.waitForDeployment();
        const registryAddress = await registry.getAddress();

        // Register a landmark to get a StampNFT instance
        const tx = await registry
            .connect(deployer)
            .registerLandmark(
                sampleNfcId,
                sampleName,
                sampleSymbol,
                sampleImgUrl,
                sampleDescription
            );
        const receipt = await tx.wait();
        if (!receipt?.logs)
            throw new Error("No logs found in registerLandmark transaction");

        let emittedCollectionAddress: string | undefined;
        for (const log of receipt.logs) {
            try {
                const parsedLog = registry.interface.parseLog(log as any);
                if (parsedLog && parsedLog.name === "LandmarkRegistered") {
                    emittedCollectionAddress = parsedLog.args.collection;
                    break;
                }
            } catch (e) {
                /* Ignore logs from other contracts or unparseable logs */
            }
        }

        if (!emittedCollectionAddress) {
            throw new Error(
                "LandmarkRegistered event not found or collection address not emitted."
            );
        }
        landmarkNftAddress = emittedCollectionAddress;
        landmarkNftContract = (await ethers.getContractAt(
            "StampNFT",
            landmarkNftAddress,
            deployer as any as Signer
        )) as StampNFT;

        return {
            registry,
            registryAddress,
            landmarkNftContract,
            landmarkNftAddress,
            deployer,
            user1,
            user2,
        };
    }

    describe("Deployment and Initialization", function () {
        it("Should be deployed with correct metadata and NFC ID", async function () {
            const { landmarkNftContract } = await loadFixture(
                deployNftThroughRegistryFixture
            );
            expect(await landmarkNftContract.name()).to.equal(sampleName);
            expect(await landmarkNftContract.symbol()).to.equal(sampleSymbol);
            expect(await landmarkNftContract.imageUri()).to.equal(sampleImgUrl);
            expect(await landmarkNftContract.description()).to.equal(
                sampleDescription
            );
            expect(await landmarkNftContract.nfcId()).to.equal(sampleNfcId);
        });

        it("Should set the StamplyRegistry as its owner", async function () {
            const { landmarkNftContract, registryAddress } = await loadFixture(
                deployNftThroughRegistryFixture
            );
            expect(await landmarkNftContract.owner()).to.equal(registryAddress);
        });
    });

    describe("Minting Access Control", function () {
        it("Should revert if mint() is called by an address that is not the owner (e.g., user1)", async function () {
            const { landmarkNftContract, user1 } = await loadFixture(
                deployNftThroughRegistryFixture
            );
            await expect(landmarkNftContract.connect(user1).mint(user1.address))
                .to.be.revertedWithCustomError(
                    landmarkNftContract,
                    "OwnableUnauthorizedAccount"
                )
                .withArgs(user1.address);
        });

        it("Owner (Registry) can mint (implicitly tested via StamplyRegistry.claimStamp)", async function () {
            // This is more an integration test point.
            // Direct minting by registry is tested in StamplyRegistry.test.ts
            // Here we confirm non-owner cannot mint.
            const { landmarkNftContract, user1, registryAddress } =
                await loadFixture(deployNftThroughRegistryFixture);
            expect(await landmarkNftContract.owner()).to.equal(registryAddress); // Registry is owner
            await expect(landmarkNftContract.connect(user1).mint(user1.address)) // User1 is not owner
                .to.be.revertedWithCustomError(
                    landmarkNftContract,
                    "OwnableUnauthorizedAccount"
                );
        });
    });
});
