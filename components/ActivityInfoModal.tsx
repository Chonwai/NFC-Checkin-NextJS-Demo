import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Info, Calendar, MapPin, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityInfoModalProps {
    activity: any;
    children?: React.ReactNode;
}

export function ActivityInfoModal({ activity, children }: ActivityInfoModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full bg-[#f7e7be] text-[#00777b] hover:bg-[#fe9e84]/10"
                >
                    <Info className="w-4 h-4 mr-2" />
                    活動詳情
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#f7e7be] border-none max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[#00777b] font-rubik text-xl">
                        {activity.name} - 活動資訊
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                        <h3 className="font-rubik text-[#00777b] mb-2">活動說明</h3>
                        <p className="text-[#009f92]">{activity.description}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <h3 className="font-rubik text-[#00777b] mb-2">活動期間</h3>
                        <div className="flex items-center text-[#009f92]">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                                {new Date(activity.start_date).toLocaleDateString()} -
                                {new Date(activity.end_date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <h3 className="font-rubik text-[#00777b] mb-2">參與方式</h3>
                        <ul className="space-y-2 text-[#009f92]">
                            <li className="flex items-start">
                                <MapPin className="w-4 h-4 mr-2 mt-1" />
                                <span>到訪指定地點並完成打卡</span>
                            </li>
                            <li className="flex items-start">
                                <Gift className="w-4 h-4 mr-2 mt-1" />
                                <span>集滿 {activity.check_in_limit} 個印章即可獲得特別獎勵</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <h3 className="font-rubik text-[#00777b] mb-2">注意事項</h3>
                        <ul className="list-disc list-inside text-[#009f92] text-sm space-y-1">
                            <li>打卡需在活動期間內完成</li>
                            <li>獎勵需在活動結束前領取</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
