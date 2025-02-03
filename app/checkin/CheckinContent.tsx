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
import { useActivity } from '@/hooks/useActivity';
import { getDeviceId } from '@/lib/fingerprint';

export default function CheckinContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [deviceId, setDeviceId] = useState<string | null>(null);

    const activityId = searchParams.get('activity_id');
    const locationId = searchParams.get('location_id');

    const {
        activity,
        isLoading: isActivityLoading,
        error: activityError
    } = useActivity(activityId, deviceId);

    const [locationName, setLocationName] = useState<string | null>(null);

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

    useEffect(() => {
        if (activity && locationId) {
            console.log('activity', activity);
            const location = activity.locations.find((loc) => loc.id === locationId);
            if (location) {
                setLocationName(location.name);
            } else {
                setLocationName('未知地點');
            }
        }
    }, [activity, locationId]);

    // 當用戶訪問 CheckinContent 時，自動重定向到 CheckinVerify 頁面
    useEffect(() => {
        if (activityId && locationId && deviceId) {
            router.push(`/checkin_verify?activity_id=${activityId}&location_id=${locationId}`);
        }
    }, [activityId, locationId, deviceId, router]);

    if (isActivityLoading) {
        return (
            <Card className="w-full max-w-md mx-auto mt-10">
                <CardHeader>
                    <CardTitle>活動打卡</CardTitle>
                    <CardDescription>載入中...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>請稍候，活動資訊正在載入。</p>
                </CardContent>
            </Card>
        );
    }

    if (activityError) {
        return (
            <Card className="w-full max-w-md mx-auto mt-10">
                <CardHeader>
                    <CardTitle>活動打卡</CardTitle>
                    <CardDescription>發生錯誤</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">{activityError}</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => router.push('/')}>
                        返回首頁
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>活動打卡</CardTitle>
                <CardDescription>
                    {locationName ? `在 ${locationName} 打卡` : '打卡地點'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {activity?.description && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">活動描述</h2>
                        <p>{activity.description}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <p className="text-center text-sm text-gray-500 w-full">
                    您將被自動重定向以完成打卡操作。
                </p>
            </CardFooter>
        </Card>
    );
}
