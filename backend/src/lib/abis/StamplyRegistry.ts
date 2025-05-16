export const registryAbi = [
    // Event definitions
    {
        type: "event",
        name: "LandmarkRegistered",
        inputs: [
            {
                name: "nfcId",
                type: "bytes32",
                indexed: true,
            },
            {
                name: "collection",
                type: "address",
                indexed: true,
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "StampClaimed",
        inputs: [
            {
                name: "nfcId",
                type: "bytes32",
                indexed: true,
            },
            {
                name: "to",
                type: "address",
                indexed: true,
            },
            {
                name: "tokenId",
                type: "uint256",
                indexed: false,
            },
        ],
        anonymous: false,
    },

    // Error definitions
    {
        type: "error",
        name: "LandmarkExists",
        inputs: [
            {
                name: "nfcId",
                type: "bytes32",
            },
        ],
    },
    {
        type: "error",
        name: "LandmarkUnknown",
        inputs: [
            {
                name: "nfcId",
                type: "bytes32",
            },
        ],
    },

    // Function definitions - Ownable
    {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
    },

    // Main functions
    {
        type: "function",
        name: "registerLandmark",
        inputs: [
            {
                name: "nfcId",
                type: "bytes32",
            },
            {
                name: "name",
                type: "string",
            },
            {
                name: "symbol",
                type: "string",
            },
            {
                name: "img",
                type: "string",
            },
            {
                name: "description",
                type: "string",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "claimStamp",
        inputs: [
            {
                name: "nfcId",
                type: "bytes32",
            },
            {
                name: "to",
                type: "address",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "landmarks",
        inputs: [
            {
                name: "",
                type: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
    },
];
