'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ContactInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (contactInfo: { phone?: string; email?: string }) => Promise<void>;
}

export function ContactInfoModal({ isOpen, onClose, onSubmit }: ContactInfoModalProps) {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!phone && !email) {
            toast({
                title: '請填寫資料',
                description: '請至少提供一種聯絡方式',
                variant: 'destructive'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({ phone, email });
            toast({
                title: '提交成功',
                description: '感謝您提供聯絡資料'
            });
            onClose();
        } catch (error) {
            toast({
                title: '提交失敗',
                description: '請稍後再試',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#f7e7be]">
                <DialogHeader>
                    <DialogTitle className="text-[#00777b]">請留下您的聯絡方式</DialogTitle>
                    <DialogDescription className="text-[#009f92]">
                        為了讓您收到活動獎勵通知，請至少填寫一項聯絡方式
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-[#00777b]">手機號碼</label>
                        <Input
                            type="tel"
                            placeholder="請輸入手機號碼"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-[#00777b]">電子郵件</label>
                        <Input
                            type="email"
                            placeholder="請輸入電子郵件"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                    <Button
                        className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '提交中...' : '提交'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
