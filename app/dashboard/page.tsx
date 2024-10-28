'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Beer, Gift } from 'lucide-react';
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

export default function Dashboard() {
    const [checkins, setCheckins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCheckins = async () => {
            try {
                const response = await fetch('/api/checkins');
                if (response.ok) {
                    const data = await response.json();
                    setCheckins(data.checkins);
                }
            } catch (error) {
                console.error('Failed to fetch checkins:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCheckins();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>我的 Cozy Life 2.0 印章</CardTitle>
                        <CardDescription>查看您的打卡記錄和獎勵</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p>加載中...</p>
                        ) : (
                            <>
                                <div className="flex justify-center space-x-2 mb-4">
                                    {[...Array(3)].map((_, i) => (
                                        <Beer
                                            key={i}
                                            className={`w-8 h-8 ${i < checkins.length ? 'text-yellow-500' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-center mb-4">已獲得 {checkins.length} 個印章</p>
                                {checkins.length >= 5 && (
                                    <div className="bg-yellow-100 p-4 rounded-lg text-center mb-4">
                                        <Gift className="inline-block w-6 h-6 text-yellow-500 mb-2" />
                                        <p className="font-semibold">恭喜！您已獲得抽獎資格！</p>
                                    </div>
                                )}
                                <h3 className="font-semibold mb-2">打卡記錄：</h3>
                                <ul className="space-y-2">
                                    {checkins.map((checkin, index) => (
                                        <li key={index} className="bg-white p-2 rounded shadow">
                                            {checkin.barName} -{' '}
                                            {new Date(checkin.timestamp).toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500 text-center w-full">
                            每次打卡可獲得當日酒水9折優惠
                        </p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
