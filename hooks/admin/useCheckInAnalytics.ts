'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/utils/adminFetch';
import {
    TimeDistributionResponse,
    UserBehaviorResponse,
    LocationHeatMapResponse,
    CompletionTrendResponse
} from '@/types/admin';

export function useCheckInAnalytics() {
    const [timeDistribution, setTimeDistribution] = useState<TimeDistributionResponse['data']>();
    const [userBehavior, setUserBehavior] = useState<UserBehaviorResponse['data']>();
    const [locationHeatMap, setLocationHeatMap] = useState<LocationHeatMapResponse['data']>();
    const [completionTrend, setCompletionTrend] = useState<CompletionTrendResponse['data']>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [timeRes, behaviorRes, heatMapRes, trendRes] = await Promise.all([
                    adminFetch('/api/admin/check_ins/time_distribution'),
                    adminFetch('/api/admin/check_ins/user_behavior'),
                    adminFetch('/api/admin/check_ins/location_heat_map'),
                    adminFetch('/api/admin/check_ins/completion_trend')
                ]);

                if (timeRes.success) setTimeDistribution(timeRes.data);
                if (behaviorRes.success) setUserBehavior(behaviorRes.data);
                if (heatMapRes.success) setLocationHeatMap(heatMapRes.data);
                if (trendRes.success) setCompletionTrend(trendRes.data);
            } catch (err: any) {
                setError(err.message || '獲取數據失敗');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        timeDistribution,
        userBehavior,
        locationHeatMap,
        completionTrend,
        isLoading,
        error
    };
}
