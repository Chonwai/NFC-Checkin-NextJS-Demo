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

export default function EditActivityContent({ activityId }: { activityId: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const { activity, isLoading: isLoadingActivity } = useActivity(activityId);
    const { updateActivity, isLoading: isUpdating } = useUpdateActivity();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        check_in_limit: 1,
        single_location_only: true,
        is_active: true
    });

    useEffect(() => {
        if (activity) {
            setFormData({
                name: activity.name,
                description: activity.description,
                start_date: new Date(activity.start_date).toISOString().slice(0, 16),
                end_date: new Date(activity.end_date).toISOString().slice(0, 16),
                check_in_limit: activity.check_in_limit,
                single_location_only: activity.single_location_only,
                is_active: activity.is_active
            });
        }
    }, [activity]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await updateActivity(activityId, {
                activity: {
                    ...formData,
                    start_date: new Date(formData.start_date).toISOString(),
                    end_date: new Date(formData.end_date).toISOString()
                }
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
                                    value={formData.start_date}
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
                                    value={formData.end_date}
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

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.single_location_only}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, single_location_only: checked })
                                }
                            />
                            <label className="text-sm font-medium">僅限單一地點打卡</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                            />
                            <label className="text-sm font-medium">活動開啟</label>
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
