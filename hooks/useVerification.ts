'use client';

import { useState } from 'react';
import { getDeviceId } from '@/lib/fingerprint';
import { ApiResponse } from '@/types/api';

export function useVerification(activityId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const verifyCode = async (code: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities/${activityId}/temp_users/verify_code`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Temp-User-Token': await getDeviceId()
                    },
                    body: JSON.stringify({ code })
                }
            );

            const responseData: ApiResponse<{
                success?: boolean;
                error?: {
                    message: Array<{ code: string; message: any }>;
                };
            }> = await response.json();

            if (!response.ok || !responseData.success) {
                throw new Error(responseData.error?.message?.[0]?.message || '驗證碼錯誤');
            }

            return responseData;

            // if (!response.ok) {
            //     throw new Error('驗證碼錯誤');
            // }

            // const data: ApiResponse<{
            //     requires_verification?: boolean;
            //     verification_sent?: boolean;
            //     message?: string;
            // }> = await response.json();
            // return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
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
                status?: string;
                requires_verification?: boolean;
                message?: string;
            }> = await response.json();

            if (!response.ok || data?.status !== 'ok') {
                throw new Error(data?.message || '發送失敗');
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
