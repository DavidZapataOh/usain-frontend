'use client';

import { Wifi, WifiOff, RotateCcw } from 'lucide-react';

interface ReconnectBadgeProps {
  isConnected: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  onManualReconnect?: () => void;
}

export function ReconnectBadge({ 
  isConnected, 
  isReconnecting, 
  reconnectAttempts,
  onManualReconnect 
}: ReconnectBadgeProps) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-400">
        <Wifi className="h-3 w-3" />
        <span>Connected</span>
      </div>
    );
  }

  if (isReconnecting) {
    return (
      <div className="flex items-center gap-2 text-xs text-yellow-400 animate-pulse">
        <RotateCcw className="h-3 w-3 animate-spin" />
        <span>Reconnecting... ({reconnectAttempts})</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-red-400">
      <WifiOff className="h-3 w-3" />
      <span>Disconnected</span>
      {onManualReconnect && (
        <button
          onClick={onManualReconnect}
          className="ml-2 px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
          aria-label="Reconnect to live metrics"
        >
          Retry
        </button>
      )}
    </div>
  );
}


