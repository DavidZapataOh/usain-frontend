import { 
  QuoteRequest, 
  Quote, 
  SubmitIntentRequest, 
  SubmitIntentResponse,
  ChannelStatus,
  Policy,
  CreatePolicyRequest,
  LiveMetrics,
  KPIs,
  NetworkError,
  ClientConfig,
  PaginationParams,
  PaginatedResponse
} from '../types.js';

export class APIClient {
  private baseUrl: string;

  constructor(config: ClientConfig) {
    this.baseUrl = config.apiBaseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new NetworkError(
        errorData?.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json() as Promise<T>;
  }

  // ===== QUOTE ENDPOINTS =====

  async quote(params: QuoteRequest): Promise<Quote> {
    return this.request<Quote>('/intents/quote', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async submitIntent(params: SubmitIntentRequest): Promise<SubmitIntentResponse> {
    return this.request<SubmitIntentResponse>('/intents/submit', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ===== CHANNEL ENDPOINTS =====

  async getChannelStatus(): Promise<ChannelStatus> {
    return this.request<ChannelStatus>('/channel/status');
  }

  async openChannel(): Promise<{ channelId: string; status: string }> {
    return this.request<{ channelId: string; status: string }>('/channel/open', {
      method: 'POST',
    });
  }

  async closeChannel(): Promise<{ channelId: string; status: string }> {
    return this.request<{ channelId: string; status: string }>('/channel/close', {
      method: 'POST',
    });
  }

  async requestSettlement(): Promise<{ txHash: string; status: string }> {
    return this.request<{ txHash: string; status: string }>('/channel/settle', {
      method: 'POST',
    });
  }

  // ===== POLICY ENDPOINTS =====

  async getPolicies(params?: PaginationParams): Promise<PaginatedResponse<Policy>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Policy>>(`/policies${query ? `?${query}` : ''}`);
  }

  async createPolicy(data: CreatePolicyRequest): Promise<Policy> {
    return this.request<Policy>('/policies/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePolicyStatus(
    policyId: string, 
    action: 'pause' | 'resume' | 'revoke'
  ): Promise<Policy> {
    return this.request<Policy>(`/policies/${policyId}/${action}`, {
      method: 'POST',
    });
  }

  // ===== METRICS ENDPOINTS =====

  async getKPIs(): Promise<KPIs> {
    return this.request<KPIs>('/metrics/kpis');
  }

  async getRecentFills(limit = 10): Promise<any[]> {
    return this.request<any[]>(`/metrics/fills?limit=${limit}`);
  }

  // ===== LIVE METRICS (SSE) =====

  subscribeLiveMetrics(
    onMessage: (metrics: LiveMetrics) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Check if EventSource is available (browser environment)
    try {
      const eventSource = new (globalThis as any).EventSource(`${this.baseUrl}/metrics/live`);

      eventSource.addEventListener('message', (event: any) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('[SDK] Failed to parse SSE message:', error);
          onError?.(error as Error);
        }
      });

      eventSource.addEventListener('error', (event: any) => {
        console.error('[SDK] SSE connection error:', event);
        onError?.(new Error('SSE connection failed'));
      });

      // Return cleanup function
      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.warn('[SDK] EventSource not available, falling back to polling');
      const interval = setInterval(async () => {
        try {
          const metrics = await this.getKPIs();
          onMessage({ kpis: metrics });
        } catch (error) {
          onError?.(error as Error);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }

  // ===== HEALTH CHECK =====

  async healthCheck(): Promise<{ status: string; timestamp: number; dependencies: any }> {
    return this.request<{ status: string; timestamp: number; dependencies: any }>('/healthz');
  }

  // ===== UTILITY METHODS =====

  async getSupportedTokens(): Promise<any[]> {
    return this.request<any[]>('/tokens/supported');
  }

  async getNetworkStatus(): Promise<{ network: string; blockNumber: number; gasPrice: string }> {
    return this.request<{ network: string; blockNumber: number; gasPrice: string }>('/network/status');
  }
}
