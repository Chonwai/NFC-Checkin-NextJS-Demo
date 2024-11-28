'use client';

import { useState, useEffect } from 'react';
import { ActivityData, ActivitiesDataResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseActivitiesDataResult {
    activitiesData: ActivityData[];
    isLoading: boolean;
    error: string | null;
}

export function useActivitiesData(): UseActivitiesDataResult {
    const [activitiesData, setActivitiesData] = useState<ActivityData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivitiesData = async () => {
            try {
                const data: ActivitiesDataResponse = await adminFetch(
                    '/api/admin/dashboard/activity_engagement'
                );
                if (data.success && data.data) {
                    setActivitiesData(data.data.activities_data);
                } else {
                    throw new Error(data.error?.message || '無法獲取活動數據');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivitiesData();
    }, []);

    return { activitiesData, isLoading, error };
}
