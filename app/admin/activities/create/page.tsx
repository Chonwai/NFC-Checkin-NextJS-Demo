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
import dayjs from 'dayjs';
import {
    formatUTCToZonedInput,
    formatDateTimeForInput,
    formatInputToUTC,
    formatDateTime
} from '@/utils/dateTime';

interface CreateActivityFormData {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    check_in_limit: number;
    single_location_only: boolean;
    is_active: boolean;
    requires_contact_info: boolean;
    game_id?: string;
}

export default function CreateActivity() {
    const { createActivity, isLoading } = useCreateActivity();
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<CreateActivityFormData>({
        name: '',
        description: '',
        start_date: formatUTCToZonedInput(dayjs().format()),
        end_date: formatUTCToZonedInput(dayjs().add(7, 'day').format()),
        check_in_limit: 1,
        single_location_only: true,
        is_active: true,
        requires_contact_info: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                start_date: formatInputToUTC(formData.start_date),
                end_date: formatInputToUTC(formData.end_date),
                meta: formData.requires_contact_info
                    ? {
                          subscription_api: {
                              game_id: formData.game_id
                          }
                      }
                    : undefined
            };

            const response = await createActivity({
                activity: payload
            });

            if (response.success) {
                toast({
                    title: '建立成功',
                    description: `活動「${formData.name}」已成功建立`,
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

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">需要收集聯絡資訊？</label>
                                <Switch
                                    checked={formData.requires_contact_info}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, requires_contact_info: checked })
                                    }
                                />
                            </div>

                            {formData.requires_contact_info && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Game ID</label>
                                    <Input
                                        value={formData.game_id || ''}
                                        onChange={(e) =>
                                            setFormData({ ...formData, game_id: e.target.value })
                                        }
                                        placeholder="請輸入外部系統的 Game ID"
                                        required
                                    />
                                </div>
                            )}
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
