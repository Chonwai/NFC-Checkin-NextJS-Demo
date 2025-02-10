import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    locationName: string;
}

export function QRCodeModal({ isOpen, onClose, url, locationName }: QRCodeModalProps) {
    const handleDownload = async () => {
        const qrCodeElement = document.getElementById('qr-code');
        if (qrCodeElement) {
            const dataUrl = await htmlToImage.toPng(qrCodeElement);
            const link = document.createElement('a');
            link.download = `${locationName}-QRCode.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>NFC 打卡 QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                    <div
                        id="qr-code"
                        className="bg-white p-4 rounded-lg"
                        style={{ width: 'fit-content' }}
                    >
                        <QRCodeSVG value={url} size={256} level="H" />
                    </div>
                    <p className="text-sm text-muted-foreground break-all px-4">{url}</p>
                    <Button onClick={handleDownload} variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        下載 QR Code
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
