'use client';

import { useAdminActivities } from '@/hooks/admin/useAdminActivities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, MapPin, CheckSquare, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { formatDateTime } from '@/utils/dateTime';

export default function AdminActivities() {
    const { activities, isLoading, error } = useAdminActivities();
    const { toast } = useToast();
    if (isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">活動管理</h1>
                <Link href="/admin/activities/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        建立新活動
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {activities.map((activity) => (
                    <Card key={activity.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="w-full flex justify-between items-center">
                                <div className="w-1/2">
                                    <CardTitle className="text-xl">
                                        <Link
                                            href={`/admin/activities/${activity.id}`}
                                            className="hover:underline"
                                        >
                                            {activity.name}
                                        </Link>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {activity.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/activities/${activity.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4 mr-1" />
                                            編輯
                                        </Button>
                                    </Link>
                                    <span
                                        className={`px-2 py-1 rounded text-sm ${
                                            activity.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {activity.is_active ? '進行中' : '已結束'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {formatDateTime(activity.start_date)} -{' '}
                                            {formatDateTime(activity.end_date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            地點數：{activity.locations.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            打卡上限：{activity.check_in_limit}
                                        </span>
                                    </div>
                                </div>

                                {activity.locations.length > 0 && (
                                    <div className="pt-4 border-t">
                                        <h3 className="text-sm font-medium mb-2">NFC 打卡連結</h3>
                                        <div className="space-y-2">
                                            {activity.locations.map((location) => (
                                                <div
                                                    key={location.id}
                                                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                                                >
                                                    <span className="text-sm">{location.name}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/checkin_verify?activity_id=${activity.id}&location_id=${location.id}`;
                                                            navigator.clipboard.writeText(url);
                                                            toast({
                                                                title: '已複製連結',
                                                                description: '已將連結複製到剪貼簿',
                                                                duration: 3000
                                                            });
                                                        }}
                                                    >
                                                        複製連結
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
