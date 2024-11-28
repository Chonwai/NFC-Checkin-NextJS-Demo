'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/admin/useDashboardStats';
import { Activity, Users, CheckSquare, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
    const { stats, isLoading, error } = useDashboardStats();

    if (isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">管理員儀表板</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="grid grid-cols-1 gap-6">
                <Tabs defaultValue="activity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="activity">活動參與分析</TabsTrigger>
                        <TabsTrigger value="locations">地點分佈</TabsTrigger>
                        <TabsTrigger value="users">用戶活躍度</TabsTrigger>
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
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                    圖表區域：顯示每個活動的打卡次數、完成率等數據
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="locations">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">熱門打卡地點排行</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* 這裡可以放地點排行列表 */}
                                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                                        <div>地點 A</div>
                                        <div className="text-muted-foreground">打卡次數：123</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">用戶活躍度分析</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm">
                                                    日活躍用戶
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">123</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm">
                                                    週活躍用戶
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">456</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm">
                                                    月活躍用戶
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">789</div>
                                            </CardContent>
                                        </Card>
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
