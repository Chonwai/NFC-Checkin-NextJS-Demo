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

// 正則表達式規則
const PHONE_REGEX = /^[2-9]\d{7}$/; // 手機號碼格式：8位數字，首位不為0或1
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function ContactInfoModal({ isOpen, onClose, onSubmit }: ContactInfoModalProps) {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const validatePhone = (value: string) => {
        if (value && !PHONE_REGEX.test(value)) {
            setPhoneError('請輸入有效的手機號碼（8位數字）');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const validateEmail = (value: string) => {
        if (value && !EMAIL_REGEX.test(value)) {
            setEmailError('請輸入有效的電子郵件地址');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
        if (value) validatePhone(value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (value) validateEmail(value);
    };

    const handleSubmit = async () => {
        // 重置錯誤信息
        setPhoneError('');
        setEmailError('');

        // 驗證輸入
        const isPhoneValid = phone ? validatePhone(phone) : true;
        const isEmailValid = email ? validateEmail(email) : true;

        if (!phone && !email) {
            toast({
                title: '請填寫資料',
                description: '請至少提供一種聯絡方式',
                variant: 'destructive'
            });
            return;
        }

        if (!isPhoneValid || !isEmailValid) {
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
                            placeholder="請輸入8位數字的手機號碼"
                            value={phone}
                            onChange={handlePhoneChange}
                            className={`bg-white ${phoneError ? 'border-red-500' : ''}`}
                        />
                        {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
                    </div>
                    <div>
                        <label className="text-sm text-[#00777b]">電子郵件</label>
                        <Input
                            type="email"
                            placeholder="請輸入有效的電子郵件地址"
                            value={email}
                            onChange={handleEmailChange}
                            className={`bg-white ${emailError ? 'border-red-500' : ''}`}
                        />
                        {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                    </div>
                    <Button
                        className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !!phoneError || !!emailError}
                    >
                        {isSubmitting ? '提交中...' : '提交'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
