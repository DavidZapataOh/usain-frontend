import { SDKError } from '../types.js';
export class VincentClient {
    pkpPublicKey;
    litNetwork;
    constructor(config) {
        this.pkpPublicKey = config.vincentPkpPublicKey;
        this.litNetwork = config.litNetwork;
    }
    // ===== POLICY MANAGEMENT =====
    async createPolicy(data) {
        try {
            // Create PKP (Programmable Key Pair) for the policy
            const pkpData = await this.createPKP();
            // Create Lit Action for policy validation
            const litActionCode = this.generatePolicyValidationCode(data);
            await this.deployLitAction(litActionCode);
            // Create policy conditions
            const conditions = this.buildPolicyConditions(data);
            // Store policy metadata
            const policy = {
                id: `policy_${Date.now()}`,
                name: data.name,
                description: data.description,
                conditions,
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                pkpPublicKey: pkpData.publicKey,
                pkpTokenId: pkpData.tokenId,
            };
            // Store in Lit Protocol
            await this.storePolicyMetadata(policy);
            return policy;
        }
        catch (error) {
            throw new SDKError(`Failed to create policy: ${error.message}`, 'POLICY_CREATION_ERROR');
        }
    }
    async listPolicies() {
        try {
            // Query Lit Protocol for user's policies
            const policies = await this.queryUserPolicies();
            return policies;
        }
        catch (error) {
            throw new SDKError(`Failed to list policies: ${error.message}`, 'POLICY_LIST_ERROR');
        }
    }
    async getPolicy(policyId) {
        try {
            const policy = await this.queryPolicyById(policyId);
            if (!policy) {
                throw new SDKError(`Policy not found: ${policyId}`, 'POLICY_NOT_FOUND');
            }
            return policy;
        }
        catch (error) {
            throw new SDKError(`Failed to get policy: ${error.message}`, 'POLICY_GET_ERROR');
        }
    }
    async pausePolicy(policyId) {
        return this.updatePolicyStatus(policyId, false);
    }
    async resumePolicy(policyId) {
        return this.updatePolicyStatus(policyId, true);
    }
    async revokePolicy(policyId) {
        try {
            // Revoke PKP access
            await this.revokePKPAccess(policyId);
            // Mark policy as revoked
            await this.updatePolicyStatus(policyId, false);
            // Clean up Lit Action
            await this.cleanupLitAction(policyId);
        }
        catch (error) {
            throw new SDKError(`Failed to revoke policy: ${error.message}`, 'POLICY_REVOKE_ERROR');
        }
    }
    // ===== POLICY VALIDATION =====
    async validatePolicy(policyId, intent) {
        try {
            const policy = await this.getPolicy(policyId);
            if (!policy.isActive) {
                return { isValid: false, reason: 'Policy is inactive' };
            }
            // Check spending limit
            const spendingLimitCheck = await this.checkSpendingLimit(policy, intent);
            if (!spendingLimitCheck.isValid) {
                return spendingLimitCheck;
            }
            // Check allowed pairs
            const pairCheck = this.checkAllowedPairs(policy, intent.pair);
            if (!pairCheck.isValid) {
                return pairCheck;
            }
            // Check time limits
            const timeCheck = this.checkTimeLimits(policy);
            if (!timeCheck.isValid) {
                return timeCheck;
            }
            return { isValid: true };
        }
        catch (error) {
            throw new SDKError(`Failed to validate policy: ${error.message}`, 'POLICY_VALIDATION_ERROR');
        }
    }
    // ===== LIT PROTOCOL INTEGRATION =====
    async createPKP() {
        // This would integrate with Lit Protocol PKP creation
        // For now, return mock data
        return {
            publicKey: `0x${Math.random().toString(16).substr(2, 40)}`,
            tokenId: `pkp_${Date.now()}`,
        };
    }
    async deployLitAction(_code) {
        // This would deploy Lit Action to Lit Protocol
        // For now, return mock ID
        return `lit_action_${Date.now()}`;
    }
    generatePolicyValidationCode(data) {
        return `
      // Lit Action for policy validation
      const validatePolicy = async (intent) => {
        // Check spending limit
        if (intent.amountUSD > ${data.spendingLimitUSD}) {
          return { valid: false, reason: 'Spending limit exceeded' };
        }
        
        // Check allowed pairs
        const allowedPairs = ${JSON.stringify(data.allowedPairs)};
        if (!allowedPairs.includes(intent.pair)) {
          return { valid: false, reason: 'Pair not allowed' };
        }
        
        // Check expiry
        const expiry = ${data.expiryDays ? Date.now() + (data.expiryDays * 24 * 60 * 60 * 1000) : 'null'};
        if (expiry && Date.now() > expiry) {
          return { valid: false, reason: 'Policy expired' };
        }
        
        return { valid: true };
      };
      
      validatePolicy(intent);
    `;
    }
    buildPolicyConditions(data) {
        const conditions = [
            {
                type: 'spending_limit',
                value: data.spendingLimitUSD,
            },
            {
                type: 'allowed_pairs',
                value: data.allowedPairs,
            },
        ];
        if (data.expiryDays) {
            conditions.push({
                type: 'time_limit',
                value: Date.now() + (data.expiryDays * 24 * 60 * 60 * 1000),
            });
        }
        return conditions;
    }
    async storePolicyMetadata(policy) {
        // This would store policy metadata in Lit Protocol or IPFS
        // For now, just log
        console.log('Storing policy metadata:', policy);
    }
    async queryUserPolicies() {
        // This would query Lit Protocol for user's policies
        // For now, return mock data
        return [
            {
                id: 'policy_1',
                name: 'Default Policy',
                description: 'Default spending policy',
                conditions: [
                    { type: 'spending_limit', value: 1000 },
                    { type: 'allowed_pairs', value: ['USDC-DAI', 'USDT-USDC'] },
                ],
                isActive: true,
                createdAt: Date.now() - 86400000,
                updatedAt: Date.now(),
                pkpPublicKey: this.pkpPublicKey,
                pkpTokenId: 'pkp_1',
            },
        ];
    }
    async queryPolicyById(policyId) {
        const policies = await this.queryUserPolicies();
        return policies.find(p => p.id === policyId) || null;
    }
    async updatePolicyStatus(policyId, isActive) {
        const policy = await this.getPolicy(policyId);
        policy.isActive = isActive;
        policy.updatedAt = Date.now();
        // Update in Lit Protocol
        await this.storePolicyMetadata(policy);
        return policy;
    }
    async revokePKPAccess(policyId) {
        // This would revoke PKP access in Lit Protocol
        console.log('Revoking PKP access for policy:', policyId);
    }
    async cleanupLitAction(policyId) {
        // This would clean up Lit Action
        console.log('Cleaning up Lit Action for policy:', policyId);
    }
    // ===== VALIDATION HELPERS =====
    async checkSpendingLimit(policy, intent) {
        const spendingLimitCondition = policy.conditions.find(c => c.type === 'spending_limit');
        if (!spendingLimitCondition) {
            return { isValid: true };
        }
        const limit = Number(spendingLimitCondition.value);
        const amount = parseFloat(intent.amount);
        // This would check against actual spending history
        const spentToday = 0; // Would query from Lit Protocol
        if (spentToday + amount > limit) {
            return {
                isValid: false,
                reason: 'Spending limit exceeded',
                remainingLimit: (limit - spentToday).toString(),
            };
        }
        return { isValid: true };
    }
    checkAllowedPairs(policy, pair) {
        const allowedPairsCondition = policy.conditions.find(c => c.type === 'allowed_pairs');
        if (!allowedPairsCondition) {
            return { isValid: true };
        }
        const allowedPairs = allowedPairsCondition.value;
        if (!allowedPairs.includes(pair)) {
            return {
                isValid: false,
                reason: 'Pair not allowed by policy',
            };
        }
        return { isValid: true };
    }
    checkTimeLimits(policy) {
        const timeLimitCondition = policy.conditions.find(c => c.type === 'time_limit');
        if (!timeLimitCondition) {
            return { isValid: true };
        }
        const expiry = Number(timeLimitCondition.value);
        if (Date.now() > expiry) {
            return {
                isValid: false,
                reason: 'Policy has expired',
            };
        }
        return { isValid: true };
    }
}
//# sourceMappingURL=vincent.js.map