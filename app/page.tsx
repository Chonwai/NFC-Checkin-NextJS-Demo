import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import Header from './components/Header';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>歡迎參加 Cozy Life 2.0 NFC 打卡活動！</CardTitle>
                        <CardDescription>在不同酒吧打卡，收集印章並贏取獎品！</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">活動流程：</p>
                        <ol className="list-decimal list-inside space-y-2 mb-4">
                            <li>訪問參與的酒吧</li>
                            <li>將手機靠近 NFC 標籤</li>
                            <li>確認打卡並獲得印章</li>
                            <li>收集足夠印章即可參與抽獎</li>
                        </ol>
                        <p>每次打卡還可獲得當日酒水9折優惠！</p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard" className="w-full">
                            <Button className="w-full">查看我的印章</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
