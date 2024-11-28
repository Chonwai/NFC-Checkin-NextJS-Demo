'use client';

import { useState, useEffect } from 'react';
import { DashboardStats, DashboardResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseDashboardStatsResult {
    stats: DashboardStats | null;
    isLoading: boolean;
    error: string | null;
}

export function useDashboardStats(): UseDashboardStatsResult {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const data: DashboardResponse = await adminFetch('/api/admin/dashboard/stats');
                if (data.success && data.data) {
                    setStats(data.data.dashboard);
                } else {
                    throw new Error(data.error?.message || '無法獲取儀表板數據');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    return { stats, isLoading, error };
}
