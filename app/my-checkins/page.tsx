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
import Link from 'next/link';
import { AlertTriangle, MapPin, Calendar, Star, Gift } from 'lucide-react';

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
        <div className="min-h-screen bg-[#00777b]">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto bg-[#f7e7be] border-none shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-rubik text-[#00777b]">
                            我的集點冒險
                        </CardTitle>
                        <CardDescription className="text-[#009f92]">
                            查看您的集點進度和歷史記錄
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-24 bg-[#009f92] rounded-xl opacity-20"
                                    />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-[#fe9e84] text-center p-4">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                                <p>{error}</p>
                            </div>
                        ) : checkins.length > 0 ? (
                            <div className="space-y-4">
                                {/* 總集點統計 */}
                                <div className="bg-white rounded-xl p-6 text-center">
                                    <h3 className="text-xl font-rubik text-[#00777b] mb-4">
                                        總集點成就
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-3xl font-bold text-[#009f92]">
                                                {checkins.length}
                                            </p>
                                            <p className="text-sm text-[#00777b]">總打卡次數</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-[#009f92]">
                                                {new Set(checkins.map((c) => c.activity.id)).size}
                                            </p>
                                            <p className="text-sm text-[#00777b]">參與活動</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-[#009f92]">
                                                {new Set(checkins.map((c) => c.location.id)).size}
                                            </p>
                                            <p className="text-sm text-[#00777b]">造訪地點</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 打卡記錄列表 */}
                                <div className="space-y-3">
                                    {checkins.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/activities/${item.activity.id}`}
                                            className="block"
                                        >
                                            <div className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <h3 className="font-rubik text-[#00777b] text-lg">
                                                            {item.activity.name}
                                                        </h3>
                                                        <div className="space-y-1 text-sm text-[#009f92]">
                                                            <p className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4" />
                                                                {item.location.name}
                                                            </p>
                                                            <p className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(
                                                                    item.check_in.checkin_time
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#009f92] text-white p-2 rounded-full">
                                                        <Star className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Gift className="w-16 h-16 mx-auto text-[#009f92] mb-4" />
                                <p className="text-[#00777b] mb-2">還沒有任何打卡記錄</p>
                                <p className="text-[#009f92] text-sm mb-4">開始您的集點冒險吧！</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-[#fe9e84] hover:bg-[#fe9e84]/90 text-white"
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
