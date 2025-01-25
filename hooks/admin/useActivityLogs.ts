'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/utils/adminFetch';

interface ActivityLog {
    id: string;
    timestamp: string;
    type: string;
    action: string;
    details: {
        user_id: string;
        user_name: string;
        location_id: string;
        location_name: string;
    };
}

interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}

interface UseActivityLogsResult {
    logs: ActivityLog[];
    pagination: PaginationInfo;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

interface FetchLogsParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    sort_order?: 'asc' | 'desc';
}

export function useActivityLogs(
    activityId: string,
    params: FetchLogsParams = {}
): UseActivityLogsResult {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        current_page: 1,
        total_pages: 1,
        has_next: false,
        has_prev: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.type) queryParams.append('type', params.type);
            if (params.sort_order) queryParams.append('sort_order', params.sort_order);

            const response = await adminFetch(
                `/api/admin/activities/${activityId}/logs?${queryParams.toString()}`
            );

            if (response.success && response.data) {
                setLogs(response.data.logs);
                setPagination(response.data.pagination);
                setError(null);
            } else {
                throw new Error(response.error?.message || '無法獲取活動日誌');
            }
        } catch (err: any) {
            setError(err.message || '未知錯誤');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [activityId, params.page, params.limit, params.type, params.sort_order]);

    return {
        logs,
        pagination,
        isLoading,
        error,
        refetch: fetchLogs
    };
}
