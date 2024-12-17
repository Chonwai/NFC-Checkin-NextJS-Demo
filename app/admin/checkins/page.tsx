'use client';

import { useCheckInAnalytics } from '@/hooks/admin/useCheckInAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, MapPin, TrendingUp } from 'lucide-react';
import { formatUUID } from '@/utils/format';
import {
    formatDateTime,
    convertUTCHourToHKT,
    formatHourDisplay,
    formatHourWithTimezone
} from '@/utils/dateTime';

export default function CheckInsAnalytics() {
    const { timeDistribution, userBehavior, locationHeatMap, completionTrend, isLoading, error } =
        useCheckInAnalytics();

    if (isLoading) return <div>載入中...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">打卡記錄分析</h1>

            <Tabs defaultValue="time" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="time">時間分布</TabsTrigger>
                    <TabsTrigger value="users">用戶行為</TabsTrigger>
                    <TabsTrigger value="locations">地點熱度</TabsTrigger>
                    <TabsTrigger value="completion">完成趨勢</TabsTrigger>
                </TabsList>

                <TabsContent value="time">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                打卡時間分布
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium mb-2">每小時分布</h3>
                                    <div className="space-y-2">
                                        {Object.entries(timeDistribution?.hourly_distribution || {})
                                            .map(([hour, count]) => ({
                                                hour: convertUTCHourToHKT(parseInt(hour)),
                                                count
                                            }))
                                            .sort((a, b) => a.hour - b.hour)
                                            .map(({ hour, count }) => (
                                                <div
                                                    key={hour}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span>{formatHourDisplay(hour)}</span>
                                                    <span>{count} 次</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">每週分布</h3>
                                    <div className="space-y-2">
                                        {Object.entries(
                                            timeDistribution?.weekly_distribution || {}
                                        ).map(([day, count]) => (
                                            <div
                                                key={day}
                                                className="flex items-center justify-between"
                                            >
                                                <span>週{day}</span>
                                                <span>{count} 次</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                用戶打卡行為分析
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userBehavior?.user_behavior_stats.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        <div className="mb-2">
                                            <span className="text-sm text-muted-foreground">
                                                用戶 ID: {formatUUID(user.id)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    總打卡次數
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {user.total_check_ins}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    首次打卡
                                                </p>
                                                <p className="text-sm">
                                                    {new Date(user.first_check_in).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    最後打卡
                                                </p>
                                                <p className="text-sm">
                                                    {formatDateTime(user.last_check_in)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    參與活動時長
                                                </p>
                                                <p className="text-sm">
                                                    {Math.round(user.duration / 60)} 分鐘
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="locations">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                地點熱度分析
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {locationHeatMap?.location_heat_map.map((location, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{location.name}</h3>
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            打卡次數
                                                        </p>
                                                        <p className="font-semibold">
                                                            {location.check_in_count}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            獨立用戶數
                                                        </p>
                                                        <p className="font-semibold">
                                                            {location.unique_users}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            打卡時間中位數
                                                        </p>
                                                        <p className="font-semibold">
                                                            {convertUTCHourToHKT(
                                                                location.median_check_in_hour
                                                            )}
                                                            :00
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completion">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                活動完成趨勢
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {completionTrend?.completion_trend.map((trend, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">
                                                    {trend.activity_name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    總用戶數：{trend.total_users}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg">
                                                    {trend.completion_rate.toFixed(1)}%
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    完成率
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${trend.completion_rate}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
