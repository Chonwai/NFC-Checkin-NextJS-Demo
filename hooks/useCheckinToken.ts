'use client';

import { useState } from 'react';
import { ApiResponse } from '@/types/api';

interface CheckinTokenResponse
    extends ApiResponse<{
        token: string;
    }> {}

interface CheckinWithTokenResponse
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

interface ErrorResponse {
    message: string;
    code: string;
    details?: string[];
}

interface ApiErrorResponse {
    success: false;
    error: ErrorResponse;
}

interface UseCheckinTokenResult {
    performCheckin: (activityId: string, locationId: string, deviceId: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
    data?: {
        requires_contact_info: boolean;
        check_in: {
            id: string;
            temp_user_id: string;
            location_id: string;
            checkin_time: string;
            meta: Record<string, any>;
            created_at: string;
            updated_at: string;
        } | null;
    };
}

export function useCheckinToken(): UseCheckinTokenResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [data, setData] = useState<UseCheckinTokenResult['data']>();

    const performCheckin = async (activityId: string, locationId: string, deviceId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. 向後端請求一次性令牌
            const tokenResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check_ins/generate_token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Temp-User-Token': deviceId
                    },
                    body: JSON.stringify({
                        activity_id: activityId,
                        location_id: locationId
                    })
                }
            );

            if (!tokenResponse.ok) {
                throw new Error(`Error: ${tokenResponse.status} ${tokenResponse.statusText}`);
            }

            const tokenData: CheckinTokenResponse = await tokenResponse.json();
            if (!tokenData.success || !tokenData.data) {
                throw new Error(tokenData.error?.message || '獲取令牌失敗');
            }

            const token = tokenData.data.token;

            // 2. 使用令牌完成打卡
            const checkinResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check_ins`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Temp-User-Token': deviceId
                    },
                    body: JSON.stringify({
                        check_in: {
                            activity_id: activityId,
                            location_id: locationId
                        },
                        token: token
                    })
                }
            );

            if (!checkinResponse.ok) {
                throw new Error(`Error: ${checkinResponse.status} ${checkinResponse.statusText}`);
            }

            const checkinData: CheckinWithTokenResponse | ApiErrorResponse =
                await checkinResponse.json();
            if (!checkinData.success) {
                const errorDetails = (checkinData as ApiErrorResponse).error.details;
                const errorMessage =
                    errorDetails && errorDetails.length > 0
                        ? errorDetails[0]
                        : (checkinData as ApiErrorResponse).error.message;
                throw new Error(errorMessage || '打卡失敗');
            }

            setData({
                requires_contact_info:
                    (checkinData as CheckinWithTokenResponse).data?.requires_contact_info || false,
                check_in: (checkinData as CheckinWithTokenResponse).data?.check_in || null
            });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || '未知錯誤');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return { performCheckin, isLoading, error, isSuccess, data };
}
