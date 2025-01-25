'use client';

import { useState } from 'react';
import { useActivityParticipants } from '@/hooks/admin/useActivityParticipants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from 'lucide-react';

export function ActivityParticipants({ activityId }: { activityId: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'check_in_count' | 'last_check_in' | 'completion_status'>(
        'last_check_in'
    );
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const {
        participants = [],
        pagination,
        isLoading,
        error
    } = useActivityParticipants(activityId, {
        page: currentPage,
        limit: 10,
        search: searchQuery,
        sort_by: sortBy,
        sort_order: sortOrder
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleSort = (value: 'check_in_count' | 'last_check_in' | 'completion_status') => {
        if (value === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(value);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    if (isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 w-1/3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜尋參與者..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full"
                    />
                </div>
                <Select value={sortBy} onValueChange={(value: any) => handleSort(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="check_in_count">打卡次數</SelectItem>
                        <SelectItem value="last_check_in">最後打卡時間</SelectItem>
                        <SelectItem value="completion_status">完成狀態</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>參與者列表</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>用戶資料</TableHead>
                                <TableHead>設備資訊</TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => handleSort('check_in_count')}
                                        className="flex items-center gap-1"
                                    >
                                        打卡進度
                                        <ArrowUpDown className="h-4 w-4" />
                                    </button>
                                </TableHead>
                                <TableHead>打卡時間</TableHead>
                                <TableHead>
                                    <button
                                        onClick={() => handleSort('completion_status')}
                                        className="flex items-center gap-1"
                                    >
                                        完成狀態
                                        <ArrowUpDown className="h-4 w-4" />
                                    </button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        暫無參與者數據
                                    </TableCell>
                                </TableRow>
                            ) : (
                                participants.map((participant) => (
                                    <TableRow key={participant.user_id}>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    {participant.user_id.slice(0, 8)}...
                                                </div>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    {participant.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <span>📱</span>
                                                            {participant.phone}
                                                        </div>
                                                    )}
                                                    {participant.email && (
                                                        <div className="flex items-center gap-1">
                                                            <span>📧</span>
                                                            {participant.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {participant.device_id.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    {participant.check_in_progress}
                                                </div>
                                                <div className="text-xs text-muted-foreground mb-1">
                                                    {participant.location_progress}
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-primary h-2.5 rounded-full"
                                                        style={{
                                                            width: `${participant.completion_percentage}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        首次：
                                                    </span>
                                                    {new Date(
                                                        participant.first_check_in
                                                    ).toLocaleString()}
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        最後：
                                                    </span>
                                                    {new Date(
                                                        participant.last_check_in
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-sm ${
                                                        participant.completion_status === '已完成'
                                                            ? 'bg-green-100 text-green-800'
                                                            : participant.completion_status ===
                                                                '進行中'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {participant.completion_status}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {participant.completion_percentage}%
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            共 {pagination?.total || 0} 位參與者
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
                                第 {pagination?.current_page || 1} / {pagination?.total_pages || 1}{' '}
                                頁
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
                </CardContent>
            </Card>
        </div>
    );
}
