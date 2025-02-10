'use client';

import { useActivity } from '@/hooks/useActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, MapPin, Clock, FileText, Gift, XCircle } from 'lucide-react';
import Link from 'next/link';
import { ActivityStats } from '@/components/admin/activities/ActivityStats';
import { ActivityParticipants } from '@/components/admin/activities/ActivityParticipants';
import { ActivityLogs } from '@/components/admin/activities/ActivityLogs';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getRewardModeColor } from '@/lib/reward-mode';

export default function ActivityPage({ params }: any) {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const { activity, isLoading } = useActivity(params.id, deviceId);

    if (isLoading) {
        return <div>載入中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{activity?.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/activities/${params.id}/edit`}>
                        <Button variant="outline">編輯活動</Button>
                    </Link>
                    <span
                        className={`px-2 py-1 rounded text-sm ${
                            activity?.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {activity?.is_active ? '進行中' : '已結束'}
                    </span>
                </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-4">
                    <TabsTrigger value="info" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        基本資訊
                    </TabsTrigger>
                    <TabsTrigger value="locations" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        打卡地點
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        參與者
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        數據分析
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        活動日誌
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>活動資訊</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">活動名稱</h3>
                                    <p className="text-base">{activity?.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">活動狀態</h3>
                                    <span
                                        className={`px-2 py-1 rounded text-sm ${
                                            activity?.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {activity?.is_active ? '進行中' : '已結束'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">活動描述</h3>
                                <p className="text-base">{activity?.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">開始時間</h3>
                                    <p className="text-base">
                                        {new Date(activity?.start_date || '').toLocaleString()}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">結束時間</h3>
                                    <p className="text-base">
                                        {new Date(activity?.end_date || '').toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        打卡次數限制
                                    </h3>
                                    <p className="text-base">{activity?.check_in_limit} 次</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        單一地點限制
                                    </h3>
                                    <p className="text-base">
                                        {activity?.single_location_only ? '是' : '否'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        需要聯絡資訊
                                    </h3>
                                    <p className="text-base">
                                        {activity?.requires_contact_info ? '是' : '否'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">更新時間</h3>
                                    <p className="text-base">
                                        {new Date(activity?.updated_at || '').toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">獎勵機制</h3>
                                <div className="flex items-center gap-2">
                                    {activity?.meta?.reward_api ? (
                                        <>
                                            <Badge
                                                className={`${getRewardModeColor(activity.reward_mode).bg} ${getRewardModeColor(activity.reward_mode).text} ${getRewardModeColor(activity.reward_mode).hover}`}
                                            >
                                                <Gift className="w-4 h-4 mr-1" />
                                                {activity.reward_mode === 'full' && '全部完成'}
                                                {activity.reward_mode === 'partial' && '部分完成'}
                                                {activity.reward_mode === 'two_tier' && '兩階段'}
                                                {activity.reward_mode === 'multi-tier' && '多階段'}
                                            </Badge>
                                            <div className="text-sm text-gray-600">
                                                {activity.reward_mode === 'partial' && (
                                                    <span className="ml-2">
                                                        (需集滿 {activity.meta.reward_threshold} 點)
                                                    </span>
                                                )}
                                                {activity.reward_mode === 'full' && (
                                                    <span className="ml-2">(需完成所有打卡)</span>
                                                )}
                                                {activity.reward_mode === 'two_tier' && (
                                                    <span className="ml-2">(兩階段獎勵)</span>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                            <XCircle className="w-4 h-4 mr-1" />
                                            無獎勵機制
                                        </Badge>
                                    )}
                                </div>
                                {activity?.meta?.reward_api && (
                                    <div className="mt-2 space-y-1">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">發放端點：</span>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">
                                                {activity.meta.reward_api.issue_endpoint}
                                            </code>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">查詢端點：</span>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">
                                                {activity.meta.reward_api.query_endpoint}
                                            </code>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="locations">
                    <Card>
                        <CardHeader>
                            <CardTitle>打卡地點管理</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* 將在後續實現 */}
                            <div>打卡地點列表將在這裡顯示</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="participants">
                    <ActivityParticipants activityId={params.id} />
                </TabsContent>

                <TabsContent value="stats">
                    <ActivityStats activityId={params.id} />
                </TabsContent>

                <TabsContent value="logs">
                    <ActivityLogs activityId={params.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
