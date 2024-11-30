import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';

interface CheckinHistoryModalProps {
    checkins: any[];
}

export function CheckinHistoryModal({ checkins }: CheckinHistoryModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full mt-4 text-[#009f92] border-[#009f92] hover:bg-[#009f92]/10"
                >
                    查看打卡記錄
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-[#00777b]">打卡記錄</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {checkins.map((checkin) => (
                        <div key={checkin.id} className="p-4 bg-[#f7e7be]/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-[#009f92]" />
                                <span className="text-[#00777b] font-medium">
                                    {checkin.location.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#009f92]">
                                <Clock className="w-4 h-4" />
                                {new Date(checkin.checkin_time).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
