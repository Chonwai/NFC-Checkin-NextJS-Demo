'use client';

import { useState } from 'react';
import { adminFetch } from '@/utils/adminFetch';
import { AdminActivity } from '@/types/admin';

interface UpdateActivityPayload {
    activity: Partial<AdminActivity>;
}

interface UseUpdateActivityResult {
    updateActivity: (activityId: string, data: UpdateActivityPayload) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}

export function useUpdateActivity(): UseUpdateActivityResult {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateActivity = async (activityId: string, data: UpdateActivityPayload) => {
        setIsLoading(true);
        try {
            const response = await adminFetch(`/api/admin/activities/${activityId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });

            if (!response.success) {
                throw new Error(response.error?.message || '無法更新活動');
            }

            return response;
        } catch (err: any) {
            setError(err.message || '未知錯誤');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateActivity, isLoading, error };
}
