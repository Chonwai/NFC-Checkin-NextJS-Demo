'use client';

import { useState } from 'react';
import { getDeviceId } from '@/lib/fingerprint';
import { ApiResponse } from '@/types/api';

interface VerificationResponse {
    success: boolean;
    error?: {
        message: string | string[];
        code?: string;
        details?: {
            code: string;
        };
    };
}

export function useVerification(activityId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyCode = async (code: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/activities/${activityId}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const responseData: VerificationResponse = await response.json();

            if (!response.ok || !responseData.success) {
                // 處理錯誤訊息可能是字串或字串陣列的情況
                const errorMessage = Array.isArray(responseData.error?.message)
                    ? responseData.error.message[0]
                    : responseData.error?.message || '驗證碼錯誤';
                throw new Error(errorMessage);
            }

            return responseData;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerification = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities/${activityId}/temp_users/resend_verification`,
                {
                    method: 'POST',
                    headers: {
                        'X-Temp-User-Token': await getDeviceId()
                    }
                }
            );

            const data: ApiResponse<{
                verification_sent?: boolean;
                verification_error?: string;
                requires_verification?: boolean;
                message?: string;
            }> = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data?.error?.message || '發送失敗');
            }

            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { verifyCode, resendVerification, isLoading, error };
}
