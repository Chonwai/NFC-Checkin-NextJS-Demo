'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import Header from '@/components/Header';
import { useAllCheckins } from '@/hooks/useAllCheckins';
import { getDeviceId } from '@/lib/fingerprint';
import { useRouter } from 'next/navigation';

export default function MyCheckins() {
    const router = useRouter();
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const { checkins, isLoading, error } = useAllCheckins(deviceId);

    useEffect(() => {
        const fetchDeviceId = async () => {
            const id = await getDeviceId();
            setDeviceId(id);
        };
        fetchDeviceId();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>我的打卡記錄</CardTitle>
                        <CardDescription>以下是您的所有打卡記錄：</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p>載入中...</p>
                        ) : error ? (
                            <p className="text-red-500">發生錯誤：{error}</p>
                        ) : checkins.length > 0 ? (
                            <ul className="space-y-4">
                                {checkins.map((item) => (
                                    <li key={item.id} className="bg-white p-4 rounded shadow">
                                        <h3 className="font-semibold">{item.activity.name}</h3>
                                        <p>地點：{item.location.name}</p>
                                        <p>
                                            時間：
                                            {new Date(item.check_in.checkin_time).toLocaleString()}
                                        </p>
                                        <p>地址：{item.location.address}</p>
                                        {/* 可以根據需求添加更多資訊 */}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>目前沒有打卡記錄。</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => router.push('/')}>
                            返回首頁
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
