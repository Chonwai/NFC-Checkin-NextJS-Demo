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
import { Gift } from 'lucide-react';

export default function Home() {
    const { activities, isLoading, error } = useActivities();

    return (
        <div className="min-h-screen bg-[#00777b]">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-[#f7e7be] mb-2 font-rubik">
                            集點冒險
                        </h1>
                        <p className="text-[#fe9e84]">開始你的打卡之旅！</p>
                    </div>

                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-32 bg-[#009f92] rounded-xl opacity-50" />
                            ))}
                        </div>
                    ) : error ? (
                        <Card className="border-[#fe9e84] bg-[#f7e7be]">
                            <CardContent className="text-[#fe9e84] p-4">{error}</CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {activities.map((activity) => (
                                <Link key={activity.id} href={`/activities/${activity.id}`}>
                                    <div className="group relative overflow-hidden rounded-xl bg-[#f7e7be] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#009f92] to-[#00777b] opacity-0 group-hover:opacity-10 transition-opacity" />
                                        <div className="p-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-bold text-[#00777b] font-rubik">
                                                    {activity.name}
                                                </h3>
                                                <div className="bg-[#009f92] text-[#f7e7be] px-3 py-1 rounded-full text-sm">
                                                    進行中
                                                </div>
                                            </div>
                                            <p className="mt-2 text-[#00777b]">
                                                {activity.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <Link href="/my-checkins">
                            <Button className="bg-[#fe9e84] hover:bg-[#fe9e84]/90 text-[#f7e7be] px-8 py-3 rounded-full text-lg font-semibold transform hover:scale-105 transition-all font-rubik">
                                <Gift className="w-5 h-5 mr-2" />
                                查看我的集點記錄
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
