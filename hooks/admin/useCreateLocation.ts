'use client';

import { useState } from 'react';
import { CreateLocationPayload, CreateLocationResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseCreateLocationResult {
    createLocation: (data: CreateLocationPayload) => Promise<CreateLocationResponse>;
    isLoading: boolean;
    error: string | null;
}

export function useCreateLocation(): UseCreateLocationResult {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createLocation = async (data: CreateLocationPayload): Promise<CreateLocationResponse> => {
        setIsLoading(true);
        try {
            const response = await adminFetch('/api/admin/locations', {
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

    return { createLocation, isLoading, error };
}
