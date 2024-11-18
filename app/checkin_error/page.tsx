'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>打卡失敗</CardTitle>
                        <CardDescription>請稍後再試或聯繫管理員。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-500">您的打卡請求無法完成。</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => router.push('/')}>
                            返回首頁
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
