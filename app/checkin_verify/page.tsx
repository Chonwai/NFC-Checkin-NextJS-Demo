'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCheckinToken } from '@/hooks/useCheckinToken';
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardFooter,
    CardTitle
} from '@/components/ui/card';
import Header from '@/components/Header';
import { getDeviceId } from '@/lib/fingerprint';

export default function CheckinVerify() {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityId, locationId, deviceId]);

    useEffect(() => {
        if (isSuccess) {
            router.push(`/checkin_success?activity_id=${activityId}&location_id=${locationId}`);
        }
    }, [isSuccess, router, activityId, locationId]);

    useEffect(() => {
        if (error) {
            const encodedError = encodeURIComponent(error);
            router.push(`/checkin_error?message=${encodedError}`);
        }
    }, [error, router]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>打卡中...</CardTitle>
                        <CardDescription>請稍候，正在完成您的打卡操作。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>目前正在處理您的打卡請求，請勿關閉此頁面。</p>
                        {isLoading && <p>打卡中...</p>}
                    </CardContent>
                    <CardFooter>
                        <p className="text-center text-sm text-gray-500 w-full">
                            正在完成打卡操作，請稍候。
                        </p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
