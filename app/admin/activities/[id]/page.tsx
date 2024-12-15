'use client';

import { useActivity } from '@/hooks/admin/useActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, CheckSquare, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatDateTime } from '@/utils/dateTime';

export default function ActivityDetails({ params }: { params: Promise<{ id: string }> }) {
    const [activityId, setActivityId] = useState<string | null>(null);
    const { activity, isLoading, error } = useActivity(activityId);

    useEffect(() => {
        params.then(({ id }) => setActivityId(id));
    }, [params]);

    if (!activityId || isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!activity) {
        return <div>找不到活動</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{activity.name}</h1>
                <Link href={`/admin/activities/${activity.id}/edit`}>
                    <Button variant="outline">
                        <Pencil className="h-4 w-4 mr-2" />
                        編輯活動
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>活動資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">描述</h3>
                        <p className="text-muted-foreground">{activity.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                {formatDateTime(activity.start_date)} -{' '}
                                {formatDateTime(activity.end_date)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">打卡上限：{activity.check_in_limit}</span>
                        </div>
                        <div className="flex items-center gap-2">
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

                    <div>
                        <h3 className="font-medium mb-2">地點列表</h3>
                        <div className="grid gap-4">
                            {activity.locations.map((location) => (
                                <Card key={location.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/admin/locations/${location.id}`}
                                                    className="text-lg font-medium hover:underline"
                                                >
                                                    {location.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {location.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {location.address}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link href={`/admin/locations/${location.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4 mr-1" />
                                                    編輯
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
