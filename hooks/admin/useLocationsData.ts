'use client';

import { useState, useEffect } from 'react';
import { LocationData, LocationsDataResponse } from '@/types/admin';
import { adminFetch } from '@/utils/adminFetch';

interface UseLocationsDataResult {
    locationsData: LocationData[];
    isLoading: boolean;
    error: string | null;
}

export function useLocationsData(): UseLocationsDataResult {
    const [locationsData, setLocationsData] = useState<LocationData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocationsData = async () => {
            try {
                const data: LocationsDataResponse = await adminFetch(
                    '/api/admin/dashboard/location_distribution'
                );
                if (data.success && data.data) {
                    setLocationsData(data.data.locations_data);
                } else {
                    throw new Error(data.error?.message || '無法獲取地點數據');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocationsData();
    }, []);

    return { locationsData, isLoading, error };
}
