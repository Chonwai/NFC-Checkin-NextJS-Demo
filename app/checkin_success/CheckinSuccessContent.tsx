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
import { useActivity } from '@/hooks/useActivity';
import { Check, MapPin, Calendar, Info, Star } from 'lucide-react';
import { ActivityInfoModal } from '@/components/ActivityInfoModal';
import { ContactInfoModal } from '@/components/ContactInfoModal';
import { useContactInfo } from '@/hooks/useContactInfo';
import Image from 'next/image';

export default function CheckinSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activityId = searchParams.get('activity_id');
    const locationId = searchParams.get('location_id');
    const requiresContactInfo = searchParams.get('requires_contact_info') === 'true';
    const [showContactModal, setShowContactModal] = useState(false);

    const { activity, isLoading } = useActivity(activityId);
    const [locationName, setLocationName] = useState<string | null>(null);
    const { submitContactInfo, isLoading: isSubmitting } = useContactInfo();

    useEffect(() => {
        if (activity && locationId) {
            const location = activity.locations.find((loc) => loc.id === locationId);
            if (location) {
                setLocationName(location.name);
            }
        }
    }, [activity, locationId]);

    useEffect(() => {
        if (requiresContactInfo) {
            setShowContactModal(true);
        }
    }, [requiresContactInfo]);

    const locationIcon =
        activity?.locations.find((loc) => loc.id === locationId)?.check_in_icon_type === 'custom' &&
        activity?.locations.find((loc) => loc.id === locationId)?.check_in_icon_url ? (
            <div className="mx-auto w-16 h-16 flex items-center justify-center">
                <Image
                    src={
                        activity.locations.find((loc) => loc.id === locationId)
                            ?.check_in_icon_url || ''
                    }
                    alt="打卡圖標"
                    width={48}
                    height={48}
                />
            </div>
        ) : (
            <div className="mx-auto w-16 h-16 bg-[#009f92] rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
            </div>
        );

    return (
        <div className="min-h-screen bg-[#00777b] py-8">
            <Card className="w-full max-w-md mx-auto bg-[#f7e7be] border-none">
                <CardHeader className="text-center">
                    {locationIcon}
                    <CardTitle className="text-2xl font-rubik text-[#00777b]">打卡成功！</CardTitle>
                    <CardDescription className="text-[#009f92]">
                        太棒了！您離獎勵更近一步
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-[#009f92] rounded w-3/4 opacity-50" />
                                <div className="h-4 bg-[#009f92] rounded w-1/2 opacity-50" />
                            </div>
                        ) : activity ? (
                            <>
                                <div className="bg-white rounded-xl p-4">
                                    <h3 className="font-rubik text-[#00777b] mb-2">
                                        {activity.name}
                                    </h3>
                                    <div className="space-y-2 text-[#009f92]">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {locationName || '未知地點'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date().toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <div className="text-center">
                                        <h3 className="font-rubik text-[#00777b] mb-2">
                                            查看活動詳情
                                        </h3>
                                        <p className="text-sm text-[#009f92] mb-3">
                                            了解更多活動規則和獎勵內容
                                        </p>
                                        <ActivityInfoModal activity={activity}>
                                            <Button className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white font-medium">
                                                <Info className="w-4 h-4 mr-2" />
                                                活動詳情
                                            </Button>
                                        </ActivityInfoModal>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                        onClick={() => router.push(`/activities/${activityId}`)}
                    >
                        返回活動頁面
                    </Button>
                    <Button
                        className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                        onClick={() => router.push('/my-checkins')}
                    >
                        查看我的集點進度
                    </Button>
                    <Button
                        className="w-full bg-[#fe9e84] hover:bg-[#fe9e84]/90 text-white"
                        onClick={() => router.push('/')}
                    >
                        返回首頁
                    </Button>
                </CardFooter>
            </Card>

            {showContactModal && (
                <ContactInfoModal
                    isOpen={showContactModal}
                    onClose={() => setShowContactModal(false)}
                    onSubmit={submitContactInfo}
                />
            )}
        </div>
    );
}
