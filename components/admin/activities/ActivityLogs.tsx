'use client';

import { useState } from 'react';
import { useActivityLogs } from '@/hooks/admin/useActivityLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function ActivityLogs({ activityId }: { activityId: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [actionType, setActionType] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const {
        logs = [],
        pagination,
        isLoading,
        error
    } = useActivityLogs(activityId, {
        page: currentPage,
        limit: 20,
        search: searchQuery,
        type: actionType === 'all' ? undefined : actionType,
        sort_order: sortOrder
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    if (isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const getActionTypeColor = (type: string) => {
        switch (type) {
            case 'check_in':
                return 'bg-green-100 text-green-800';
            case 'register':
                return 'bg-blue-100 text-blue-800';
            case 'complete':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getActionTypeText = (type: string) => {
        switch (type) {
            case 'check_in':
                return '打卡';
            case 'register':
                return '註冊';
            case 'complete':
                return '完成';
            default:
                return type;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 w-1/3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜尋日誌..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select value={actionType} onValueChange={setActionType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="動作類型" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部</SelectItem>
                            <SelectItem value="check_in">打卡</SelectItem>
                            <SelectItem value="register">註冊</SelectItem>
                            <SelectItem value="complete">完成</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={sortOrder}
                        onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="排序方式" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">最新優先</SelectItem>
                            <SelectItem value="asc">最舊優先</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>活動日誌</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                暫無日誌記錄
                            </div>
                        ) : (
                            logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium">
                                                {log.details.user_name}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded text-sm ${getActionTypeColor(
                                                    log.type
                                                )}`}
                                            >
                                                {getActionTypeText(log.type)}
                                            </span>
                                            {log.details.location_name && (
                                                <span className="text-sm text-muted-foreground">
                                                    @ {log.details.location_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            {log.action}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                共 {pagination?.total || 0} 條記錄
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={!pagination?.has_prev}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">
                                    第 {pagination?.current_page || 1} /{' '}
                                    {pagination?.total_pages || 1} 頁
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={!pagination?.has_next}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
