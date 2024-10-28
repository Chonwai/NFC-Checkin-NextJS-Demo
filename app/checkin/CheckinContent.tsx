// app/checkin/CheckinContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

import { getBar } from '@/lib/bars';
import { addCheckin, Checkin } from '@/lib/storage'; // 添加此行

export default function CheckinContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [error, setError] = useState('');

    const barId = searchParams.get('bar_id');
    const bar = barId ? getBar(barId) : null;

    useEffect(() => {
        if (!bar) {
            setError('無效的 NFC 標籤數據');
        }
    }, [bar]);

    const handleCheckin = async () => {
        if (!bar) return;

        try {
            const response = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barId: bar.id, barName: bar.name })
            });

            if (response.ok) {
                const data = await response.json();
                const newCheckin: Checkin = data.checkin;
                addCheckin(newCheckin); // 將打卡數據保存至 localStorage
                setIsCheckedIn(true);
            } else {
                setError('打卡失敗，請稍後再試');
            }
        } catch (err) {
            console.error(err);
            setError('發生錯誤，請稍後再試');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Cozy Life 2.0 打卡</CardTitle>
                <CardDescription>{bar ? `在 ${bar.name} 打卡` : '打卡地點'}</CardDescription>
            </CardHeader>
            <CardContent>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : isCheckedIn ? (
                    <div className="text-center">
                        <p className="text-2xl mb-2">✅</p>
                        <p className="text-xl font-semibold">打卡成功！</p>
                        <p className="mt-2">您已獲得一個新印章和今日酒水9折優惠。</p>
                    </div>
                ) : (
                    <p>準備在 {bar?.name} 打卡嗎？點擊下方按鈕確認。</p>
                )}
            </CardContent>
            <CardFooter>
                {!isCheckedIn && !error && (
                    <Button className="w-full" onClick={handleCheckin}>
                        確認打卡
                    </Button>
                )}
                {(isCheckedIn || error) && (
                    <Button className="w-full" onClick={() => router.push('/dashboard')}>
                        查看我的印章
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
