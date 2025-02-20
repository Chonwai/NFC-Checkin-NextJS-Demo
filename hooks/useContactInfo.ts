'use client';

import { useState } from 'react';
import { getDeviceId } from '@/lib/fingerprint';
import { ApiResponse } from '@/types/api';

interface ContactInfoData {
    phone?: string;
    email?: string;
}

interface UseContactInfoResult {
    submitContactInfo: (
        data: ContactInfoData,
        activityId: string
    ) => Promise<{
        requiresVerification: boolean;
        message: string;
    }>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

export function useContactInfo(): UseContactInfoResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const submitContactInfo = async (data: ContactInfoData, activityId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const deviceId = await getDeviceId();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities/${activityId}/temp_users/update_contact_info`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Temp-User-Token': deviceId
                    },
                    body: JSON.stringify({
                        temp_user: {
                            phone: data.phone,
                            email: data.email
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const responseData: ApiResponse<{
                requires_verification?: boolean;
                verification_error?: string;
                verification_sent?: boolean;
                message?: string;
            }> = await response.json();

            if (
                responseData.data?.verification_error &&
                responseData.data?.verification_sent === false
            ) {
                return {
                    requiresVerification: false,
                    message: responseData.data.verification_error
                };
            }

            return {
                requiresVerification: responseData.data?.requires_verification || false,
                message: responseData.data?.message || '提交成功'
            };
        } catch (err: any) {
            setError(err.message || '未知錯誤');
            setIsSuccess(false);
            return {
                requiresVerification: false,
                message: '提交失敗'
            };
        } finally {
            setIsLoading(false);
        }
    };

    return { submitContactInfo, isLoading, error, isSuccess };
}
