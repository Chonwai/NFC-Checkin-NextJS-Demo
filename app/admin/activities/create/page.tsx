'use client';

import { useCreateActivity } from '@/hooks/admin/useCreateActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function CreateActivity() {
    const { createActivity, isLoading } = useCreateActivity();
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        check_in_limit: 1,
        single_location_only: true,
        is_active: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createActivity({
                activity: {
                    ...formData,
                    start_date: new Date(formData.start_date).toISOString(),
                    end_date: new Date(formData.end_date).toISOString()
                }
            });

            if (response.success && response.data) {
                toast({
                    title: '建立成功',
                    description: `活動「${response.data.activity.name}」已成功建立`,
                    duration: 3000
                });
                router.push('/admin/activities');
            }
        } catch (err: any) {
            toast({
                title: '建立失敗',
                description: err.message || '未知錯誤',
                variant: 'destructive',
                duration: 3000
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">建立新活動</h1>
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
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">活動描述</label>
                            <Textarea
                                required
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">開始日期</label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_date: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">結束日期</label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">打卡次數上限</label>
                            <Input
                                type="number"
                                min="1"
                                required
                                value={formData.check_in_limit}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        check_in_limit: parseInt(e.target.value)
                                    })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">限制單一地點</label>
                            <Switch
                                checked={formData.single_location_only}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, single_location_only: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">立即啟用</label>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                取消
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? '建立中...' : '建立活動'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
