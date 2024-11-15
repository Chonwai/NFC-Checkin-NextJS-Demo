'use client';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/api';

interface CheckinResponse
    extends ApiResponse<{
        check_ins: Checkin[];
    }> {}

interface Checkin {
    id: string;
    temp_user_id: string;
    location_id: string;
    checkin_time: string;
    meta: Record<string, any>;
    created_at: string;
    updated_at: string;
}

interface UseListCheckinsResult {
    checkins: Checkin[];
    isLoading: boolean;
    error: string | null;
}

export function useListCheckins(
    activityId: string | null,
    deviceId: string | null
): UseListCheckinsResult {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!activityId || !deviceId) return;

        const fetchCheckins = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities/${activityId}/check_ins`,
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
    }, [activityId, deviceId]);

    return { checkins, isLoading, error };
}
