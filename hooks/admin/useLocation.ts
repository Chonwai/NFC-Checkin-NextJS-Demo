'use client';

import { useState, useEffect } from 'react';
import { AdminLocation } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseLocationResult {
    location: AdminLocation | null;
    isLoading: boolean;
    error: string | null;
}

export function useLocation(id: string | null): UseLocationResult {
    const [location, setLocation] = useState<AdminLocation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        const fetchLocation = async () => {
            try {
                const response = await adminFetch(`/api/admin/locations/${id}`);
                if (response.success && response.data) {
                    setLocation(response.data.location);
                } else {
                    throw new Error(response.error?.message || '無法獲取地點資訊');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, [id]);

    return { location, isLoading, error };
}
