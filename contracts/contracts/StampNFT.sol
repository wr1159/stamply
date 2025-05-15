// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StampNFT is Ownable, ERC721 {
    // string public imageUri;
    // string public description;
    bytes32 public nfcId; // To associate the NFT collection with a specific NFC tag

    uint256 private _nextTokenId;

    constructor(
        string memory name_,
        string memory symbol_,
        // string memory imageUri_,
        // string memory description_,
        bytes32 nfcId_,
        address initialOwner_ // This will be the StamplyRegistry contract
    ) ERC721(name_, symbol_) Ownable(initialOwner_) {
        // imageUri = imageUri_;
        // description = description_;
        nfcId = nfcId_;
    }

    function mint(address to) external virtual onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        // ERC721URIStorage allows setting tokenURI per token.
        // For now, we assume a collection-level URI or that the client will construct it.
        // If specific token URI is needed, it can be set here using _setTokenURI(tokenId, uri);
        return tokenId;
    }
}
