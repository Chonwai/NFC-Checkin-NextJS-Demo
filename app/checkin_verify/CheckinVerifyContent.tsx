'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCheckinToken } from '@/hooks/useCheckinToken';
import { getDeviceId } from '@/lib/fingerprint';
import { Loader2 } from 'lucide-react';

export default function CheckinVerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { performCheckin, isLoading, error, isSuccess } = useCheckinToken();
    const [deviceId, setDeviceId] = useState<string | null>(null);

    const activityId = searchParams.get('activity_id');
    const locationId = searchParams.get('location_id');

    useEffect(() => {
        const fetchDeviceId = async () => {
            const id = await getDeviceId();
            setDeviceId(id);
        };
        fetchDeviceId();
    }, []);

    useEffect(() => {
        if (activityId && locationId && deviceId) {
            performCheckin(activityId, locationId, deviceId);
        } else if (activityId && locationId && deviceId === null) {
            console.log('正在獲取 deviceId...');
        } else {
            console.log('缺少 activityId 或 locationId 或 deviceId');
            router.push('/checkin_error');
        }
    }, [activityId, locationId, deviceId]);

    useEffect(() => {
        if (isSuccess && activityId && locationId) {
            router.push(`/checkin_success?activity_id=${activityId}&location_id=${locationId}`);
        }
    }, [isSuccess, activityId, locationId, router]);

    useEffect(() => {
        if (error) {
            const encodedError = encodeURIComponent(error);
            router.push(`/checkin_error?message=${encodedError}`);
        }
    }, [error, router]);

    return (
        <Card className="w-full max-w-md mx-auto bg-[#f7e7be] border-none">
            <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#009f92]/20 rounded-full flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-[#009f92] animate-spin" />
                </div>
                <CardTitle className="text-2xl font-rubik text-[#00777b]">打卡處理中</CardTitle>
                <CardDescription className="text-[#009f92]">
                    請稍候，正在為您完成打卡
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center space-y-4">
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-[#009f92] rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-[#009f92] rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-[#009f92] rounded-full animate-bounce" />
                        </div>
                        <p className="mt-4 text-[#00777b]">正在處理您的打卡請求，請勿關閉此頁面</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
