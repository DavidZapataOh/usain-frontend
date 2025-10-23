export declare const USAINSettlementHubABI: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "initialOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "openChannel";
    readonly inputs: readonly [{
        readonly name: "channelId";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "participants";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "closeChannel";
    readonly inputs: readonly [{
        readonly name: "channelId";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "settleBatch";
    readonly inputs: readonly [{
        readonly name: "channelId";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "tokens";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "from";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "to";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "amounts";
        readonly type: "uint256[]";
        readonly internalType: "uint256[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getChannelInfo";
    readonly inputs: readonly [{
        readonly name: "channelId";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "open";
        readonly type: "bool";
        readonly internalType: "bool";
    }, {
        readonly name: "participants";
        readonly type: "address[]";
        readonly internalType: "address[]";
    }, {
        readonly name: "lastBlock";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "count";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "BatchSettled";
    readonly inputs: readonly [{
        readonly name: "channelId";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "tokens";
        readonly type: "address[]";
        readonly indexed: false;
        readonly internalType: "address[]";
    }, {
        readonly name: "from";
        readonly type: "address[]";
        readonly indexed: false;
        readonly internalType: "address[]";
    }, {
        readonly name: "to";
        readonly type: "address[]";
        readonly indexed: false;
        readonly internalType: "address[]";
    }, {
        readonly name: "amounts";
        readonly type: "uint256[]";
        readonly indexed: false;
        readonly internalType: "uint256[]";
    }, {
        readonly name: "timestamp";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ChannelOpened";
    readonly inputs: readonly [{
        readonly name: "channelId";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "participant";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ChannelClosed";
    readonly inputs: readonly [{
        readonly name: "channelId";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }];
    readonly anonymous: false;
}];
export type USAINSettlementHub = typeof USAINSettlementHubABI;
export type BatchSettledEvent = {
    channelId: string;
    tokens: string[];
    from: string[];
    to: string[];
    amounts: bigint[];
    timestamp: bigint;
};
export type ChannelOpenedEvent = {
    channelId: string;
    participant: string;
};
export type ChannelClosedEvent = {
    channelId: string;
};
export type SettleBatchParams = {
    channelId: string;
    tokens: string[];
    from: string[];
    to: string[];
    amounts: bigint[];
};
export type OpenChannelParams = {
    channelId: string;
    participants: string[];
};
export declare const SETTLEMENT_HUB_ADDRESS = "0x0000000000000000000000000000000000000000";
//# sourceMappingURL=USAINSettlementHub.d.ts.map