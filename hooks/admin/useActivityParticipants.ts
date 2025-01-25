'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/utils/adminFetch';

interface Participant {
    user_id: string;
    device_id: string;
    phone: string;
    email: string;
    name: string;
    check_in_count: number;
    first_check_in: string;
    last_check_in: string;
    completion_status: string;
    completion_percentage: number;
}

interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}

interface UseActivityParticipantsResult {
    participants: Participant[];
    pagination: PaginationInfo;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

interface FetchParticipantsParams {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: 'check_in_count' | 'last_check_in' | 'completion_status';
    sort_order?: 'asc' | 'desc';
}

export function useActivityParticipants(
    activityId: string,
    params: FetchParticipantsParams = {}
): UseActivityParticipantsResult {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        current_page: 1,
        total_pages: 1,
        has_next: false,
        has_prev: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchParticipants = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.sort_by) queryParams.append('sort_by', params.sort_by);
            if (params.sort_order) queryParams.append('sort_order', params.sort_order);

            const response = await adminFetch(
                `/api/admin/activities/${activityId}/participants?${queryParams.toString()}`
            );

            if (response.success && response.data) {
                setParticipants(response.data.participants);
                setPagination(response.data.pagination);
                setError(null);
            } else {
                throw new Error(response.error?.message || '無法獲取參與者列表');
            }
        } catch (err: any) {
            setError(err.message || '未知錯誤');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [activityId, params.page, params.limit, params.sort_by, params.sort_order]);

    return {
        participants,
        pagination,
        isLoading,
        error,
        refetch: fetchParticipants
    };
}
