import { Policy, CreatePolicyRequest, ClientConfig } from '../types.js';
export declare class VincentClient {
    private pkpPublicKey;
    private litNetwork;
    constructor(config: ClientConfig);
    createPolicy(data: CreatePolicyRequest): Promise<Policy>;
    listPolicies(): Promise<Policy[]>;
    getPolicy(policyId: string): Promise<Policy>;
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
    private createPKP;
    private deployLitAction;
    private generatePolicyValidationCode;
    private buildPolicyConditions;
    private storePolicyMetadata;
    private queryUserPolicies;
    private queryPolicyById;
    private updatePolicyStatus;
    private revokePKPAccess;
    private cleanupLitAction;
    private checkSpendingLimit;
    private checkAllowedPairs;
    private checkTimeLimits;
}
//# sourceMappingURL=vincent.d.ts.map