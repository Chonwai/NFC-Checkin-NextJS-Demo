import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeModal } from './QRCodeModal';
import { useToast } from '@/hooks/use-toast';

interface LocationQRCodeProps {
    activityId: string;
    location: {
        id: string;
        name: string;
    };
}

export function LocationQRCode({ activityId, location }: LocationQRCodeProps) {
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const { toast } = useToast();
    const url = `${window.location.origin}/checkin_verify?activity_id=${activityId}&location_id=${location.id}`;

    return (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
            <span className="text-sm">{location.name}</span>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        navigator.clipboard.writeText(url);
                        toast({
                            title: '已複製連結',
                            description: '已將連結複製到剪貼簿',
                            duration: 3000
                        });
                    }}
                >
                    複製連結
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsQRModalOpen(true)}>
                    顯示 QR Code
                </Button>
            </div>
            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                url={url}
                locationName={location.name}
            />
        </div>
    );
}
