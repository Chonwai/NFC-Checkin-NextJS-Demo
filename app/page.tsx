'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import Header from '../components/Header';
import { useActivities } from '@/hooks/useActivities';

export default function Home() {
    const { activities, isLoading, error } = useActivities();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>活動列表</CardTitle>
                        <CardDescription>以下是目前進行中的活動：</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p>載入中...</p>
                        ) : error ? (
                            <p className="text-red-500">發生錯誤：{error}</p>
                        ) : (
                            <ul className="space-y-2">
                                {activities.map((activity) => (
                                    <li key={activity.id} className="bg-white p-4 rounded shadow">
                                        <Link href={`/activities/${activity.id}`} legacyBehavior>
                                            <a className="block cursor-pointer hover:bg-gray-50 transition">
                                                <h3 className="font-semibold">{activity.name}</h3>
                                                <p>{activity.description}</p>
                                            </a>
                                        </Link>
                                        {/* 可以根據需求添加更多活動相關資訊 */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Link href="/my-checkins" className="w-full">
                            <Button className="w-full">查看我的打卡記錄</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
