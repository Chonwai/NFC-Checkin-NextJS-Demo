import AdminHeader from '@/components/AdminHeader';
import {
    LayoutDashboard,
    Calendar,
    MapPin,
    CheckSquare,
    Users,
    Settings,
    BarChart,
    FileText
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const menuItems = [
        {
            title: '概覽',
            items: [
                { name: '儀表板', icon: <LayoutDashboard className="w-4 h-4" />, href: '/admin' },
                {
                    name: '數據分析',
                    icon: <BarChart className="w-4 h-4" />,
                    href: '/admin/analytics'
                }
            ]
        },
        {
            title: '內容管理',
            items: [
                {
                    name: '活動管理',
                    icon: <Calendar className="w-4 h-4" />,
                    href: '/admin/activities'
                },
                {
                    name: '地點管理',
                    icon: <MapPin className="w-4 h-4" />,
                    href: '/admin/locations'
                },
                {
                    name: '打卡記錄',
                    icon: <CheckSquare className="w-4 h-4" />,
                    href: '/admin/checkins'
                }
            ]
        },
        {
            title: '用戶管理',
            items: [
                { name: '用戶列表', icon: <Users className="w-4 h-4" />, href: '/admin/users' },
                {
                    name: '權限設置',
                    icon: <Settings className="w-4 h-4" />,
                    href: '/admin/permissions'
                }
            ]
        },
        {
            title: '系統',
            items: [
                {
                    name: '系統設置',
                    icon: <Settings className="w-4 h-4" />,
                    href: '/admin/settings'
                },
                { name: '操作日誌', icon: <FileText className="w-4 h-4" />, href: '/admin/logs' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="flex">
                <aside className="w-64 bg-white min-h-screen shadow-sm">
                    <nav className="p-4">
                        {menuItems.map((section) => (
                            <div key={section.title} className="mb-6">
                                <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                    {section.title}
                                </h2>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="flex items-center text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg px-3 py-2 transition-colors"
                                            >
                                                {item.icon}
                                                <span className="ml-3 text-sm">{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
