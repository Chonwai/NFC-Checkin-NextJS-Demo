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
                            {activity.participation_info?.requirements.map(
                                (requirement: any, index: number) => (
                                    <li key={index} className="flex items-start">
                                        {requirement.type === 'location' ? (
                                            <MapPin className="w-4 h-4 mr-2 mt-1" />
                                        ) : (
                                            <Gift className="w-4 h-4 mr-2 mt-1" />
                                        )}
                                        <span>{requirement.description}</span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                        <h3 className="font-rubik text-[#00777b] mb-2">注意事項</h3>
                        <ul className="list-disc list-inside text-[#009f92] space-y-1">
                            {activity.participation_info?.notices.map(
                                (notice: any, index: number) => <li key={index}>{notice}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
