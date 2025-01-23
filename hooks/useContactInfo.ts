'use client';

import { useState } from 'react';
import { getDeviceId } from '@/lib/fingerprint';
import { ApiResponse } from '@/types/api';

interface ContactInfoData {
    phone?: string;
    email?: string;
}

interface UseContactInfoResult {
    submitContactInfo: (data: ContactInfoData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

export function useContactInfo(): UseContactInfoResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const submitContactInfo = async (data: ContactInfoData) => {
        setIsLoading(true);
        setError(null);
        try {
            const deviceId = await getDeviceId();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/contact-info`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Temp-User-Token': deviceId
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const responseData: ApiResponse<{ success: boolean }> = await response.json();
            if (!responseData.success) {
                throw new Error(responseData.error?.message || '提交失敗');
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || '未知錯誤');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return { submitContactInfo, isLoading, error, isSuccess };
}
