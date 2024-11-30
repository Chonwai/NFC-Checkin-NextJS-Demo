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
import { XCircle, AlertTriangle } from 'lucide-react';

export default function CheckinErrorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get('message') || '您的打卡請求無法完成。';

    return (
        <Card className="w-full max-w-md mx-auto bg-[#f7e7be] border-none">
            <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#fe9e84]/20 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="w-8 h-8 text-[#fe9e84]" />
                </div>
                <CardTitle className="text-2xl font-rubik text-[#00777b]">打卡失敗</CardTitle>
                <CardDescription className="text-[#009f92]">
                    很抱歉，您的打卡請求未能完成
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center space-y-4">
                    <div className="bg-white rounded-xl p-6">
                        <AlertTriangle className="w-8 h-8 text-[#fe9e84] mx-auto mb-2" />
                        <p className="text-[#fe9e84] font-medium">{errorMessage}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <Button
                    className="w-full bg-[#009f92] hover:bg-[#009f92]/90 text-white"
                    onClick={() => router.push('/my-checkins')}
                >
                    查看我的集點進度
                </Button>
                <Button
                    className="w-full bg-[#fe9e84] hover:bg-[#fe9e84]/90 text-white"
                    onClick={() => router.push('/')}
                >
                    返回首頁
                </Button>
            </CardFooter>
        </Card>
    );
}
