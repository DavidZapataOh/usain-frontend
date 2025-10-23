// Auto-generated from USAINSettlementHub.sol
export const USAINSettlementHubABI = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "initialOwner",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "openChannel",
        "inputs": [
            {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "participants",
                "type": "address[]",
                "internalType": "address[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "closeChannel",
        "inputs": [
            {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "settleBatch",
        "inputs": [
            {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "tokens",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "from",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getChannelInfo",
        "inputs": [
            {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "open",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "participants",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "lastBlock",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "count",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "BatchSettled",
        "inputs": [
            {
                "name": "channelId",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "tokens",
                "type": "address[]",
                "indexed": false,
                "internalType": "address[]"
            },
            {
                "name": "from",
                "type": "address[]",
                "indexed": false,
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address[]",
                "indexed": false,
                "internalType": "address[]"
            },
            {
                "name": "amounts",
                "type": "uint256[]",
                "indexed": false,
                "internalType": "uint256[]"
            },
            {
                "name": "timestamp",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ChannelOpened",
        "inputs": [
            {
                "name": "channelId",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "participant",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ChannelClosed",
        "inputs": [
            {
                "name": "channelId",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            }
        ],
        "anonymous": false
    }
];
// Contract address (will be updated after deployment)
export const SETTLEMENT_HUB_ADDRESS = "0x0000000000000000000000000000000000000000";
//# sourceMappingURL=USAINSettlementHub.js.map