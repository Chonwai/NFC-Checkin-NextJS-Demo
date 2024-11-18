'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

export default function CheckinError() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get('message') || '您的打卡請求無法完成。';

    const isLimitError = errorMessage.includes('已達到打卡次數上限');

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-red-600">打卡失敗</CardTitle>
                        <CardDescription>請稍後再試或聯繫管理員。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-3xl mb-4">❌</p>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-red-600 font-medium">{errorMessage}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" onClick={() => router.push('/my-checkins')}>
                            查看我的打卡記錄
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push('/')}
                        >
                            返回首頁
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
