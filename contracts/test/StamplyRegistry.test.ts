import { ethers, network } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { StampNFT, StamplyRegistry } from "../typechain-types";
import { Signer } from "ethers";

describe("StamplyRegistry (Simplified)", function () {
    let deployer: HardhatEthersSigner; // Also the initial owner of StamplyRegistry
    let owner: HardhatEthersSigner; // Alias for deployer for clarity in tests
    let user1: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let nonOwner: HardhatEthersSigner;

    let registry: StamplyRegistry;
    let registryAddress: string;

    const nfcId1 = ethers.encodeBytes32String("testNfcId1");
    const name1 = "Test Landmark 1";
    const symbol1 = "TLM1";
    const imgUrl1 = "https://example.com/image1.png";
    const description1 = "A wonderful test landmark 1.";

    const nfcId2 = ethers.encodeBytes32String("testNfcId2");
    const name2 = "Test Landmark 2";
    const symbol2 = "TLM2";
    const imgUrl2 = "https://example.com/image2.png";
    const description2 = "A wonderful test landmark 2.";

    async function deployRegistryFixture() {
        [deployer, user1, user2, nonOwner] = await ethers.getSigners();
        owner = deployer; // Owner of the registry

        const registryFactory = await ethers.getContractFactory(
            "StamplyRegistry"
        );
        registry = await registryFactory.connect(owner).deploy(owner.address);
        await registry.waitForDeployment();
        registryAddress = await registry.getAddress();
        return { registry, registryAddress, owner, user1, user2, nonOwner };
    }

    describe("Deployment", function () {
        it("Should set the deployer as the owner", async function () {
            const { registry, owner } = await loadFixture(
                deployRegistryFixture
            );
            expect(await registry.owner()).to.equal(owner.address);
        });
    });

    describe("registerLandmark", function () {
        it("Owner can register a new landmark, emits event, and sets StampNFT owner correctly", async function () {
            const { registry, owner } = await loadFixture(
                deployRegistryFixture
            );

            await expect(
                registry
                    .connect(owner)
                    .registerLandmark(
                        nfcId1,
                        name1,
                        symbol1,
                        imgUrl1,
                        description1
                    )
            )
                .to.emit(registry, "LandmarkRegistered")
                .withArgs(nfcId1, (value: any) => ethers.isAddress(value)); // Check nfcId and that an address is emitted

            const landmarkAddress = await registry.landmarks(nfcId1);
            expect(landmarkAddress).to.not.equal(ethers.ZeroAddress);

            const landmarkNft = (await ethers.getContractAt(
                "StampNFT",
                landmarkAddress,
                owner as any as Signer
            )) as StampNFT;
            expect(await landmarkNft.name()).to.equal(name1);
            expect(await landmarkNft.symbol()).to.equal(symbol1);
            expect(await landmarkNft.imageUri()).to.equal(imgUrl1);
            expect(await landmarkNft.description()).to.equal(description1);
            expect(await landmarkNft.nfcId()).to.equal(nfcId1);
            expect(await landmarkNft.owner()).to.equal(registryAddress); // Registry should be owner of StampNFT
        });

        it("Non-owner cannot register a landmark", async function () {
            const { registry, nonOwner } = await loadFixture(
                deployRegistryFixture
            );
            await expect(
                registry
                    .connect(nonOwner)
                    .registerLandmark(
                        nfcId1,
                        name1,
                        symbol1,
                        imgUrl1,
                        description1
                    )
            )
                .to.be.revertedWithCustomError(
                    registry,
                    "OwnableUnauthorizedAccount"
                )
                .withArgs(nonOwner.address);
        });

        it("Cannot register a landmark with an existing nfcId", async function () {
            const { registry, owner } = await loadFixture(
                deployRegistryFixture
            );
            await registry
                .connect(owner)
                .registerLandmark(
                    nfcId1,
                    name1,
                    symbol1,
                    imgUrl1,
                    description1
                ); // First registration
            await expect(
                registry
                    .connect(owner)
                    .registerLandmark(nfcId1, "New Name", "SYM", "img", "desc")
            )
                .to.be.revertedWithCustomError(registry, "LandmarkExists")
                .withArgs(nfcId1);
        });
    });

    describe("claimStamp", function () {
        async function fixtureWithRegisteredLandmark() {
            const base = await loadFixture(deployRegistryFixture);
            await base.registry
                .connect(base.owner)
                .registerLandmark(
                    nfcId1,
                    name1,
                    symbol1,
                    imgUrl1,
                    description1
                );
            const landmarkAddress = await base.registry.landmarks(nfcId1);
            const landmarkNft = (await ethers.getContractAt(
                "StampNFT",
                landmarkAddress,
                base.owner as any as Signer
            )) as StampNFT;
            return { ...base, landmarkAddress, landmarkNft };
        }

        it("Anyone can claim a stamp for a registered landmark, emits event, recipient gets NFT", async function () {
            const { registry, user1, user2, landmarkNft } = await loadFixture(
                fixtureWithRegisteredLandmark
            );

            // User1 claims a stamp for User2
            await expect(
                registry.connect(user1).claimStamp(nfcId1, user2.address)
            )
                .to.emit(registry, "StampClaimed")
                .withArgs(nfcId1, user2.address, 0); // First token ID is 0

            expect(await landmarkNft.ownerOf(0)).to.equal(user2.address);
            expect(await landmarkNft.balanceOf(user2.address)).to.equal(1);
        });

        it("Claiming multiple stamps for the same landmark mints sequential token IDs", async function () {
            const { registry, user1, user2, landmarkNft } = await loadFixture(
                fixtureWithRegisteredLandmark
            );

            // First claim
            await registry.connect(user1).claimStamp(nfcId1, user1.address);
            expect(await landmarkNft.ownerOf(0)).to.equal(user1.address);

            // Second claim
            await expect(
                registry.connect(user2).claimStamp(nfcId1, user2.address)
            )
                .to.emit(registry, "StampClaimed")
                .withArgs(nfcId1, user2.address, 1); // Second token ID is 1
            expect(await landmarkNft.ownerOf(1)).to.equal(user2.address);
            expect(await landmarkNft.balanceOf(user1.address)).to.equal(1);
            expect(await landmarkNft.balanceOf(user2.address)).to.equal(1);
        });

        it("Claiming stamps for different landmarks maintains separate token ID counters", async function () {
            const { registry, owner, user1, user2 } = await loadFixture(
                deployRegistryFixture
            );

            // Register landmark 1 and claim
            await registry
                .connect(owner)
                .registerLandmark(
                    nfcId1,
                    name1,
                    symbol1,
                    imgUrl1,
                    description1
                );
            const landmark1Address = await registry.landmarks(nfcId1);
            const landmarkNft1 = (await ethers.getContractAt(
                "StampNFT",
                landmark1Address,
                owner as any as Signer
            )) as StampNFT;
            await registry.connect(user1).claimStamp(nfcId1, user1.address); // Token ID 0 for landmark 1
            expect(await landmarkNft1.ownerOf(0)).to.equal(user1.address);

            // Register landmark 2 and claim
            await registry
                .connect(owner)
                .registerLandmark(
                    nfcId2,
                    name2,
                    symbol2,
                    imgUrl2,
                    description2
                );
            const landmark2Address = await registry.landmarks(nfcId2);
            const landmarkNft2 = (await ethers.getContractAt(
                "StampNFT",
                landmark2Address,
                owner as any as Signer
            )) as StampNFT;

            await expect(
                registry.connect(user2).claimStamp(nfcId2, user2.address)
            )
                .to.emit(registry, "StampClaimed")
                .withArgs(nfcId2, user2.address, 0); // Token ID 0 for landmark 2
            expect(await landmarkNft2.ownerOf(0)).to.equal(user2.address);

            // Claim another for landmark 1
            await registry.connect(user1).claimStamp(nfcId1, user2.address); // Token ID 1 for landmark 1
            expect(await landmarkNft1.ownerOf(1)).to.equal(user2.address);
        });

        it("Cannot claim a stamp for an unknown nfcId", async function () {
            const { registry, user1 } = await loadFixture(
                deployRegistryFixture
            );
            const unknownNfcId = ethers.encodeBytes32String("unknownNfcId");
            await expect(
                registry.connect(user1).claimStamp(unknownNfcId, user1.address)
            )
                .to.be.revertedWithCustomError(registry, "LandmarkUnknown")
                .withArgs(unknownNfcId);
        });

        it("Cannot claim a stamp for address(0) recipient", async function () {
            const { registry, user1, landmarkNft } = await loadFixture(
                fixtureWithRegisteredLandmark
            );
            // StampNFT._safeMint should revert.
            // The exact error message comes from OZ's ERC721: "ERC721InvalidReceiver"
            await expect(
                registry.connect(user1).claimStamp(nfcId1, ethers.ZeroAddress)
            )
                .to.be.revertedWithCustomError(
                    landmarkNft,
                    "ERC721InvalidReceiver"
                )
                .withArgs(ethers.ZeroAddress);
        });
    });

    describe("Main Flow from README", function () {
        it("Owner creates landmark, anyone can claim for other users, and they receive the NFT", async function () {
            const { registry, owner, user1, user2, nonOwner } =
                await loadFixture(deployRegistryFixture);

            // 1. Owner createsLandmark
            await expect(
                registry
                    .connect(owner)
                    .registerLandmark(
                        nfcId1,
                        name1,
                        symbol1,
                        imgUrl1,
                        description1
                    )
            ).to.emit(registry, "LandmarkRegistered");
            const landmarkAddress = await registry.landmarks(nfcId1);
            const landmarkNft = (await ethers.getContractAt(
                "StampNFT",
                landmarkAddress,
                owner as any as Signer
            )) as StampNFT;

            // 2. Owner (or anyone, here nonOwner) calls claim for other users (user2)
            // Let's use nonOwner to demonstrate it's not restricted to registry owner
            await expect(
                registry.connect(nonOwner).claimStamp(nfcId1, user2.address)
            )
                .to.emit(registry, "StampClaimed")
                .withArgs(nfcId1, user2.address, 0); // First token ID

            // 3. Verify user2 received the NFT
            expect(await landmarkNft.ownerOf(0)).to.equal(user2.address);
            expect(await landmarkNft.balanceOf(user2.address)).to.equal(1);
            expect(await landmarkNft.balanceOf(nonOwner.address)).to.equal(0);
        });
    });
});
