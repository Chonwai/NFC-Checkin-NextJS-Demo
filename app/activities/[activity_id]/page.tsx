'use client';

import { useRouter } from 'next/navigation';
import { useActivity } from '@/hooks/useActivity';
import { useListCheckins } from '@/hooks/useListCheckins';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import Header from '../../../components/Header';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from '@/components/ui/accordion';
import { Beer, Gift } from 'lucide-react';
import { getDeviceId } from '@/lib/fingerprint';
import { useState, useEffect } from 'react';

interface ActivityDetailsProps {
    params: Promise<{ activity_id: string }>;
}

export default function ActivityDetails({ params }: ActivityDetailsProps) {
    const [activityId, setActivityId] = useState<string | null>(null);

    useEffect(() => {
        params.then(({ activity_id }) => setActivityId(activity_id));
    }, [params]);

    const { activity, isLoading, error } = useActivity(activityId);
    const router = useRouter();

    const [deviceId, setDeviceId] = useState<string | null>(null);
    const {
        checkins,
        isLoading: isCheckinsLoading,
        error: checkinsError
    } = useListCheckins(activityId, deviceId);

    useEffect(() => {
        const fetchDeviceId = async () => {
            const id = await getDeviceId();
            setDeviceId(id);
        };
        fetchDeviceId();
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>活動詳情</CardTitle>
                        <CardDescription>查看活動的詳細資訊</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p>載入中...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : activity ? (
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{activity.name}</h1>
                                <p className="mb-4">{activity.description}</p>
                                <p>
                                    <strong>開始日期：</strong>
                                    {new Date(activity.start_date).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>結束日期：</strong>
                                    {new Date(activity.end_date).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>打卡限制：</strong>
                                    {activity.check_in_limit} 次
                                </p>
                                <p>
                                    <strong>單一地點：</strong>
                                    {activity.single_location_only ? '是' : '否'}
                                </p>

                                {/* 地點列表 */}
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold">地點列表</h2>
                                    <Accordion type="single" collapsible>
                                        {activity.locations.map((location) => (
                                            <AccordionItem key={location.id} value={location.id}>
                                                <AccordionTrigger className="font-semibold">
                                                    {location.name}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <p>
                                                        <strong>描述：</strong>
                                                        {location.description}
                                                    </p>
                                                    <p>
                                                        <strong>地址：</strong>
                                                        {location.address}
                                                    </p>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>

                                {/* 打卡狀態顯示 */}
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold mb-2">打卡狀態</h2>
                                    {isCheckinsLoading ? (
                                        <p>載入中...</p>
                                    ) : checkinsError ? (
                                        <p className="text-red-500">{checkinsError}</p>
                                    ) : (
                                        <div>
                                            {activity.single_location_only ? (
                                                // 單一地點模式
                                                <div className="grid grid-cols-12 gap-2">
                                                    {[...Array(activity.check_in_limit)].map(
                                                        (_, i) => (
                                                            <Beer
                                                                key={i}
                                                                className={`w-6 h-6 ${
                                                                    i < checkins.length
                                                                        ? 'text-yellow-500'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                // 多地點模式
                                                <div className="space-y-2">
                                                    {activity.locations.map((location) => {
                                                        const locationCheckins = checkins.filter(
                                                            (checkin) =>
                                                                checkin.location_id === location.id
                                                        );
                                                        return (
                                                            <div
                                                                key={location.id}
                                                                className="flex items-center gap-4"
                                                            >
                                                                <span className="min-w-[120px] text-sm">
                                                                    {location.name}
                                                                </span>
                                                                <Beer
                                                                    className={`w-6 h-6 ${
                                                                        locationCheckins.length > 0
                                                                            ? 'text-yellow-500'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <p className="mt-2">
                                                已打卡: {checkins.length} /
                                                {activity.single_location_only
                                                    ? activity.check_in_limit
                                                    : activity.locations.length}
                                            </p>

                                            {activity.single_location_only
                                                ? checkins.length >= activity.check_in_limit
                                                : checkins.length >= activity.locations.length && (
                                                      <div className="bg-yellow-100 p-4 rounded-lg text-center mt-2">
                                                          <Gift className="inline-block w-6 h-6 text-yellow-500 mb-2" />
                                                          <p className="font-semibold">
                                                              恭喜！您已完成所有打卡！
                                                          </p>
                                                      </div>
                                                  )}
                                        </div>
                                    )}
                                </div>

                                {/* 打卡記錄 */}
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold mb-2">打卡記錄</h2>
                                    {isCheckinsLoading ? (
                                        <p>載入中...</p>
                                    ) : checkinsError ? (
                                        <p className="text-red-500">{checkinsError}</p>
                                    ) : checkins.length > 0 ? (
                                        <ul className="space-y-2">
                                            {checkins.map((checkin: any) => (
                                                <li
                                                    key={checkin.id}
                                                    className="bg-white p-2 rounded shadow"
                                                >
                                                    {checkin.barName} -{' '}
                                                    {new Date(
                                                        checkin.checkin_time
                                                    ).toLocaleString()}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>目前沒有打卡記錄。</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p>沒有找到活動資訊。</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleGoBack} className="w-full">
                            返回
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
