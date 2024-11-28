'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCreateLocation } from '@/hooks/admin/useCreateLocation';
import { useAdminActivities } from '@/hooks/admin/useAdminActivities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export default function CreateLocation() {
    const router = useRouter();
    const { toast } = useToast();
    const { createLocation, isLoading } = useCreateLocation();
    const { activities, isLoading: isLoadingActivities } = useAdminActivities();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        activity_id: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createLocation({
                location: formData
            });

            if (response.success) {
                toast({
                    title: '建立成功',
                    description: `地點「${formData.name}」已成功建立`,
                    duration: 3000
                });
                router.push('/admin/locations');
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

    if (isLoadingActivities) {
        return <div>載入中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">建立新地點</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>地點資訊</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">地點名稱</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">地點描述</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">地址</label>
                            <Input
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">所屬活動</label>
                            <Select
                                value={formData.activity_id}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, activity_id: value })
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="選擇活動" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activities.map((activity) => (
                                        <SelectItem key={activity.id} value={activity.id}>
                                            {activity.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                取消
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? '建立中...' : '建立地點'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
