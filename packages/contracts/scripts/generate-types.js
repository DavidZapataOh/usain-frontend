const fs = require('fs');
const path = require('path');

// Read the compiled contract ABI
const abiPath = path.join(__dirname, '../out/USAINSettlementHub.sol/USAINSettlementHub.json');
const contractData = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const abi = contractData.abi;

// Create TypeScript types
const typeDefinitions = `
// Auto-generated from USAINSettlementHub.sol
export const USAINSettlementHubABI = ${JSON.stringify(abi, null, 2)} as const;

export type USAINSettlementHub = typeof USAINSettlementHubABI;

// Event types
export type BatchSettledEvent = {
  channelId: string;
  tokens: string[];
  from: string[];
  to: string[];
  amounts: bigint[];
  timestamp: bigint;
};

export type ChannelOpenedEvent = {
  channelId: string;
  participant: string;
};

export type ChannelClosedEvent = {
  channelId: string;
};

// Function parameter types
export type SettleBatchParams = {
  channelId: string;
  tokens: string[];
  from: string[];
  to: string[];
  amounts: bigint[];
};

export type OpenChannelParams = {
  channelId: string;
  participants: string[];
};

// Contract address (will be updated after deployment)
export const SETTLEMENT_HUB_ADDRESS = "0x0000000000000000000000000000000000000000";
`;

// Write to SDK package
const sdkAbiPath = path.join(__dirname, '../../sdk/src/abis/USAINSettlementHub.ts');
fs.writeFileSync(sdkAbiPath, typeDefinitions);

console.log('✅ Generated TypeScript types for USAINSettlementHub');
console.log('📁 Output:', sdkAbiPath);

