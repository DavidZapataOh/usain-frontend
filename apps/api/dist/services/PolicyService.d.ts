import { Policy, CreatePolicyRequest, PaginationParams, PaginatedResponse } from '@usain/sdk';
export declare class PolicyService {
    private vincentClient;
    constructor();
    getPolicies(params?: PaginationParams): Promise<PaginatedResponse<Policy>>;
    getPolicy(policyId: string): Promise<Policy>;
    createPolicy(data: CreatePolicyRequest): Promise<Policy>;
    pausePolicy(policyId: string): Promise<Policy>;
    resumePolicy(policyId: string): Promise<Policy>;
    revokePolicy(policyId: string): Promise<void>;
    validatePolicy(policyId: string, intent: {
        pair: string;
        amount: string;
        userAddress: string;
    }): Promise<{
        isValid: boolean;
        reason?: string;
        remainingLimit?: string;
    }>;
    private validatePolicyData;
    getActivePolicy(): Promise<Policy | null>;
    getPolicyStats(policyId: string): Promise<{
        totalTransactions: number;
        totalVolumeUSD: number;
        averageLatencyMs: number;
        successRate: number;
        lastUsed: number;
    }>;
}
//# sourceMappingURL=PolicyService.d.ts.map