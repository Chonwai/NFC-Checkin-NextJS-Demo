'use client';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/api';

interface ActivitiesResponse
    extends ApiResponse<{
        activities: Activity[];
    }> {}

interface Activity {
    id: string;
    name: string;
    description: string;
}

interface UseActivitiesResult {
    activities: Activity[];
    isLoading: boolean;
    error: string | null;
}

export function useActivities(): UseActivitiesResult {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data: ActivitiesResponse = await response.json();
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
