import Link from 'next/link';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function AdminHeader() {
    return (
        <header className="bg-white border-b h-16">
            <div className="container mx-auto px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin" className="font-bold text-xl">
                            管理後台
                        </Link>
                        <div className="hidden md:flex items-center space-x-2">
                            <Input type="search" placeholder="搜尋..." className="w-64" />
                            <Button variant="ghost" size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                                <User className="h-4 w-4" />
                            </Button>
                            <span className="hidden md:inline">管理員</span>
                        </div>
                        <div className="h-6 w-px bg-gray-200" />
                        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                            返回前台
                        </Link>
                        <Button variant="ghost" size="icon">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
