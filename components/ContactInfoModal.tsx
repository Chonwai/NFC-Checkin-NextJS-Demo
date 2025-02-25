'use client';

import React, { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { COUNTRY_PHONE_CODES, getCountryByCode } from '@/utils/countryPhoneCodes';

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
    onSubmit: (contactInfo: {
        phone?: string;
        phone_country_code?: string;
        email?: string;
    }) => Promise<{
        success: boolean;
        message: string;
    }>;
}

// 電子郵件驗證正則表達式
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function ContactInfoModal({
    isOpen,
    onClose,
    activityId,
    verificationSettings,
    onSubmit
}: ContactInfoModalProps) {
    // 基本狀態管理
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verificationError, setVerificationError] = useState('');

    // 新增國家/地區代碼狀態
    const [selectedCountryCode, setSelectedCountryCode] = useState('MO'); // 默認澳門
    const selectedCountry = getCountryByCode(selectedCountryCode);

    const { toast } = useToast();
    const { verifyCode, resendVerification, isLoading: isVerifying } = useVerification(activityId);

    // 倒計時效果
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // 處理國家/地區選擇變更
    const handleCountryChange = (value: string) => {
        setSelectedCountryCode(value); // 更新選擇的國家/地區代碼
        setPhoneError(''); // 清空電話錯誤信息
        setPhone(''); // 清空電話號碼
    };

    // 處理電話號碼輸入變更
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
        validatePhone(value); // 每次輸入時都進行驗證
    };

    // 驗證電話號碼
    const validatePhone = (value: string) => {
        if (!value) return true;

        const country = getCountryByCode(selectedCountryCode);
        if (!country.pattern.test(value)) {
            setPhoneError(`請輸入有效的${country.name}手機號碼（${country.digitLength}位數字）`);
            return false;
        }
        setPhoneError(''); // 清除錯誤信息
        return true;
    };

    // 驗證電子郵件地址
    const validateEmail = (value: string) => {
        if (value && !EMAIL_REGEX.test(value)) {
            setEmailError('請輸入有效的電子郵件地址');
            return false;
        }
        setEmailError('');
        return true;
    };

    // 處理電子郵件輸入變更
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (value) validateEmail(value);
    };

    // 處理驗證碼驗證
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

    // 處理重新發送驗證碼
    const handleResend = async () => {
        try {
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

    // 處理返回聯絡資料輸入頁面
    const handleBackToContact = () => {
        setVerificationCode('');
        setVerificationError('');
        setShowVerification(false);
        setCountdown(0);
    };

    // 處理聯絡資料提交
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
            // 提交時包含國家/地區電話代碼
            const result = await onSubmit({
                phone: phone || undefined,
                phone_country_code: selectedCountry.phoneCode,
                email: email || undefined
            });

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
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className={`bg-white ${verificationError ? 'border-red-500' : ''}`}
                            />
                            {verificationError && (
                                <p className="text-sm text-red-500 mt-1">{verificationError}</p>
                            )}
                        </div>

                        <div className="flex flex-col justify-between items-start">
                            <p
                                className={`text-sm ${
                                    countdown > 0
                                        ? 'text-gray-500'
                                        : 'text-[#00777b] cursor-pointer'
                                }`}
                                onClick={countdown === 0 ? handleResend : undefined}
                            >
                                {countdown > 0 ? `${countdown}秒後可重新發送` : '未收到驗證碼？'}
                            </p>
                            <p className="text-xs text-[#666666]">• 驗證碼將於10分鐘後失效</p>
                            <p className="text-xs text-[#666666]">
                                • 請確認是否收到來自系統的驗證訊息
                            </p>
                        </div>

                        {/* 驗證碼確認按鈕 */}
                        <Button
                            className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                            onClick={handleVerify}
                            disabled={isVerifying}
                        >
                            {isVerifying ? '驗證中...' : '確認驗證碼'}
                        </Button>

                        {/* 返回按鈕 */}
                        <Button
                            variant="outline"
                            className="w-full border-[#009f92] text-[#009f92]"
                            onClick={handleBackToContact}
                        >
                            返回修改聯絡方式
                        </Button>

                        {/* 重新發送按鈕 */}
                        {countdown === 0 && (
                            <Button
                                variant="outline"
                                className="w-full text-[#009f92] border-[#009f92]"
                                onClick={handleResend}
                                disabled={isVerifying}
                            >
                                重新發送驗證碼
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 顯示手機輸入區塊 */}
                        {(verificationSettings.methods.includes('phone') ||
                            !verificationSettings.enabled ||
                            verificationSettings.methods.length === 0) && (
                            <div className="space-y-3">
                                <label className="text-sm text-[#00777b]">手機號碼</label>

                                {/* 國家/地區選擇下拉菜單 */}
                                <div className="flex gap-2">
                                    <div className="w-1/3">
                                        <Select
                                            value={selectedCountryCode}
                                            onValueChange={handleCountryChange}
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="選擇地區" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COUNTRY_PHONE_CODES.map((country) => (
                                                    <SelectItem
                                                        key={country.code}
                                                        value={country.code}
                                                    >
                                                        {country.name} (+{country.phoneCode})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* 電話號碼輸入框 */}
                                    <div className="w-2/3">
                                        <Input
                                            type="tel"
                                            placeholder={`請輸入${selectedCountry.digitLength}位數字`}
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            className={`bg-white ${phoneError ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                </div>

                                {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
                            </div>
                        )}

                        {/* 顯示電子郵件輸入區塊 */}
                        {(verificationSettings.methods.includes('email') ||
                            !verificationSettings.enabled ||
                            verificationSettings.methods.length === 0) && (
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

                        {/* 提交按鈕 */}
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
