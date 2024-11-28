'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCheckinToken } from '@/hooks/useCheckinToken';
import { getDeviceId } from '@/lib/fingerprint';

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
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>打卡中...</CardTitle>
                <CardDescription>請稍候，正在完成您的打卡操作。</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>目前正在處理您的打卡請求，請勿關閉此頁面。</p>
                </div>
            </CardContent>
        </Card>
    );
}
