'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchPolicies, createPolicy, updatePolicyStatus } from '@/lib/api';
import { useToast } from '@/lib/use-toast';

interface Policy {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'revoked';
  rules: string[];
  createdAt: number;
}

interface UsePoliciesReturn {
  policies: Policy[];
  activePolicy: Policy | null;
  isLoading: boolean;
  error: Error | null;
  createNewPolicy: (data: { name: string; rules: string[] }) => Promise<void>;
  pausePolicy: (id: string) => Promise<void>;
  resumePolicy: (id: string) => Promise<void>;
  revokePolicy: (id: string) => Promise<void>;
  refreshPolicies: () => Promise<void>;
}

export function usePolicies(): UsePoliciesReturn {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useToast();

  const activePolicy = policies.find(p => p.status === 'active') || null;

  const refreshPolicies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPolicies = await fetchPolicies();
      setPolicies(fetchedPolicies);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.debug('[Policies] Failed to fetch policies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewPolicy = useCallback(async (data: { name: string; rules: string[] }) => {
    try {
      const newPolicy = await createPolicy(data);
      setPolicies(prev => [...prev, newPolicy]);
      showSuccess('Policy created successfully!');
    } catch (err) {
      const error = err as Error;
      showError('Failed to create policy', error);
      throw error;
    }
  }, [showSuccess, showError]);

  const pausePolicy = useCallback(async (id: string) => {
    try {
      const updatedPolicy = await updatePolicyStatus(id, 'pause');
      setPolicies(prev => prev.map(p => p.id === id ? updatedPolicy : p));
      showSuccess('Policy paused');
    } catch (err) {
      const error = err as Error;
      showError('Failed to pause policy', error);
      throw error;
    }
  }, [showSuccess, showError]);

  const resumePolicy = useCallback(async (id: string) => {
    try {
      const updatedPolicy = await updatePolicyStatus(id, 'resume');
      setPolicies(prev => prev.map(p => p.id === id ? updatedPolicy : p));
      showSuccess('Policy resumed');
    } catch (err) {
      const error = err as Error;
      showError('Failed to resume policy', error);
      throw error;
    }
  }, [showSuccess, showError]);

  const revokePolicy = useCallback(async (id: string) => {
    try {
      const updatedPolicy = await updatePolicyStatus(id, 'revoke');
      setPolicies(prev => prev.map(p => p.id === id ? updatedPolicy : p));
      showSuccess('Policy revoked');
    } catch (err) {
      const error = err as Error;
      showError('Failed to revoke policy', error);
      throw error;
    }
  }, [showSuccess, showError]);

  useEffect(() => {
    refreshPolicies();
  }, [refreshPolicies]);

  return {
    policies,
    activePolicy,
    isLoading,
    error,
    createNewPolicy,
    pausePolicy,
    resumePolicy,
    revokePolicy,
    refreshPolicies,
  };
}
