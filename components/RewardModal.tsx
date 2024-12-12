import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import Image from 'next/image';
import { useReward } from '@/hooks/useReward';

interface RewardModalProps {
    activity: any;
    tempUserId: string | null;
}

export function RewardModal({ activity, tempUserId }: RewardModalProps) {
    const { rewardInfo, isLoading, error, fetchRewardInfo } = useReward();

    const handleFetchReward = async () => {
        if (!activity.meta?.reward_api?.query_endpoint || !tempUserId) return;
        await fetchRewardInfo(activity.meta.reward_api.query_endpoint, tempUserId);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                    onClick={handleFetchReward}
                >
                    <Gift className="w-4 h-4 mr-2" />
                    查看我的獎勵
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#f7e7be] border-none max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[#00777b] font-rubik text-xl">
                        活動獎勵
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center p-4">載入中...</div>
                    ) : error ? (
                        <div className="text-[#fe9e84] text-center p-4">{error}</div>
                    ) : rewardInfo && rewardInfo.length > 0 ? (
                        <div className="bg-white rounded-lg p-4">
                            {rewardInfo.map((reward) => (
                                <div key={reward.id} className="space-y-4">
                                    {reward.coupon.imageUrl && (
                                        <div className="relative w-full aspect-[2048/1779]">
                                            <Image
                                                src={reward.coupon.imageUrl}
                                                alt={reward.coupon.imageAlt || reward.coupon.name}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <h3 className="font-rubik text-[#00777b] text-lg">
                                            {reward.coupon.name}
                                        </h3>
                                        {reward.coupon.description && (
                                            <p className="text-[#009f92] text-sm">
                                                {reward.coupon.description}
                                            </p>
                                        )}
                                        <div className="bg-[#f7e7be]/50 p-3 rounded-lg">
                                            <p className="text-[#00777b] font-medium">
                                                兌換碼：{reward.code}
                                            </p>
                                            <p className="text-[#009f92] text-sm mt-1">
                                                有效期限：
                                                {new Date(
                                                    reward.coupon.endedDate
                                                ).toLocaleDateString()}
                                            </p>
                                            <p className="text-[#009f92] text-sm">
                                                狀態：
                                                {reward.status === 'PENDING' ? '未使用' : '已使用'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-4 text-[#009f92]">未找到獎勵</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
