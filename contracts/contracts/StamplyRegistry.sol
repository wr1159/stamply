// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./StampNFT.sol";

contract StamplyRegistry is Ownable {
    mapping(bytes32 => address) public landmarks;

    event LandmarkRegistered(bytes32 indexed nfcId, address indexed collection);
    event StampClaimed(
        bytes32 indexed nfcId,
        address indexed to,
        uint256 tokenId
    );

    error LandmarkExists(bytes32 nfcId);
    error LandmarkUnknown(bytes32 nfcId);

    constructor(address initialOwner) Ownable(initialOwner) {
        // No implementation address to store anymore
    }

    function registerLandmark(
        bytes32 nfcId,
        string memory name,
        string memory symbol,
        string memory img,
        string memory description
    ) external onlyOwner {
        if (landmarks[nfcId] != address(0)) {
            revert LandmarkExists(nfcId);
        }

        // Deploy a new StampNFT instance, making this registry its owner
        StampNFT newNftCollection = new StampNFT(
            name,
            symbol,
            // img,
            // description,
            nfcId,
            address(this)
        );

        landmarks[nfcId] = address(newNftCollection);
        emit LandmarkRegistered(nfcId, address(newNftCollection));
    }

    function registerLandmarkExisting(
        bytes32 nfcId,
        address collection
    ) external onlyOwner {
        landmarks[nfcId] = collection;
        emit LandmarkRegistered(nfcId, collection);
    }

    function claimStamp(bytes32 nfcId, address to) external {
        address collectionAddress = landmarks[nfcId];
        if (collectionAddress == address(0)) {
            revert LandmarkUnknown(nfcId);
        }

        // Get the StampNFT instance
        StampNFT nftCollection = StampNFT(collectionAddress);

        // Call mint on the StampNFT instance. This works because StamplyRegistry is the owner.
        uint256 tokenId = nftCollection.mint(to);
        emit StampClaimed(nfcId, to, tokenId);
    }
}
