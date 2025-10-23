import { z } from 'zod';
// ===== CORE TYPES =====
export const TokenSchema = z.object({
    address: z.string(),
    symbol: z.string(),
    name: z.string(),
    decimals: z.number(),
    logoURI: z.string().optional(),
});
export const QuoteSchema = z.object({
    price: z.string(),
    fee: z.string(),
    route: z.array(z.string()),
    etaMs: z.number(),
    savingsUSD: z.string(),
    uniswapPrice: z.string().optional(),
    uniswapEtaMs: z.number().optional(),
});
export const IntentSchema = z.object({
    pair: z.string(),
    amount: z.string(),
    fromToken: z.string(),
    toToken: z.string(),
    userAddress: z.string(),
    nonce: z.string(),
    deadline: z.number(),
});
export const FillSchema = z.object({
    status: z.string(),
    fillId: z.string(),
    ts: z.number(),
    channelId: z.string(),
    latencyMs: z.number(),
    txHash: z.string().optional(),
});
// ===== POLICY TYPES =====
export const PolicyConditionSchema = z.object({
    type: z.enum(['spending_limit', 'allowed_pairs', 'time_limit']),
    value: z.union([z.string(), z.number(), z.array(z.string())]),
});
export const PolicySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    conditions: z.array(PolicyConditionSchema),
    isActive: z.boolean(),
    createdAt: z.number(),
    updatedAt: z.number(),
    pkpPublicKey: z.string(),
    pkpTokenId: z.string(),
});
export const CreatePolicyRequestSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    spendingLimitUSD: z.number(),
    allowedPairs: z.array(z.string()),
    expiryDays: z.number().optional(),
});
// ===== CHANNEL TYPES =====
export const ChannelBalanceSchema = z.object({
    token: z.string(),
    amount: z.string(),
    symbol: z.string(),
});
export const ChannelStatusSchema = z.object({
    channelId: z.string(),
    status: z.enum(['OPEN', 'CLOSED', 'SETTLING']),
    balances: z.array(ChannelBalanceSchema),
    participants: z.array(z.string()),
    nextNettingEtaSec: z.number(),
    lastSettlementBlock: z.number(),
    settlementCount: z.number(),
});
export const ChannelUpdateSchema = z.object({
    channelId: z.string(),
    from: z.string(),
    to: z.string(),
    token: z.string(),
    amount: z.string(),
    nonce: z.number(),
    signature: z.string(),
});
// ===== METRICS TYPES =====
export const KPIsSchema = z.object({
    gasSavedUSD: z.string(),
    latencyP50: z.number(),
    latencyP95: z.number(),
    volume24h: z.string(),
    users: z.string(),
    totalFills: z.number(),
    successRate: z.number(),
});
export const RecentFillSchema = z.object({
    pair: z.string(),
    amount: z.string(),
    price: z.string(),
    savingsUSD: z.string(),
    ts: z.number(),
    latencyMs: z.number(),
});
export const LiveMetricsSchema = z.object({
    kpis: KPIsSchema,
    lastFill: RecentFillSchema.optional(),
});
// ===== API REQUEST/RESPONSE TYPES =====
export const QuoteRequestSchema = z.object({
    fromToken: z.string(),
    toToken: z.string(),
    amount: z.string(),
    address: z.string(),
});
export const SubmitIntentRequestSchema = z.object({
    intent: IntentSchema,
    signature: z.string(),
    policyId: z.string(),
});
export const SubmitIntentResponseSchema = z.object({
    status: z.string(),
    fillId: z.string(),
    channelId: z.string(),
    latencyMs: z.number(),
    ts: z.number(),
    txHash: z.string().optional(),
});
// ===== EIP-712 TYPES =====
export const EIP712DomainSchema = z.object({
    name: z.string(),
    version: z.string(),
    chainId: z.number(),
    verifyingContract: z.string(),
});
export const EIP712TypedDataSchema = z.object({
    domain: EIP712DomainSchema,
    types: z.record(z.array(z.object({
        name: z.string(),
        type: z.string(),
    }))),
    primaryType: z.string(),
    message: z.record(z.any()),
});
// ===== CONFIGURATION TYPES =====
export const NetworkConfigSchema = z.object({
    chainId: z.number(),
    name: z.string(),
    rpcUrl: z.string(),
    blockExplorer: z.string(),
    settlementHubAddress: z.string(),
});
export const ClientConfigSchema = z.object({
    apiBaseUrl: z.string(),
    wsUrl: z.string(),
    envioHyperSyncUrl: z.string(),
    envioGqlUri: z.string(),
    litNetwork: z.string(),
    vincentPkpPublicKey: z.string(),
    yellowRpcUrl: z.string(),
    yellowNetwork: z.string(),
    networks: z.array(NetworkConfigSchema),
});
// ===== ERROR TYPES =====
export class SDKError extends Error {
    code;
    statusCode;
    details;
    constructor(message, code, statusCode, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'SDKError';
    }
}
export class ValidationError extends SDKError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}
export class NetworkError extends SDKError {
    constructor(message, statusCode, details) {
        super(message, 'NETWORK_ERROR', statusCode, details);
        this.name = 'NetworkError';
    }
}
export class SignatureError extends SDKError {
    constructor(message, details) {
        super(message, 'SIGNATURE_ERROR', 400, details);
        this.name = 'SignatureError';
    }
}
//# sourceMappingURL=types.js.map