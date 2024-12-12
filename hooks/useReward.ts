import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/types/api';

interface CouponData {
    id: string;
    code: string;
    status: string;
    usedAt: string | null;
    coupon: {
        name: string;
        imageUrl: string;
        imageAlt: string | null;
        description: string | null;
        value: number;
        startedDate: string;
        endedDate: string;
    };
}

interface RewardResponse extends ApiResponse<CouponData[]> {}

interface UseRewardResult {
    rewardInfo: CouponData[] | null;
    isLoading: boolean;
    error: string | null;
    fetchRewardInfo: (endpoint: string, userId: string, showLoading?: boolean) => Promise<void>;
}

export function useReward(): UseRewardResult {
    const [rewardInfo, setRewardInfo] = useState<CouponData[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pollingEndpoint, setPollingEndpoint] = useState<string | null>(null);
    const [pollingUserId, setPollingUserId] = useState<string | null>(null);

    const fetchRewardInfo = async (
        endpoint: string,
        userId: string,
        showLoading: boolean = true
    ) => {
        if (!endpoint || !userId) return;

        setPollingEndpoint(endpoint);
        setPollingUserId(userId);

        if (showLoading) {
            setIsLoading(true);
        }

        try {
            const queryEndpoint = endpoint.replace('%{user_id}', userId);
            const response = await fetch(queryEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.status === 'ok' && data.data) {
                setRewardInfo(data.data);
            } else {
                throw new Error('無法獲取獎勵資訊');
            }
        } catch (err) {
            setError('無法獲取獎勵資訊');
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (pollingEndpoint && pollingUserId) {
            intervalId = setInterval(() => {
                fetchRewardInfo(pollingEndpoint, pollingUserId, false);
            }, 3000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [pollingEndpoint, pollingUserId]);

    return { rewardInfo, isLoading, error, fetchRewardInfo };
}
