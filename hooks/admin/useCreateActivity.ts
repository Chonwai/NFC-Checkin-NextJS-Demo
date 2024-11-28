'use client';

import { useState } from 'react';
import { CreateActivityPayload, CreateActivityResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseCreateActivityResult {
    createActivity: (data: CreateActivityPayload) => Promise<CreateActivityResponse>;
    isLoading: boolean;
    error: string | null;
}

export function useCreateActivity(): UseCreateActivityResult {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createActivity = async (data: CreateActivityPayload): Promise<CreateActivityResponse> => {
        setIsLoading(true);
        try {
            const response = await adminFetch('/api/admin/activities', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            return response;
        } catch (err: any) {
            setError(err.message || '未知錯誤');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createActivity, isLoading, error };
}
