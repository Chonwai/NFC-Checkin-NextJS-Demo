'use client';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/api';

interface CheckinResponse
    extends ApiResponse<{
        check_ins: Checkin[];
    }> {}

interface Checkin {
    id: string;
    check_in: {
        id: string;
        temp_user_id: string;
        location_id: string;
        checkin_time: string;
        meta: Record<string, any>;
        created_at: string;
        updated_at: string;
    };
    location: {
        id: string;
        name: string;
        description: string;
        activity_id: string;
        address: string;
        meta: Record<string, any>;
        created_at: string;
        updated_at: string;
    };
    activity: {
        id: string;
        name: string;
        description: string;
        start_date: string;
        end_date: string;
        meta: Record<string, any>;
        created_at: string;
        updated_at: string;
        check_in_limit: number;
        single_location_only: boolean;
    };
}

interface UseAllCheckinsResult {
    checkins: Checkin[];
    isLoading: boolean;
    error: string | null;
}

export function useAllCheckins(deviceId: string | null): UseAllCheckinsResult {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!deviceId) return;

        const fetchCheckins = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check_ins/index_with_activity`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Temp-User-Token': deviceId
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data: CheckinResponse = await response.json();
                if (data.success && data.data) {
                    setCheckins(data.data.check_ins);
                } else {
                    throw new Error(data.error?.message || '無法獲取打卡資訊');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCheckins();
    }, [deviceId]);

    return { checkins, isLoading, error };
}
