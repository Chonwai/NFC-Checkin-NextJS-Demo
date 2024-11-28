'use client';

import { useState, useEffect } from 'react';
import { AdminActivity } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseActivityResult {
    activity: AdminActivity | null;
    isLoading: boolean;
    error: string | null;
}

export function useActivity(id: string | null): UseActivityResult {
    const [activity, setActivity] = useState<AdminActivity | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        const fetchActivity = async () => {
            try {
                const response = await adminFetch(`/api/admin/activities/${id}`);
                if (response.success && response.data) {
                    setActivity(response.data.activity);
                } else {
                    throw new Error(response.error?.message || '無法獲取活動資訊');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

    return { activity, isLoading, error };
}
