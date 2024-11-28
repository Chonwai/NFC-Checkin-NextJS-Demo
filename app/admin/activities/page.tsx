'use client';

import { useAdminActivities } from '@/hooks/admin/useAdminActivities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, MapPin, CheckSquare, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function AdminActivities() {
    const { activities, isLoading, error } = useAdminActivities();

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
                                <div className="flex items-end gap-2">
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
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {new Date(activity.start_date).toLocaleDateString()} -
                                        {new Date(activity.end_date).toLocaleDateString()}
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
