// app/checkin/CheckinContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { getDeviceId } from '@/lib/fingerprint';
import { useCheckin } from '@/hooks/useCheckin';

export default function CheckinContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const { createCheckin, isLoading, error, isSuccess } = useCheckin();

    const activityId = searchParams.get('activity_id');
    const locationId = searchParams.get('location_id');
    const locationName = searchParams.get('location_name');

    useEffect(() => {
        const fetchDeviceId = async () => {
            const id = await getDeviceId();
            setDeviceId(id);
        };
        fetchDeviceId();
    }, []);

    useEffect(() => {
        if (!activityId || !locationId) {
            router.push('/');
        }
    }, [activityId, locationId, router]);

    const handleCheckin = async () => {
        if (!activityId || !locationId || !deviceId) return;
        await createCheckin(activityId, locationId, deviceId);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>活動打卡</CardTitle>
                <CardDescription>
                    {locationName ? `在 ${locationName} 打卡` : '打卡地點'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : isSuccess ? (
                    <div className="text-center">
                        <p className="text-2xl mb-2">✅</p>
                        <p className="text-xl font-semibold">打卡成功！</p>
                    </div>
                ) : (
                    <p>準備在 {locationName} 打卡嗎？點擊下方按鈕確認。</p>
                )}
            </CardContent>
            <CardFooter>
                {!isSuccess && !error && (
                    <Button 
                        className="w-full" 
                        onClick={handleCheckin}
                        disabled={isLoading}
                    >
                        {isLoading ? '處理中...' : '確認打卡'}
                    </Button>
                )}
                {(isSuccess || error) && (
                    <Button className="w-full" onClick={() => router.push('/my-checkins')}>
                        查看我的打卡記錄
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
