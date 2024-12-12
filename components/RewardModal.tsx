import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, Check, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useReward } from '@/hooks/useReward';
import QRCode from 'react-qr-code';
import { useState } from 'react';

interface RewardModalProps {
    activity: any;
    tempUserId: string | null;
}

export function RewardModal({ activity, tempUserId }: RewardModalProps) {
    const { rewardInfo, isLoading, error, fetchRewardInfo } = useReward();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && activity.meta?.reward_api?.query_endpoint && tempUserId) {
            fetchRewardInfo(activity.meta.reward_api.query_endpoint, tempUserId, true);
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return '未使用';
            case 'USED':
                return '已使用';
            case 'CANCELLED':
                return '已失效';
            default:
                return '未知狀態';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'text-[#009f92]';
            case 'USED':
                return 'text-gray-500';
            case 'CANCELLED':
                return 'text-[#fe9e84]';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white">
                    <Gift className="w-4 h-4 mr-2" />
                    查看和兌換我的獎勵
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
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <p className="text-[#00777b] font-medium">
                                                        兌換碼：{reward.code}
                                                    </p>
                                                    <p className="text-[#009f92] text-sm">
                                                        有效期限：
                                                        {new Date(
                                                            reward.coupon.endedDate
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <p
                                                        className={`text-sm ${getStatusColor(reward.status)}`}
                                                    >
                                                        狀態：{getStatusText(reward.status)}
                                                    </p>
                                                </div>
                                                <div className="bg-white p-2 rounded-lg relative">
                                                    <QRCode
                                                        value={reward.code}
                                                        size={100}
                                                        level="H"
                                                        className={`h-24 w-24 ${reward.status !== 'PENDING' ? 'opacity-10' : ''}`}
                                                    />
                                                    {reward.status !== 'PENDING' && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                                                            {reward.status === 'USED' ? (
                                                                <div className="text-center">
                                                                    <Check className="w-8 h-8 text-gray-600 mx-auto mb-1" />
                                                                    <p className="text-xs font-bold text-gray-600">
                                                                        已使用
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center">
                                                                    <XCircle className="w-8 h-8 text-[#fe9e84] mx-auto mb-1" />
                                                                    <p className="text-xs font-bold text-[#fe9e84]">
                                                                        已失效
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
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
