'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/utils/adminFetch';

interface ActivityStats {
    check_in_stats: {
        total_check_ins: number;
        unique_users: number;
        completion_rate: number;
        average_check_ins_per_user: number;
    };
    location_stats: {
        most_popular_location: {
            id: string;
            name: string;
            check_in_count: number;
        };
        location_distribution: {
            location_id: string;
            name: string;
            check_in_count: number;
            unique_users: number;
        }[];
    };
    time_stats: {
        peak_hours: {
            hour: number;
            count: number;
        }[];
        daily_trend: {
            date: string;
            check_in_count: number;
            unique_users: number;
        }[];
    };
}

interface UseActivityStatsResult {
    stats: ActivityStats | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useActivityStats(activityId: string): UseActivityStatsResult {
    const [stats, setStats] = useState<ActivityStats | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await adminFetch(`/api/admin/activities/${activityId}/stats`);
            if (response.success && response.data) {
                setStats(response.data);
                setError(null);
            } else {
                throw new Error(response.error?.message || '無法獲取活動統計數據');
            }
        } catch (err: any) {
            setError(err.message || '未知錯誤');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [activityId]);

    return { stats, isLoading, error, refetch: fetchStats };
}
