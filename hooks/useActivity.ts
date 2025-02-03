'use client';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/api';
import { ParticipationRequirement } from '@/types/admin';

interface ActivityDetailsResponse
    extends ApiResponse<{
        activity: Activity;
    }> {}

interface Activity {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    meta: Record<string, any>;
    created_at: string;
    updated_at: string;
    check_in_limit: number;
    single_location_only: boolean;
    locations: Location[];
    is_active: boolean;
    requires_contact_info: boolean;
    participation_info: {
        notices: string[];
        requirements: {
            type: 'location' | 'reward';
            count: number;
            description: string;
        }[];
    };
    reward_mode: 'full' | 'partial' | 'two_tier' | 'multi-tier';
    user_reward_status?: {
        has_reward: boolean;
        reward_count: number;
        check_in_count: number;
        reward_threshold: number;
        reward_mode: string;
    };
}

interface Location {
    id: string;
    name: string;
    description: string;
    activity_id: string;
    address: string;
    meta: Record<string, any>;
    created_at: string;
    updated_at: string;
    check_in_icon_type?: 'default' | 'custom';
    check_in_icon_url?: string;
}

interface UseActivityResult {
    activity: Activity | null;
    isLoading: boolean;
    error: string | null;
}

export function useActivity(activityId: string | null, deviceId: string | null): UseActivityResult {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!activityId) return;

        const fetchActivity = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities/${activityId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Temp-User-Token': deviceId || ''
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data: ActivityDetailsResponse = await response.json();
                if (data.success && data.data) {
                    setActivity(data.data.activity);
                } else {
                    throw new Error(data.error?.message || '無法獲取活動資訊');
                }
            } catch (err: any) {
                setError(err.message || '未知錯誤');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, [activityId]);

    return { activity, isLoading, error };
}
