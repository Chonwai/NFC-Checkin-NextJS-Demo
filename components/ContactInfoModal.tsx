'use client';

import { useState, useEffect } from 'react';
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
import { useVerification } from '@/hooks/useVerification';

interface ContactInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityId: string;
    verificationSettings: {
        enabled: boolean;
        methods: ('phone' | 'email')[];
        required: boolean;
        game_id: string | null;
    };
    onSubmit: (contactInfo: { phone?: string; email?: string }) => Promise<{
        success: boolean;
        message: string;
        verification_error?: string;
        verification_sent?: boolean;
    }>;
}

// 正則表達式規則
const PHONE_REGEX = /^[2-9]\d{7}$/; // 手機號碼格式：8位數字，首位不為0或1
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function ContactInfoModal({
    isOpen,
    onClose,
    activityId,
    verificationSettings,
    onSubmit
}: ContactInfoModalProps) {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verificationError, setVerificationError] = useState('');
    const { toast } = useToast();
    const { verifyCode, resendVerification, isLoading: isVerifying } = useVerification(activityId);

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

    const handleVerify = async () => {
        if (!verificationCode) {
            setVerificationError('請輸入驗證碼');
            return;
        }

        try {
            // 根據用戶輸入的內容決定驗證類型
            const verificationType = phone ? 'phone' : 'email';
            const result = await verifyCode(verificationCode, verificationType);

            if (!result.success) {
                const errorMessage =
                    typeof result.error?.message === 'string' ? result.error.message : '驗證碼錯誤';
                throw new Error(errorMessage);
            }

            toast({ title: '驗證成功', description: '聯絡資料已確認' });
            onClose();
        } catch (error: any) {
            setVerificationError(error.message);
            toast({
                title: '驗證失敗',
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    const handleResend = async () => {
        try {
            // 根據用戶輸入的內容決定驗證類型
            const verificationType = phone ? 'phone' : 'email';
            const result = await resendVerification(verificationType);

            if (result.data?.verification_sent === false) {
                throw new Error(result.data?.message || '驗證碼發送失敗');
            }
            setCountdown(60);
            toast({ title: '已重新發送驗證碼' });
        } catch (error: any) {
            toast({
                title: '發送失敗',
                description: error.message || '請稍後再試',
                variant: 'destructive'
            });
        }
    };

    const handleSubmit = async () => {
        // 重置錯誤信息
        setPhoneError('');
        setEmailError('');

        // 驗證輸入
        const isPhoneValid = phone ? validatePhone(phone) : true;
        const isEmailValid = email ? validateEmail(email) : true;

        // 根據 verification_settings 檢查輸入的聯絡方式是否符合要求
        if (verificationSettings.enabled) {
            const hasValidContactMethod = verificationSettings.methods.some((method) => {
                if (method === 'phone') return !!phone;
                if (method === 'email') return !!email;
                return false;
            });

            if (!hasValidContactMethod) {
                toast({
                    title: '請填寫資料',
                    description: `請提供${verificationSettings.methods.includes('phone') ? '手機號碼' : ''}${
                        verificationSettings.methods.includes('phone') &&
                        verificationSettings.methods.includes('email')
                            ? '或'
                            : ''
                    }${verificationSettings.methods.includes('email') ? '電子郵件' : ''}`,
                    variant: 'destructive'
                });
                return;
            }
        } else if (!phone && !email) {
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
            const result = await onSubmit({ phone, email });

            if (!result.success) {
                toast({
                    title: '提交失敗',
                    description: result.message,
                    variant: 'destructive'
                });
                return;
            }

            if (verificationSettings.enabled) {
                setShowVerification(true);
                setCountdown(60);
                toast({ title: '驗證碼已發送', description: result.message });
            } else {
                toast({ title: '提交成功', description: result.message });
                onClose();
            }
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

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#f7e7be]">
                <DialogHeader>
                    <DialogTitle className="text-[#00777b]">
                        {showVerification ? '請輸入驗證碼' : '請留下您的聯絡方式'}
                    </DialogTitle>
                    <DialogDescription className="text-[#009f92]">
                        為了讓您收到活動獎勵通知，以及保存您的集點記錄，請填寫您的聯絡方式
                    </DialogDescription>
                </DialogHeader>

                {showVerification ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-[#00777b]">驗證碼</label>
                            <Input
                                type="text"
                                placeholder="請輸入6位數驗證碼"
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value);
                                    setVerificationError('');
                                }}
                                className={`bg-white ${verificationError ? 'border-red-500' : ''}`}
                            />
                            {verificationError && (
                                <p className="text-sm text-red-500 mt-1">{verificationError}</p>
                            )}
                            <div className="space-y-1 mt-2">
                                <p className="text-sm text-[#009f92]">
                                    {countdown > 0
                                        ? `${countdown}秒後可重新發送`
                                        : '未收到驗證碼？'}
                                </p>
                                <p className="text-xs text-[#666666]">• 驗證碼將於10分鐘後失效</p>
                                <p className="text-xs text-[#666666]">
                                    • 請確認是否收到來自系統的驗證訊息
                                </p>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                            onClick={handleVerify}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '驗證中...' : '確認驗證碼'}
                        </Button>
                        {countdown === 0 && (
                            <Button
                                variant="outline"
                                className="w-full text-[#009f92] border-[#009f92]"
                                onClick={handleResend}
                            >
                                重新發送驗證碼
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 只在 methods 包含 phone 時顯示手機輸入 */}
                        {verificationSettings.methods.includes('phone') && (
                            <div>
                                <label className="text-sm text-[#00777b]">手機號碼</label>
                                <Input
                                    type="tel"
                                    placeholder="請輸入8位數字的手機號碼"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className={`bg-white ${phoneError ? 'border-red-500' : ''}`}
                                />
                                {phoneError && (
                                    <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                                )}
                            </div>
                        )}

                        {/* 只在 methods 包含 email 時顯示郵件輸入 */}
                        {verificationSettings.methods.includes('email') && (
                            <div>
                                <label className="text-sm text-[#00777b]">電子郵件</label>
                                <Input
                                    type="email"
                                    placeholder="請輸入有效的電子郵件地址"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`bg-white ${emailError ? 'border-red-500' : ''}`}
                                />
                                {emailError && (
                                    <p className="text-sm text-red-500 mt-1">{emailError}</p>
                                )}
                            </div>
                        )}

                        <Button
                            className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !!phoneError || !!emailError}
                        >
                            {isSubmitting ? '提交中...' : '提交'}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
