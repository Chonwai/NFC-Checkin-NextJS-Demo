'use client';

import { useState, useEffect } from 'react';
import { TrendData, TrendDataResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseUserActivityTrendResult {
    trendData: TrendData[];
    isLoading: boolean;
    error: string | null;
}

export function useUserActivityTrend(): UseUserActivityTrendResult {
    const [trendData, setTrendData] = useState<TrendData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrendData = async () => {
            try {
                const data: TrendDataResponse = await adminFetch(
                    '/api/admin/dashboard/user_activity_trend'
                );
                if (data.success && data.data) {
                    setTrendData(data.data.trend_data);
                } else {
                    throw new Error(data.error?.message || '無法獲取用戶活動趨勢數據');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrendData();
    }, []);

    return { trendData, isLoading, error };
}
