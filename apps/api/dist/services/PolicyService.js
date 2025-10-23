import { VincentClient } from '@usain/sdk';
import { SDKError } from '@usain/sdk';
export class PolicyService {
    vincentClient;
    constructor() {
        const config = {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
            wsUrl: process.env.WS_URL || 'ws://localhost:4000',
            envioHyperSyncUrl: process.env.ENVIO_HYPERSYNC_URL || 'https://base-sepolia.hypersync.xyz',
            envioGqlUri: process.env.ENVIO_GQL_URI || 'https://indexer.bigdevenergy.link/xxxxx/v1/graphql',
            litNetwork: process.env.LIT_NETWORK || 'datil-test',
            vincentPkpPublicKey: process.env.VINCENT_PKP_PUBLIC_KEY || '0x...',
            yellowRpcUrl: process.env.YELLOW_RPC_URL || 'https://sepolia.base.org',
            yellowNetwork: process.env.YELLOW_NETWORK || 'nitrolite',
            networks: [
                {
                    chainId: 84532,
                    name: 'base-sepolia',
                    rpcUrl: 'https://sepolia.base.org',
                    blockExplorer: 'https://sepolia.basescan.org',
                    settlementHubAddress: process.env.SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
                },
                {
                    chainId: 421614,
                    name: 'arbitrum-sepolia',
                    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
                    blockExplorer: 'https://sepolia.arbiscan.io',
                    settlementHubAddress: process.env.SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
                },
            ],
        };
        this.vincentClient = new VincentClient(config);
    }
    async getPolicies(params) {
        try {
            const policies = await this.vincentClient.listPolicies();
            // Apply pagination
            const page = params?.page || 1;
            const limit = params?.limit || 10;
            const offset = (page - 1) * limit;
            const paginatedPolicies = policies.slice(offset, offset + limit);
            return {
                data: paginatedPolicies,
                pagination: {
                    page,
                    limit,
                    total: policies.length,
                    hasMore: offset + limit < policies.length,
                },
            };
        }
        catch (error) {
            throw new SDKError(`Failed to get policies: ${error.message}`, 'POLICIES_LIST_ERROR', 500, { params, error: error.message });
        }
    }
    async getPolicy(policyId) {
        try {
            return await this.vincentClient.getPolicy(policyId);
        }
        catch (error) {
            throw new SDKError(`Failed to get policy: ${error.message}`, 'POLICY_GET_ERROR', 500, { policyId, error: error.message });
        }
    }
    async createPolicy(data) {
        try {
            // Validate policy data
            this.validatePolicyData(data);
            return await this.vincentClient.createPolicy(data);
        }
        catch (error) {
            throw new SDKError(`Failed to create policy: ${error.message}`, 'POLICY_CREATE_ERROR', 500, { data, error: error.message });
        }
    }
    async pausePolicy(policyId) {
        try {
            return await this.vincentClient.pausePolicy(policyId);
        }
        catch (error) {
            throw new SDKError(`Failed to pause policy: ${error.message}`, 'POLICY_PAUSE_ERROR', 500, { policyId, error: error.message });
        }
    }
    async resumePolicy(policyId) {
        try {
            return await this.vincentClient.resumePolicy(policyId);
        }
        catch (error) {
            throw new SDKError(`Failed to resume policy: ${error.message}`, 'POLICY_RESUME_ERROR', 500, { policyId, error: error.message });
        }
    }
    async revokePolicy(policyId) {
        try {
            await this.vincentClient.revokePolicy(policyId);
        }
        catch (error) {
            throw new SDKError(`Failed to revoke policy: ${error.message}`, 'POLICY_REVOKE_ERROR', 500, { policyId, error: error.message });
        }
    }
    async validatePolicy(policyId, intent) {
        try {
            return await this.vincentClient.validatePolicy(policyId, intent);
        }
        catch (error) {
            throw new SDKError(`Failed to validate policy: ${error.message}`, 'POLICY_VALIDATION_ERROR', 500, { policyId, intent, error: error.message });
        }
    }
    validatePolicyData(data) {
        if (!data.name || data.name.trim().length === 0) {
            throw new SDKError('Policy name is required', 'VALIDATION_ERROR', 400);
        }
        if (data.spendingLimitUSD <= 0) {
            throw new SDKError('Spending limit must be greater than 0', 'VALIDATION_ERROR', 400);
        }
        if (!data.allowedPairs || data.allowedPairs.length === 0) {
            throw new SDKError('At least one allowed pair is required', 'VALIDATION_ERROR', 400);
        }
        if (data.expiryDays && data.expiryDays <= 0) {
            throw new SDKError('Expiry days must be greater than 0', 'VALIDATION_ERROR', 400);
        }
        // Validate pair format
        for (const pair of data.allowedPairs) {
            if (!pair.includes('-') || pair.split('-').length !== 2) {
                throw new SDKError(`Invalid pair format: ${pair}`, 'VALIDATION_ERROR', 400);
            }
        }
    }
    async getActivePolicy() {
        try {
            const policies = await this.vincentClient.listPolicies();
            return policies.find(policy => policy.isActive) || null;
        }
        catch (error) {
            throw new SDKError(`Failed to get active policy: ${error.message}`, 'ACTIVE_POLICY_ERROR', 500, { error: error.message });
        }
    }
    async getPolicyStats(policyId) {
        try {
            // This would query transaction history for the policy
            // For now, return mock data
            return {
                totalTransactions: 42,
                totalVolumeUSD: 12500.50,
                averageLatencyMs: 180,
                successRate: 98.5,
                lastUsed: Date.now() - 3600000, // 1 hour ago
            };
        }
        catch (error) {
            throw new SDKError(`Failed to get policy stats: ${error.message}`, 'POLICY_STATS_ERROR', 500, { policyId, error: error.message });
        }
    }
}
//# sourceMappingURL=PolicyService.js.map