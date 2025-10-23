// Main SDK exports
export * from './types.js';

// Client exports
export { APIClient } from './clients/api.js';
export { EnvioClient } from './clients/envio.js';
export { VincentClient } from './clients/vincent.js';
export { YellowClient } from './clients/yellow.js';
export { SettlementHubClient } from './clients/settlement-hub.js';

// Contract exports
export * from './abis/USAINSettlementHub.js';

// Main SDK class
import { APIClient } from './clients/api.js';
import { EnvioClient } from './clients/envio.js';
import { VincentClient } from './clients/vincent.js';
import { YellowClient } from './clients/yellow.js';
import { SettlementHubClient } from './clients/settlement-hub.js';
import { ClientConfig } from './types.js';

export class USAINSDK {
  public api: APIClient;
  public envio: EnvioClient;
  public vincent: VincentClient;
  public yellow: YellowClient;
  public settlementHub: SettlementHubClient;

  constructor(config: ClientConfig) {
    this.api = new APIClient(config);
    this.envio = new EnvioClient(config);
    this.vincent = new VincentClient(config);
    this.yellow = new YellowClient(config);
    
    // Initialize settlement hub client with contract address
    const settlementHubConfig = {
      rpcUrl: config.networks.find(n => n.chainId === 11155111)?.rpcUrl || 'https://sepolia.infura.io/v3/your-key',
      chainId: 11155111, // Ethereum Sepolia
      contractAddress: config.networks.find(n => n.chainId === 11155111)?.settlementHubAddress || '0x0000000000000000000000000000000000000000',
    };
    
    this.settlementHub = new SettlementHubClient(settlementHubConfig);
  }

  // Convenience methods
  async healthCheck() {
    return this.api.healthCheck();
  }

  async getNetworkStatus() {
    return this.api.getNetworkStatus();
  }
}

// Default export
export default USAINSDK;
