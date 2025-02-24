'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUpdateActivity } from '@/hooks/admin/useUpdateActivity';
import { useActivity } from '@/hooks/useActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    formatLocalToUTC,
    formatDateTimeForInput,
    formatUTCToZonedInput,
    formatInputToUTC
} from '@/utils/dateTime';

interface EditActivityFormData {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    check_in_limit: number;
    single_location_only: boolean;
    is_active: boolean;
    requires_contact_info: boolean;
}

export default function EditActivityContent({ activityId }: { activityId: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const { activity, isLoading: isLoadingActivity } = useActivity(activityId);
    const { updateActivity, isLoading: isUpdating } = useUpdateActivity();
    const [formData, setFormData] = useState<EditActivityFormData>({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        check_in_limit: 1,
        single_location_only: true,
        is_active: true,
        requires_contact_info: false
    });

    useEffect(() => {
        if (activity) {
            setFormData({
                name: activity.name,
                description: activity.description,
                start_date: formatUTCToZonedInput(activity.start_date),
                end_date: formatUTCToZonedInput(activity.end_date),
                check_in_limit: activity.check_in_limit,
                single_location_only: activity.single_location_only,
                is_active: activity.is_active,
                requires_contact_info: activity.requires_contact_info
            });
        }
    }, [activity]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                start_date: formatInputToUTC(formData.start_date),
                end_date: formatInputToUTC(formData.end_date)
            };

            const response = await updateActivity(activityId, {
                activity: payload
            });

            if (response.success) {
                toast({
                    title: '更新成功',
                    description: `活動「${formData.name}」已成功更新`,
                    duration: 3000
                });
                router.push('/admin/activities');
            }
        } catch (err: any) {
            toast({
                title: '更新失敗',
                description: err.message || '未知錯誤',
                variant: 'destructive',
                duration: 3000
            });
        }
    };

    if (isLoadingActivity) {
        return <div>載入中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">編輯活動</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>活動資訊</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">活動名稱</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">活動描述</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">開始時間</label>
                                <Input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(formData.start_date)}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_date: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">結束時間</label>
                                <Input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(formData.end_date)}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">打卡次數限制</label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.check_in_limit}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        check_in_limit: parseInt(e.target.value)
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">僅限單一地點打卡</label>
                            <Switch
                                checked={formData.single_location_only}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, single_location_only: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">活動開啟</label>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">需要聯絡資訊</label>
                            <Switch
                                checked={formData.requires_contact_info}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, requires_contact_info: checked })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                取消
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? '更新中...' : '更新活動'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
