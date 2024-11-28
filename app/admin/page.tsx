'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/admin/useDashboardStats';
import { Activity, Users, CheckSquare } from 'lucide-react';

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
        </div>
    );
}
