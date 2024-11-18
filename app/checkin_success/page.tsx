'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { useActivity } from '@/hooks/useActivity';

export default function CheckinSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activityId = searchParams.get('activity_id');
    const locationId = searchParams.get('location_id');

    const { activity, isLoading } = useActivity(activityId);
    const [locationName, setLocationName] = useState<string | null>(null);

    useEffect(() => {
        if (activity && locationId) {
            const location = activity.locations.find((loc) => loc.id === locationId);
            if (location) {
                setLocationName(location.name);
            }
        }
    }, [activity, locationId]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>打卡成功！</CardTitle>
                        <CardDescription>感謝您的參與。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-2xl mb-2">✅</p>
                            <p className="text-xl font-semibold mb-4">您的打卡已成功記錄。</p>
                            {isLoading ? (
                                <p>載入活動資訊中...</p>
                            ) : activity ? (
                                <div className="text-left bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">{activity.name}</h3>
                                    <p className="text-gray-600 mb-2">
                                        打卡地點：{locationName || '未知地點'}
                                    </p>
                                    <p className="text-gray-600">
                                        打卡時間：{new Date().toLocaleString()}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" onClick={() => router.push('/my-checkins')}>
                            查看我的打卡記錄
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push('/')}
                        >
                            返回首頁
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
