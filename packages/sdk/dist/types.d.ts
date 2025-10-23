import { z } from 'zod';
export declare const TokenSchema: z.ZodObject<{
    address: z.ZodString;
    symbol: z.ZodString;
    name: z.ZodString;
    decimals: z.ZodNumber;
    logoURI: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string | undefined;
}, {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI?: string | undefined;
}>;
export declare const QuoteSchema: z.ZodObject<{
    price: z.ZodString;
    fee: z.ZodString;
    route: z.ZodArray<z.ZodString, "many">;
    etaMs: z.ZodNumber;
    savingsUSD: z.ZodString;
    uniswapPrice: z.ZodOptional<z.ZodString>;
    uniswapEtaMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    price: string;
    fee: string;
    route: string[];
    etaMs: number;
    savingsUSD: string;
    uniswapPrice?: string | undefined;
    uniswapEtaMs?: number | undefined;
}, {
    price: string;
    fee: string;
    route: string[];
    etaMs: number;
    savingsUSD: string;
    uniswapPrice?: string | undefined;
    uniswapEtaMs?: number | undefined;
}>;
export declare const IntentSchema: z.ZodObject<{
    pair: z.ZodString;
    amount: z.ZodString;
    fromToken: z.ZodString;
    toToken: z.ZodString;
    userAddress: z.ZodString;
    nonce: z.ZodString;
    deadline: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    fromToken: string;
    toToken: string;
    amount: string;
    pair: string;
    userAddress: string;
    nonce: string;
    deadline: number;
}, {
    fromToken: string;
    toToken: string;
    amount: string;
    pair: string;
    userAddress: string;
    nonce: string;
    deadline: number;
}>;
export declare const FillSchema: z.ZodObject<{
    status: z.ZodString;
    fillId: z.ZodString;
    ts: z.ZodNumber;
    channelId: z.ZodString;
    latencyMs: z.ZodNumber;
    txHash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    fillId: string;
    channelId: string;
    latencyMs: number;
    ts: number;
    txHash?: string | undefined;
}, {
    status: string;
    fillId: string;
    channelId: string;
    latencyMs: number;
    ts: number;
    txHash?: string | undefined;
}>;
export declare const PolicyConditionSchema: z.ZodObject<{
    type: z.ZodEnum<["spending_limit", "allowed_pairs", "time_limit"]>;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodArray<z.ZodString, "many">]>;
}, "strip", z.ZodTypeAny, {
    value: (string | number | string[]) & (string | number | string[] | undefined);
    type: "spending_limit" | "allowed_pairs" | "time_limit";
}, {
    value: (string | number | string[]) & (string | number | string[] | undefined);
    type: "spending_limit" | "allowed_pairs" | "time_limit";
}>;
export declare const PolicySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    conditions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["spending_limit", "allowed_pairs", "time_limit"]>;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodArray<z.ZodString, "many">]>;
    }, "strip", z.ZodTypeAny, {
        value: (string | number | string[]) & (string | number | string[] | undefined);
        type: "spending_limit" | "allowed_pairs" | "time_limit";
    }, {
        value: (string | number | string[]) & (string | number | string[] | undefined);
        type: "spending_limit" | "allowed_pairs" | "time_limit";
    }>, "many">;
    isActive: z.ZodBoolean;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    pkpPublicKey: z.ZodString;
    pkpTokenId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    conditions: {
        value: (string | number | string[]) & (string | number | string[] | undefined);
        type: "spending_limit" | "allowed_pairs" | "time_limit";
    }[];
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
    pkpPublicKey: string;
    pkpTokenId: string;
    description?: string | undefined;
}, {
    name: string;
    id: string;
    conditions: {
        value: (string | number | string[]) & (string | number | string[] | undefined);
        type: "spending_limit" | "allowed_pairs" | "time_limit";
    }[];
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
    pkpPublicKey: string;
    pkpTokenId: string;
    description?: string | undefined;
}>;
export declare const CreatePolicyRequestSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    spendingLimitUSD: z.ZodNumber;
    allowedPairs: z.ZodArray<z.ZodString, "many">;
    expiryDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    spendingLimitUSD: number;
    allowedPairs: string[];
    description?: string | undefined;
    expiryDays?: number | undefined;
}, {
    name: string;
    spendingLimitUSD: number;
    allowedPairs: string[];
    description?: string | undefined;
    expiryDays?: number | undefined;
}>;
export declare const ChannelBalanceSchema: z.ZodObject<{
    token: z.ZodString;
    amount: z.ZodString;
    symbol: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    amount: string;
    token: string;
}, {
    symbol: string;
    amount: string;
    token: string;
}>;
export declare const ChannelStatusSchema: z.ZodObject<{
    channelId: z.ZodString;
    status: z.ZodEnum<["OPEN", "CLOSED", "SETTLING"]>;
    balances: z.ZodArray<z.ZodObject<{
        token: z.ZodString;
        amount: z.ZodString;
        symbol: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        amount: string;
        token: string;
    }, {
        symbol: string;
        amount: string;
        token: string;
    }>, "many">;
    participants: z.ZodArray<z.ZodString, "many">;
    nextNettingEtaSec: z.ZodNumber;
    lastSettlementBlock: z.ZodNumber;
    settlementCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "OPEN" | "CLOSED" | "SETTLING";
    channelId: string;
    balances: {
        symbol: string;
        amount: string;
        token: string;
    }[];
    participants: string[];
    nextNettingEtaSec: number;
    lastSettlementBlock: number;
    settlementCount: number;
}, {
    status: "OPEN" | "CLOSED" | "SETTLING";
    channelId: string;
    balances: {
        symbol: string;
        amount: string;
        token: string;
    }[];
    participants: string[];
    nextNettingEtaSec: number;
    lastSettlementBlock: number;
    settlementCount: number;
}>;
export declare const ChannelUpdateSchema: z.ZodObject<{
    channelId: z.ZodString;
    from: z.ZodString;
    to: z.ZodString;
    token: z.ZodString;
    amount: z.ZodString;
    nonce: z.ZodNumber;
    signature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: string;
    nonce: number;
    signature: string;
    channelId: string;
    token: string;
    from: string;
    to: string;
}, {
    amount: string;
    nonce: number;
    signature: string;
    channelId: string;
    token: string;
    from: string;
    to: string;
}>;
export declare const KPIsSchema: z.ZodObject<{
    gasSavedUSD: z.ZodString;
    latencyP50: z.ZodNumber;
    latencyP95: z.ZodNumber;
    volume24h: z.ZodString;
    users: z.ZodString;
    totalFills: z.ZodNumber;
    successRate: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    gasSavedUSD: string;
    latencyP50: number;
    latencyP95: number;
    volume24h: string;
    users: string;
    totalFills: number;
    successRate: number;
}, {
    gasSavedUSD: string;
    latencyP50: number;
    latencyP95: number;
    volume24h: string;
    users: string;
    totalFills: number;
    successRate: number;
}>;
export declare const RecentFillSchema: z.ZodObject<{
    pair: z.ZodString;
    amount: z.ZodString;
    price: z.ZodString;
    savingsUSD: z.ZodString;
    ts: z.ZodNumber;
    latencyMs: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: string;
    price: string;
    savingsUSD: string;
    pair: string;
    latencyMs: number;
    ts: number;
}, {
    amount: string;
    price: string;
    savingsUSD: string;
    pair: string;
    latencyMs: number;
    ts: number;
}>;
export declare const LiveMetricsSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        gasSavedUSD: z.ZodString;
        latencyP50: z.ZodNumber;
        latencyP95: z.ZodNumber;
        volume24h: z.ZodString;
        users: z.ZodString;
        totalFills: z.ZodNumber;
        successRate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        gasSavedUSD: string;
        latencyP50: number;
        latencyP95: number;
        volume24h: string;
        users: string;
        totalFills: number;
        successRate: number;
    }, {
        gasSavedUSD: string;
        latencyP50: number;
        latencyP95: number;
        volume24h: string;
        users: string;
        totalFills: number;
        successRate: number;
    }>;
    lastFill: z.ZodOptional<z.ZodObject<{
        pair: z.ZodString;
        amount: z.ZodString;
        price: z.ZodString;
        savingsUSD: z.ZodString;
        ts: z.ZodNumber;
        latencyMs: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        amount: string;
        price: string;
        savingsUSD: string;
        pair: string;
        latencyMs: number;
        ts: number;
    }, {
        amount: string;
        price: string;
        savingsUSD: string;
        pair: string;
        latencyMs: number;
        ts: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    kpis: {
        gasSavedUSD: string;
        latencyP50: number;
        latencyP95: number;
        volume24h: string;
        users: string;
        totalFills: number;
        successRate: number;
    };
    lastFill?: {
        amount: string;
        price: string;
        savingsUSD: string;
        pair: string;
        latencyMs: number;
        ts: number;
    } | undefined;
}, {
    kpis: {
        gasSavedUSD: string;
        latencyP50: number;
        latencyP95: number;
        volume24h: string;
        users: string;
        totalFills: number;
        successRate: number;
    };
    lastFill?: {
        amount: string;
        price: string;
        savingsUSD: string;
        pair: string;
        latencyMs: number;
        ts: number;
    } | undefined;
}>;
export declare const QuoteRequestSchema: z.ZodObject<{
    fromToken: z.ZodString;
    toToken: z.ZodString;
    amount: z.ZodString;
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fromToken: string;
    toToken: string;
    amount: string;
    address: string;
}, {
    fromToken: string;
    toToken: string;
    amount: string;
    address: string;
}>;
export declare const SubmitIntentRequestSchema: z.ZodObject<{
    intent: z.ZodObject<{
        pair: z.ZodString;
        amount: z.ZodString;
        fromToken: z.ZodString;
        toToken: z.ZodString;
        userAddress: z.ZodString;
        nonce: z.ZodString;
        deadline: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        fromToken: string;
        toToken: string;
        amount: string;
        pair: string;
        userAddress: string;
        nonce: string;
        deadline: number;
    }, {
        fromToken: string;
        toToken: string;
        amount: string;
        pair: string;
        userAddress: string;
        nonce: string;
        deadline: number;
    }>;
    signature: z.ZodString;
    policyId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    intent: {
        fromToken: string;
        toToken: string;
        amount: string;
        pair: string;
        userAddress: string;
        nonce: string;
        deadline: number;
    };
    signature: string;
    policyId: string;
}, {
    intent: {
        fromToken: string;
        toToken: string;
        amount: string;
        pair: string;
        userAddress: string;
        nonce: string;
        deadline: number;
    };
    signature: string;
    policyId: string;
}>;
export declare const SubmitIntentResponseSchema: z.ZodObject<{
    status: z.ZodString;
    fillId: z.ZodString;
    channelId: z.ZodString;
    latencyMs: z.ZodNumber;
    ts: z.ZodNumber;
    txHash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    fillId: string;
    channelId: string;
    latencyMs: number;
    ts: number;
    txHash?: string | undefined;
}, {
    status: string;
    fillId: string;
    channelId: string;
    latencyMs: number;
    ts: number;
    txHash?: string | undefined;
}>;
export declare const EIP712DomainSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    chainId: z.ZodNumber;
    verifyingContract: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    name: string;
    version: string;
    verifyingContract: string;
}, {
    chainId: number;
    name: string;
    version: string;
    verifyingContract: string;
}>;
export declare const EIP712TypedDataSchema: z.ZodObject<{
    domain: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        chainId: z.ZodNumber;
        verifyingContract: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        chainId: number;
        name: string;
        version: string;
        verifyingContract: string;
    }, {
        chainId: number;
        name: string;
        version: string;
        verifyingContract: string;
    }>;
    types: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
    }, {
        type: string;
        name: string;
    }>, "many">>;
    primaryType: z.ZodString;
    message: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    message: Record<string, any>;
    domain: {
        chainId: number;
        name: string;
        version: string;
        verifyingContract: string;
    };
    types: Record<string, {
        type: string;
        name: string;
    }[]>;
    primaryType: string;
}, {
    message: Record<string, any>;
    domain: {
        chainId: number;
        name: string;
        version: string;
        verifyingContract: string;
    };
    types: Record<string, {
        type: string;
        name: string;
    }[]>;
    primaryType: string;
}>;
export declare const NetworkConfigSchema: z.ZodObject<{
    chainId: z.ZodNumber;
    name: z.ZodString;
    rpcUrl: z.ZodString;
    blockExplorer: z.ZodString;
    settlementHubAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
    settlementHubAddress: string;
}, {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
    settlementHubAddress: string;
}>;
export declare const ClientConfigSchema: z.ZodObject<{
    apiBaseUrl: z.ZodString;
    wsUrl: z.ZodString;
    envioHyperSyncUrl: z.ZodString;
    envioGqlUri: z.ZodString;
    litNetwork: z.ZodString;
    vincentPkpPublicKey: z.ZodString;
    yellowRpcUrl: z.ZodString;
    yellowNetwork: z.ZodString;
    networks: z.ZodArray<z.ZodObject<{
        chainId: z.ZodNumber;
        name: z.ZodString;
        rpcUrl: z.ZodString;
        blockExplorer: z.ZodString;
        settlementHubAddress: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        chainId: number;
        name: string;
        rpcUrl: string;
        blockExplorer: string;
        settlementHubAddress: string;
    }, {
        chainId: number;
        name: string;
        rpcUrl: string;
        blockExplorer: string;
        settlementHubAddress: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    apiBaseUrl: string;
    wsUrl: string;
    envioHyperSyncUrl: string;
    envioGqlUri: string;
    litNetwork: string;
    vincentPkpPublicKey: string;
    yellowRpcUrl: string;
    yellowNetwork: string;
    networks: {
        chainId: number;
        name: string;
        rpcUrl: string;
        blockExplorer: string;
        settlementHubAddress: string;
    }[];
}, {
    apiBaseUrl: string;
    wsUrl: string;
    envioHyperSyncUrl: string;
    envioGqlUri: string;
    litNetwork: string;
    vincentPkpPublicKey: string;
    yellowRpcUrl: string;
    yellowNetwork: string;
    networks: {
        chainId: number;
        name: string;
        rpcUrl: string;
        blockExplorer: string;
        settlementHubAddress: string;
    }[];
}>;
export type Token = z.infer<typeof TokenSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type Intent = z.infer<typeof IntentSchema>;
export type Fill = z.infer<typeof FillSchema>;
export type PolicyCondition = z.infer<typeof PolicyConditionSchema>;
export type Policy = z.infer<typeof PolicySchema>;
export type CreatePolicyRequest = z.infer<typeof CreatePolicyRequestSchema>;
export type ChannelBalance = z.infer<typeof ChannelBalanceSchema>;
export type ChannelStatus = z.infer<typeof ChannelStatusSchema>;
export type ChannelUpdate = z.infer<typeof ChannelUpdateSchema>;
export type KPIs = z.infer<typeof KPIsSchema>;
export type RecentFill = z.infer<typeof RecentFillSchema>;
export type LiveMetrics = z.infer<typeof LiveMetricsSchema>;
export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;
export type SubmitIntentRequest = z.infer<typeof SubmitIntentRequestSchema>;
export type SubmitIntentResponse = z.infer<typeof SubmitIntentResponseSchema>;
export type EIP712Domain = z.infer<typeof EIP712DomainSchema>;
export type EIP712TypedData = z.infer<typeof EIP712TypedDataSchema>;
export type NetworkConfig = z.infer<typeof NetworkConfigSchema>;
export type ClientConfig = z.infer<typeof ClientConfigSchema>;
export declare class SDKError extends Error {
    code: string;
    statusCode?: number | undefined;
    details?: any | undefined;
    constructor(message: string, code: string, statusCode?: number | undefined, details?: any | undefined);
}
export declare class ValidationError extends SDKError {
    constructor(message: string, details?: any);
}
export declare class NetworkError extends SDKError {
    constructor(message: string, statusCode?: number, details?: any);
}
export declare class SignatureError extends SDKError {
    constructor(message: string, details?: any);
}
export type SupportedNetwork = 'base-sepolia' | 'arbitrum-sepolia';
export type PolicyAction = 'pause' | 'resume' | 'revoke';
export type ChannelAction = 'open' | 'close' | 'settle';
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}
//# sourceMappingURL=types.d.ts.map