'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { sdk } from './api';

interface ReconnectOptions {
  maxReconnectAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

interface ConnectionState {
  isConnected: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastError: Error | null;
}

export function useLiveMetrics(
  onMessage: (data: any) => void,
  options: ReconnectOptions = {}
) {
  const {
    maxReconnectAttempts = 10,
    initialDelay = 200,
    maxDelay = 2000,
    backoffMultiplier = 1.5,
  } = options;

  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isReconnecting: false,
    reconnectAttempts: 0,
    lastError: null,
  });

  const cleanupRef = useRef<(() => void) | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const calculateDelay = useCallback((attempt: number): number => {
    const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
    return Math.min(delay, maxDelay);
  }, [initialDelay, maxDelay, backoffMultiplier]);

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;

    try {
      const cleanup = sdk.api.subscribeLiveMetrics(
        (metrics) => {
          if (!isMountedRef.current) return;
          
          setConnectionState(prev => ({
            ...prev,
            isConnected: true,
            isReconnecting: false,
            reconnectAttempts: 0,
            lastError: null,
          }));
          
          onMessage(metrics);
        },
        (error) => {
          if (!isMountedRef.current) return;
          
          console.debug('[LiveMetrics] Connection error:', error);
          
          setConnectionState(prev => ({
            ...prev,
            isConnected: false,
            lastError: error,
          }));

          // Attempt reconnection
          if (connectionState.reconnectAttempts < maxReconnectAttempts) {
            const delay = calculateDelay(connectionState.reconnectAttempts);
            
            setConnectionState(prev => ({
              ...prev,
              isReconnecting: true,
              reconnectAttempts: prev.reconnectAttempts + 1,
            }));

            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                connect();
              }
            }, delay);
          } else {
            console.debug('[LiveMetrics] Max reconnection attempts reached');
            setConnectionState(prev => ({
              ...prev,
              isReconnecting: false,
            }));
          }
        }
      );

      cleanupRef.current = cleanup;
    } catch (error) {
      console.debug('[LiveMetrics] Failed to establish connection:', error);
      setConnectionState(prev => ({
        ...prev,
        lastError: error as Error,
        isConnected: false,
      }));
    }
  }, [onMessage, maxReconnectAttempts, calculateDelay, connectionState.reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnectionState({
      isConnected: false,
      isReconnecting: false,
      reconnectAttempts: 0,
      lastError: null,
    });
  }, []);

  const manualReconnect = useCallback(() => {
    disconnect();
    setConnectionState(prev => ({
      ...prev,
      reconnectAttempts: 0,
    }));
    connect();
  }, [disconnect, connect]);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...connectionState,
    reconnect: manualReconnect,
  };
}
