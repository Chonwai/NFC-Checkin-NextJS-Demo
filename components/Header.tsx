import { ArrowLeft, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    // 根據路徑決定標題
    const getTitle = () => {
        const paths: { [key: string]: string } = {
            '/': '集點冒險',
            '/my-checkins': '打卡記錄',
            '/checkin': '活動打卡',
            '/checkin_success': '打卡成功',
            '/checkin_error': '打卡失敗'
        };

        return paths[pathname] || '集點冒險';
    };

    return (
        <header className="relative bg-gradient-to-b from-[#00777b] to-transparent py-4 px-4">
            <div className="container mx-auto max-w-md">
                <div className="flex items-center justify-between">
                    {pathname !== '/' && (
                        <button
                            onClick={() => router.back()}
                            className="left-4 p-2 rounded-full bg-white/10 backdrop-blur-sm 
                                     hover:bg-white/20 transition-all duration-200 active:scale-95 transform transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#f7e7be]" />
                        </button>
                    )}

                    {/* 標題 */}
                    <div className="flex-1 text-center">
                        <motion.h1
                            key={getTitle()}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="font-rubik text-xl text-[#f7e7be] relative"
                        >
                            {getTitle()}
                            <div
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                                          w-12 h-0.5 bg-gradient-to-r from-transparent via-[#fe9e84] to-transparent"
                            />
                        </motion.h1>
                    </div>

                    {/* 首頁按鈕 */}
                    {pathname !== '/' && (
                        <Link href="/">
                            <div
                                className="right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm 
                                          hover:bg-white/20 transition-all duration-200 active:scale-95 transform transition-all duration-200"
                            >
                                <Home className="w-5 h-5 text-[#f7e7be]" />
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
