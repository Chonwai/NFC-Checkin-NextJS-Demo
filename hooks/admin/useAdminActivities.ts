'use client';

import { useState, useEffect } from 'react';
import { AdminActivity, AdminActivitiesResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseAdminActivitiesResult {
    activities: AdminActivity[];
    isLoading: boolean;
    error: string | null;
}

export function useAdminActivities(): UseAdminActivitiesResult {
    const [activities, setActivities] = useState<AdminActivity[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data: AdminActivitiesResponse = await adminFetch('/api/admin/activities');
                if (data.success && data.data) {
                    setActivities(data.data.activities);
                } else {
                    throw new Error(data.error?.message || '無法獲取活動列表');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    return { activities, isLoading, error };
}
