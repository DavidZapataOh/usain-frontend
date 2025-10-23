import { SubmitIntentRequest, SubmitIntentResponse } from '@usain/sdk';
export declare class IntentService {
    private vincentClient;
    private yellowClient;
    constructor();
    submitIntent(request: SubmitIntentRequest): Promise<SubmitIntentResponse>;
    private verifySignature;
    private updateChannelState;
    private storeFillMetrics;
    getIntentStatus(fillId: string): Promise<{
        fillId: string;
        status: string;
        latencyMs: number;
        timestamp: number;
    }>;
}
//# sourceMappingURL=IntentService.d.ts.map