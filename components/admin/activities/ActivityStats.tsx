'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityStats } from '@/hooks/admin/useActivityStats';
import { Users, CheckSquare, MapPin, Clock } from 'lucide-react';

export function ActivityStats({ activityId }: { activityId: string }) {
    const { stats, isLoading, error } = useActivityStats(activityId);

    if (isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* 概覽卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">總打卡次數</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.check_in_stats.total_check_ins || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            平均每人{' '}
                            {stats?.check_in_stats.average_check_ins_per_user.toFixed(1) || 0} 次
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">參與人數</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.check_in_stats.unique_users || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            完成率 {stats?.check_in_stats.completion_rate.toFixed(1) || 0}%
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">最受歡迎地點</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold line-clamp-1">
                            {stats?.location_stats.most_popular_location.name || '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.location_stats.most_popular_location.check_in_count || 0} 次打卡
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">高峰時段</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.time_stats.peak_hours[0]?.hour || 0}:00
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.time_stats.peak_hours[0]?.count || 0} 次打卡
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 地點分佈 */}
            <Card>
                <CardHeader>
                    <CardTitle>打卡地點分佈</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats?.location_stats.location_distribution.map((location) => (
                            <div
                                key={location.location_id}
                                className="flex items-center justify-between p-4 bg-muted rounded-lg"
                            >
                                <div className="space-y-1">
                                    <div className="font-medium">{location.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        獨立用戶數：{location.unique_users}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">{location.check_in_count}</div>
                                    <div className="text-sm text-muted-foreground">打卡次數</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 每日趨勢 */}
            <Card>
                <CardHeader>
                    <CardTitle>打卡趨勢</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats?.time_stats.daily_trend.map((day) => (
                            <div
                                key={day.date}
                                className="flex items-center justify-between p-4 bg-muted rounded-lg"
                            >
                                <div className="space-y-1">
                                    <div className="font-medium">
                                        {new Date(day.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        獨立用戶：{day.unique_users}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">{day.check_in_count}</div>
                                    <div className="text-sm text-muted-foreground">打卡次數</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
