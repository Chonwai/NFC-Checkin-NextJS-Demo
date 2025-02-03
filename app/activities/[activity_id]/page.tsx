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
import { Beer, Gift, Star, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { getDeviceId } from '@/lib/fingerprint';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ActivityInfoModal } from '@/components/ActivityInfoModal';
import { CheckinHistoryModal } from '@/components/CheckinHistoryModal';
import { RewardModal } from '@/components/RewardModal';
import Image from 'next/image';

interface ActivityDetailsProps {
    params: Promise<{ activity_id: string }>;
}

export default function ActivityDetails({ params }: ActivityDetailsProps) {
    const [activityId, setActivityId] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        params.then(({ activity_id }) => setActivityId(activity_id));
    }, [params]);

    const { activity, isLoading, error } = useActivity(activityId, deviceId);
    const router = useRouter();

    const [tempUserId, setTempUserId] = useState<string | null>(null);
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
        <div className="min-h-screen bg-[#00777b]">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto bg-[#f7e7be] border-none shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-rubik text-[#00777b]">
                            {activity?.name || '載入中...'}
                        </CardTitle>
                        <CardDescription className="text-[#009f92]">
                            收集印章，獲得獎勵！
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-[#009f92] rounded w-3/4 opacity-50" />
                                <div className="h-4 bg-[#009f92] rounded w-1/2 opacity-50" />
                            </div>
                        ) : error ? (
                            <div className="text-[#fe9e84] text-center p-4">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                                <p>{error}</p>
                            </div>
                        ) : activity ? (
                            <>
                                {/* 集點進度卡片 */}
                                <div className="bg-white rounded-xl p-6">
                                    <h2 className="text-xl font-rubik text-[#00777b] mb-4 text-center">
                                        集點進度
                                    </h2>
                                    <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                                        {checkins?.map((checkin, index) => {
                                            // 根據打卡記錄找到對應的地點
                                            const location = activity.locations.find(
                                                (loc) => loc.id === checkin.location_id
                                            );

                                            return (
                                                <div key={index}>
                                                    {location?.check_in_icon_type === 'custom' &&
                                                    location?.check_in_icon_url ? (
                                                        <Image
                                                            src={location.check_in_icon_url}
                                                            alt="打卡圖標"
                                                            width={32}
                                                            height={32}
                                                            className="w-8 h-8"
                                                        />
                                                    ) : (
                                                        <div className="bg-[#009f92] p-1.5 rounded-full">
                                                            <Star className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {/* 顯示剩餘未打卡的位置 */}
                                        {Array.from({
                                            length:
                                                activity.check_in_limit *
                                                    activity.locations.length -
                                                (checkins?.length || 0)
                                        }).map((_, index) => (
                                            <div
                                                key={`empty-${index}`}
                                                className="w-8 h-8 rounded-full border-2 border-dashed border-[#009f92] flex items-center justify-center"
                                            >
                                                <Star className="w-5 h-5 text-[#009f92]" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-center text-[#00777b] font-medium">
                                        已收集 {checkins?.length || 0} /{' '}
                                        {activity.check_in_limit * activity.locations.length} 個印章
                                    </p>

                                    {/* 新增完成打卡提示 */}
                                    {checkins?.length ===
                                        activity.check_in_limit * activity.locations.length && (
                                        <div className="mt-4 text-center">
                                            <div className="bg-[#009f92]/10 rounded-lg p-4">
                                                <Gift className="w-8 h-8 text-[#009f92] mx-auto mb-2" />
                                                <p className="text-[#00777b] font-medium">
                                                    恭喜獲得獎勵！
                                                </p>
                                                <p className="text-[#009f92] text-sm mt-1">
                                                    您已完成本活動的所有打卡任務
                                                </p>
                                                {activity.meta?.reward_api && (
                                                    <div className="mt-4">
                                                        <RewardModal
                                                            activity={activity}
                                                            tempUserId={
                                                                checkins?.[checkins.length - 1]
                                                                    ?.temp_user_id
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 打卡記錄 Modal */}
                                    <CheckinHistoryModal checkins={checkins || []} />
                                </div>

                                {/* 活動資訊卡片 */}
                                <div className="bg-white rounded-xl p-6">
                                    <h2 className="text-xl font-rubik text-[#00777b] mb-4">
                                        活動資訊
                                    </h2>
                                    <div className="space-y-3 text-[#00777b]">
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-[#009f92]" />
                                            {new Date(activity.start_date).toLocaleDateString()} -
                                            {new Date(activity.end_date).toLocaleDateString()}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-[#009f92]" />
                                            {activity.single_location_only
                                                ? '單一地點'
                                                : '多地點'}{' '}
                                            活動
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <ActivityInfoModal activity={activity} />
                                    </div>
                                </div>

                                {/* 打卡地點列表 */}
                                {activity.locations.map((location) => {
                                    const locationIcon =
                                        location.check_in_icon_type === 'custom' &&
                                        location.check_in_icon_url ? (
                                            <Image
                                                src={location.check_in_icon_url}
                                                alt="打卡圖標"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8"
                                            />
                                        ) : (
                                            <div className="bg-[#009f92] p-1.5 rounded-full">
                                                <Star className="w-5 h-5 text-white" />
                                            </div>
                                        );

                                    return (
                                        <div
                                            key={location.id}
                                            className="bg-white rounded-xl p-4 flex justify-between items-center"
                                        >
                                            <div>
                                                <h3 className="font-rubik text-[#00777b]">
                                                    {location.name}
                                                </h3>
                                                <p className="text-sm text-[#009f92]">
                                                    {location.address}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {locationIcon}
                                                <Button
                                                    className="bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                                                    size="sm"
                                                >
                                                    可打卡
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : null}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
