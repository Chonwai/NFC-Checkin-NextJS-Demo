'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/admin/useDashboardStats';
import { useActivitiesData } from '@/hooks/admin/useActivitiesData';
import { Activity, Users, CheckSquare, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocationsData } from '@/hooks/admin/useLocationsData';
import { useUserActivityTrend } from '@/hooks/admin/useUserActivityTrend';

export default function AdminDashboard() {
    const { stats, isLoading, error } = useDashboardStats();
    const {
        activitiesData,
        isLoading: activitiesDataLoading,
        error: activitiesDataError
    } = useActivitiesData();
    const {
        locationsData,
        isLoading: locationsDataLoading,
        error: locationsDataError
    } = useLocationsData();
    const {
        trendData,
        isLoading: trendDataLoading,
        error: trendDataError
    } = useUserActivityTrend();

    if (isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">管理員儀表板</h1>

            <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">總活動數</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activities.total || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            進行中：{stats?.activities.active || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">總打卡次數</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.check_ins.total || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            打卡地點數：{stats?.check_ins.unique_locations || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">用戶數</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            活躍用戶：{stats?.users.active || 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="text-sm text-gray-500 text-right">
                最後更新：
                {stats?.stats_updated_at ? new Date(stats.stats_updated_at).toLocaleString() : '-'}
            </div>

            <div id="dashboard-analytics" className="grid grid-cols-1 gap-6">
                <Tabs defaultValue="activity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger className="py-2" value="activity">
                            活動參與分析
                        </TabsTrigger>
                        <TabsTrigger className="py-2" value="locations">
                            地點分佈
                        </TabsTrigger>
                        <TabsTrigger className="py-2" value="users">
                            用戶活躍度
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    活動參與趨勢
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activitiesData.map((activity, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-semibold">{activity.name}</h3>
                                                <span
                                                    className={`px-2 py-1 rounded text-sm ${
                                                        activity.status === '進行中'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {activity.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 mt-2">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        參與人數
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {activity.total_users}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        打卡次數
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {activity.total_check_ins}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        完整完成率
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {
                                                            activity.completion_stats
                                                                .full_completion_rate
                                                        }
                                                        %
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        部分完成率
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {
                                                            activity.completion_stats
                                                                .partial_completion_rate
                                                        }
                                                        %
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>
                                                    活動天數：
                                                    {Math.ceil(
                                                        activity.active_days / (24 * 60 * 60)
                                                    )}{' '}
                                                    天
                                                </span>
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
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    熱門打卡地點排行
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {locationsData.map((location, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <div className="font-medium">{location.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    獨立用戶數：{location.unique_users}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">
                                                    {location.check_in_count}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    打卡次數
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    用戶活躍度分析
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">
                                                    日活躍用戶
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {trendData[0]?.active_users || 0}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    新增用戶：{trendData[0]?.new_users || 0}
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">
                                                    週活躍用戶
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {trendData
                                                        .slice(0, 7)
                                                        .reduce(
                                                            (sum, day) => sum + day.active_users,
                                                            0
                                                        )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    週新增：
                                                    {trendData
                                                        .slice(0, 7)
                                                        .reduce(
                                                            (sum, day) => sum + day.new_users,
                                                            0
                                                        )}
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">
                                                    月活躍用戶
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {trendData
                                                        .slice(0, 30)
                                                        .reduce(
                                                            (sum, day) => sum + day.active_users,
                                                            0
                                                        )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    月新增：
                                                    {trendData
                                                        .slice(0, 30)
                                                        .reduce(
                                                            (sum, day) => sum + day.new_users,
                                                            0
                                                        )}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">最近活躍記錄</h3>
                                        <div className="space-y-2">
                                            {trendData.slice(0, 7).map((day, index) => (
                                                <div
                                                    key={day.date}
                                                    className="flex items-center justify-between p-2 bg-muted rounded"
                                                >
                                                    <div className="text-sm">
                                                        {new Date(day.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <span className="text-sm">
                                                            活躍：{day.active_users}
                                                        </span>
                                                        <span className="text-sm text-green-600">
                                                            新增：+{day.new_users}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
