'use client';

import { useState } from 'react';
import { ApiResponse } from '@/types/api';

interface CheckinData {
    check_in: {
        location_id: string;
    };
    device_id: string;
}

interface CheckinResponse
    extends ApiResponse<{
        check_in: {
            id: string;
            temp_user_id: string;
            location_id: string;
            checkin_time: string;
            meta: Record<string, any>;
            created_at: string;
            updated_at: string;
        };
        requires_contact_info: boolean;
    }> {}

interface UseCheckinResult {
    createCheckin: (activityId: string, locationId: string, deviceId: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

export function useCheckin(): UseCheckinResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const createCheckin = async (activityId: string, locationId: string, deviceId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check_ins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Temp-User-Token': deviceId
                },
                body: JSON.stringify({
                    check_in: {
                        location_id: locationId,
                        activity_id: activityId
                    },
                    device_id: deviceId
                })
            });

            const data: CheckinResponse = await response.json();
            if (data.success && data.data) {
                setIsSuccess(true);
            } else {
                throw new Error(data.error?.message || '打卡失敗');
            }
        } catch (err: any) {
            setError(err.message || '未知錯誤');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return { createCheckin, isLoading, error, isSuccess };
}
