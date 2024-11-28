'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUpdateLocation } from '@/hooks/admin/useUpdateLocation';
import { useLocation } from '@/hooks/admin/useLocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function EditLocationContent({ locationId }: { locationId: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const { location, isLoading: isLoadingLocation } = useLocation(locationId);
    const { updateLocation, isLoading: isUpdating } = useUpdateLocation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: ''
    });

    useEffect(() => {
        if (location) {
            setFormData({
                name: location.name,
                description: location.description,
                address: location.address
            });
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await updateLocation(locationId, {
                location: formData
            });

            if (response.success) {
                toast({
                    title: '更新成功',
                    description: `地點「${formData.name}」已成功更新`,
                    duration: 3000
                });
                router.push('/admin/locations');
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

    if (isLoadingLocation) {
        return <div>載入中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">編輯地點</h1>
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

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                取消
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? '更新中...' : '更新地點'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
