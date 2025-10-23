'use client';

import { Shield, ShieldCheck, ShieldX, Plus } from 'lucide-react';
import { usePolicies } from '@/lib/use-policies';
import { useState } from 'react';

interface PolicyStatusProps {
  onPolicyAction?: () => void;
}

export function PolicyStatus({ onPolicyAction }: PolicyStatusProps) {
  const { activePolicy, isLoading } = usePolicies();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-text">
        <Shield className="h-3 w-3 animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  if (activePolicy) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-400">
        <ShieldCheck className="h-3 w-3" />
        <span>{activePolicy.name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-red-400">
      <ShieldX className="h-3 w-3" />
      <span>No Active Policy</span>
      <button
        onClick={() => {
          setShowCreateForm(true);
          onPolicyAction?.();
        }}
        className="ml-2 px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-1"
        aria-label="Create new policy"
      >
        <Plus className="h-3 w-3" />
        Create
      </button>
    </div>
  );
}


