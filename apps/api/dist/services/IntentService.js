import { VincentClient, YellowClient } from '@usain/sdk';
import { SDKError, SignatureError, ValidationError } from '@usain/sdk';
import { verifyTypedData } from 'viem';
export class IntentService {
    vincentClient;
    yellowClient;
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
        this.yellowClient = new YellowClient(config);
    }
    async submitIntent(request) {
        const startTime = Date.now();
        try {
            // 1. Verify EIP-712 signature
            const isValidSignature = await this.verifySignature(request.intent, request.signature);
            if (!isValidSignature) {
                throw new SignatureError('Invalid EIP-712 signature');
            }
            // 2. Validate policy
            const policyValidation = await this.vincentClient.validatePolicy(request.policyId, {
                pair: request.intent.pair,
                amount: request.intent.amount,
                userAddress: request.intent.userAddress,
            });
            if (!policyValidation.isValid) {
                throw new ValidationError(`Policy validation failed: ${policyValidation.reason}`, { policyId: request.policyId, reason: policyValidation.reason });
            }
            // 3. Update state channel
            const channelUpdate = await this.updateChannelState(request.intent);
            // 4. Generate fill response
            const latencyMs = Date.now() - startTime;
            const fillId = `fill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const response = {
                status: 'filled',
                fillId,
                channelId: channelUpdate.channelId,
                latencyMs,
                ts: Date.now(),
                txHash: channelUpdate.txHash,
            };
            // 5. Store fill in metrics (for live updates)
            await this.storeFillMetrics(response, request.intent);
            return response;
        }
        catch (error) {
            throw new SDKError(`Failed to submit intent: ${error.message}`, 'INTENT_SUBMIT_ERROR', 500, { request, error: error.message });
        }
    }
    async verifySignature(intent, signature) {
        try {
            // Build EIP-712 typed data
            const domain = {
                name: 'USAIN',
                version: '1',
                chainId: 84532, // Base Sepolia
                verifyingContract: process.env.SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
            };
            const types = {
                Intent: [
                    { name: 'pair', type: 'string' },
                    { name: 'amount', type: 'string' },
                    { name: 'userAddress', type: 'address' },
                    { name: 'nonce', type: 'string' },
                    { name: 'deadline', type: 'uint256' },
                ],
            };
            const message = {
                pair: intent.pair,
                amount: intent.amount,
                userAddress: intent.userAddress,
                nonce: intent.nonce,
                deadline: intent.deadline,
            };
            // Verify signature
            const isValid = await verifyTypedData({
                address: intent.userAddress,
                domain: {
                    name: 'USAIN',
                    version: '1',
                    chainId: 84532, // Base Sepolia
                    verifyingContract: '0x0000000000000000000000000000000000000000',
                },
                types,
                primaryType: 'Intent',
                message,
                signature: signature,
            });
            return isValid;
        }
        catch (error) {
            console.error('Signature verification error:', error);
            return false;
        }
    }
    async updateChannelState(intent) {
        try {
            // Get current channel status
            const channelStatus = await this.yellowClient.getChannelStatus();
            if (channelStatus.status !== 'OPEN') {
                throw new SDKError('Channel is not open', 'CHANNEL_NOT_OPEN');
            }
            // Create channel update
            const update = {
                channelId: channelStatus.channelId,
                from: intent.userAddress,
                to: intent.userAddress, // Simplified for now
                token: intent.pair.split('-')[0], // Extract from token
                amount: intent.amount,
                nonce: parseInt(intent.nonce),
                signature: '', // Will be filled by Yellow client
            };
            // Apply state update
            const result = await this.yellowClient.updateChannelState(update);
            return {
                channelId: channelStatus.channelId,
                txHash: result.signature, // Using signature as txHash for now
            };
        }
        catch (error) {
            throw new SDKError(`Failed to update channel state: ${error.message}`, 'CHANNEL_UPDATE_ERROR', 500, { intent, error: error.message });
        }
    }
    async storeFillMetrics(response, intent) {
        try {
            // Store fill metrics for live updates
            // This would typically store in a database or cache
            const fillData = {
                fillId: response.fillId,
                pair: intent.pair,
                amount: intent.amount,
                latencyMs: response.latencyMs,
                timestamp: response.ts,
                channelId: response.channelId,
            };
            // For now, just log
            console.log('Fill metrics stored:', fillData);
        }
        catch (error) {
            console.error('Failed to store fill metrics:', error);
            // Don't throw here as it's not critical
        }
    }
    async getIntentStatus(fillId) {
        try {
            // This would query the database for fill status
            // For now, return mock data
            return {
                fillId,
                status: 'filled',
                latencyMs: 150,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            throw new SDKError(`Failed to get intent status: ${error.message}`, 'INTENT_STATUS_ERROR', 500, { fillId, error: error.message });
        }
    }
}
//# sourceMappingURL=IntentService.js.map