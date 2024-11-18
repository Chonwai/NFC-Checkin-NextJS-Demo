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

export default function CheckinSuccess() {
    const router = useRouter();

    return (
        <Card className="w-full max-w-md mx-auto mt-10">
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
            <CardFooter>
                <Button className="w-full" onClick={() => router.push('/my-checkins')}>
                    查看我的打卡記錄
                </Button>
                <Button className="w-full mt-2" onClick={() => router.push('/')}>
                    返回首頁
                </Button>
            </CardFooter>
        </Card>
    );
}
