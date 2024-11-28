'use client';

import { useState, useEffect } from 'react';
import { AdminLocation, AdminLocationsResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseAdminLocationsResult {
    locations: AdminLocation[];
    isLoading: boolean;
    error: string | null;
}

export function useAdminLocations(): UseAdminLocationsResult {
    const [locations, setLocations] = useState<AdminLocation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data: AdminLocationsResponse = await adminFetch('/api/admin/locations');
                if (data.success && data.data) {
                    setLocations(data.data.locations);
                } else {
                    throw new Error(data.error?.message || '無法獲取地點列表');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    return { locations, isLoading, error };
}
