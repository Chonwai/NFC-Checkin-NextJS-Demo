'use client';

import { useActivity } from '@/hooks/useActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, MapPin, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import EditActivityContent from './edit/EditActivityContent';

export default function ActivityPage({ params }: { params: { id: string } }) {
    const { activity, isLoading } = useActivity(params.id);

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
                    <Card>
                        <CardHeader>
                            <CardTitle>參與者列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* 將在後續實現 */}
                            <div>參與者列表將在這裡顯示</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>數據分析</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* 將在後續實現 */}
                            <div>數據分析將在這裡顯示</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs">
                    <Card>
                        <CardHeader>
                            <CardTitle>活動日誌</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* 將在後續實現 */}
                            <div>活動日誌將在這裡顯示</div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
