'use client';

import { useState } from 'react';
import { UpdateLocationPayload, LocationResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseUpdateLocationResult {
    updateLocation: (id: string, data: UpdateLocationPayload) => Promise<LocationResponse>;
    isLoading: boolean;
    error: string | null;
}

export function useUpdateLocation(): UseUpdateLocationResult {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateLocation = async (
        id: string,
        data: UpdateLocationPayload
    ): Promise<LocationResponse> => {
        setIsLoading(true);
        try {
            const response = await adminFetch(`/api/admin/locations/${id}`, {
                method: 'PUT',
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

    return { updateLocation, isLoading, error };
}
