import { NetworkError } from '../types.js';
export class APIClient {
    baseUrl;
    constructor(config) {
        this.baseUrl = config.apiBaseUrl;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new NetworkError(errorData?.message || `HTTP ${response.status}`, response.status, errorData);
        }
        return response.json();
    }
    // ===== QUOTE ENDPOINTS =====
    async quote(params) {
        return this.request('/intents/quote', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    async submitIntent(params) {
        return this.request('/intents/submit', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    // ===== CHANNEL ENDPOINTS =====
    async getChannelStatus() {
        return this.request('/channel/status');
    }
    async openChannel() {
        return this.request('/channel/open', {
            method: 'POST',
        });
    }
    async closeChannel() {
        return this.request('/channel/close', {
            method: 'POST',
        });
    }
    async requestSettlement() {
        return this.request('/channel/settle', {
            method: 'POST',
        });
    }
    // ===== POLICY ENDPOINTS =====
    async getPolicies(params) {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set('page', params.page.toString());
        if (params?.limit)
            searchParams.set('limit', params.limit.toString());
        const query = searchParams.toString();
        return this.request(`/policies${query ? `?${query}` : ''}`);
    }
    async createPolicy(data) {
        return this.request('/policies/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async updatePolicyStatus(policyId, action) {
        return this.request(`/policies/${policyId}/${action}`, {
            method: 'POST',
        });
    }
    // ===== METRICS ENDPOINTS =====
    async getKPIs() {
        return this.request('/metrics/kpis');
    }
    async getRecentFills(limit = 10) {
        return this.request(`/metrics/fills?limit=${limit}`);
    }
    // ===== LIVE METRICS (SSE) =====
    subscribeLiveMetrics(onMessage, onError) {
        // Check if EventSource is available (browser environment)
        try {
            const eventSource = new globalThis.EventSource(`${this.baseUrl}/metrics/live`);
            eventSource.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessage(data);
                }
                catch (error) {
                    console.error('[SDK] Failed to parse SSE message:', error);
                    onError?.(error);
                }
            });
            eventSource.addEventListener('error', (event) => {
                console.error('[SDK] SSE connection error:', event);
                onError?.(new Error('SSE connection failed'));
            });
            // Return cleanup function
            return () => {
                eventSource.close();
            };
        }
        catch (error) {
            console.warn('[SDK] EventSource not available, falling back to polling');
            const interval = setInterval(async () => {
                try {
                    const metrics = await this.getKPIs();
                    onMessage({ kpis: metrics });
                }
                catch (error) {
                    onError?.(error);
                }
            }, 2000);
            return () => clearInterval(interval);
        }
    }
    // ===== HEALTH CHECK =====
    async healthCheck() {
        return this.request('/healthz');
    }
    // ===== UTILITY METHODS =====
    async getSupportedTokens() {
        return this.request('/tokens/supported');
    }
    async getNetworkStatus() {
        return this.request('/network/status');
    }
}
//# sourceMappingURL=api.js.map