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

export default function CheckinSuccess() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>打卡成功！</CardTitle>
                        <CardDescription>感謝您的參與。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-2xl mb-2">✅</p>
                            <p className="text-xl font-semibold">您的打卡已成功記錄。</p>
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
