'use client';

import { useSignTypedData, useAccount, useChainId } from 'wagmi';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface IntentData {
  pair: string;
  amount: string;
  fromToken: string;
  toToken: string;
  userAddress: string;
  nonce: string;
  deadline: number;
}

interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: `0x${string}`;
}

interface EIP712Types {
  Intent: Array<{
    name: string;
    type: string;
  }>;
}

const domain: EIP712Domain = {
  name: 'USAIN',
  version: '1',
  chainId: 84532, // Base Sepolia
  verifyingContract: '0x0000000000000000000000000000000000000000' as `0x${string}`,
};

const types: EIP712Types = {
  Intent: [
    { name: 'pair', type: 'string' },
    { name: 'amount', type: 'string' },
    { name: 'fromToken', type: 'string' },
    { name: 'toToken', type: 'string' },
    { name: 'userAddress', type: 'address' },
    { name: 'nonce', type: 'string' },
    { name: 'deadline', type: 'uint256' },
  ],
};

export function useEIP712Signer() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync, isPending, error } = useSignTypedData();

  const signIntent = useCallback(async (intentData: IntentData): Promise<string | null> => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return null;
    }

    if (chainId !== 84532 && chainId !== 421614) {
      toast.error('Please switch to Base Sepolia or Arbitrum Sepolia');
      return null;
    }

    try {
      const message = {
        pair: intentData.pair,
        amount: intentData.amount,
        fromToken: intentData.fromToken,
        toToken: intentData.toToken,
        userAddress: address as `0x${string}`,
        nonce: intentData.nonce,
        deadline: BigInt(intentData.deadline),
      };

      const signature = await signTypedDataAsync({
        domain: {
          ...domain,
          chainId,
        },
        types,
        primaryType: 'Intent',
        message,
      });

      console.debug('[EIP712] Signature created:', { signature, message });
      return signature;
    } catch (err) {
      console.debug('[EIP712] Signing failed:', err);
      toast.error('Failed to sign transaction. Please try again.');
      return null;
    }
  }, [isConnected, address, chainId, signTypedDataAsync]);

  return {
    signIntent,
    isSigning: isPending,
    isConnected,
    address,
    chainId,
    error,
  };
}
