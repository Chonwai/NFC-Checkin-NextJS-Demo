'use client';

import { useAdminLocations } from '@/hooks/admin/useAdminLocations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin, Building, Calendar, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function AdminLocations() {
    const { locations, isLoading, error } = useAdminLocations();

    if (isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">地點管理</h1>
                <Link href="/admin/locations/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        建立新地點
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {locations.map((location) => (
                    <Card key={location.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="w-full flex justify-between items-center">
                                <div className="w-1/2">
                                    <CardTitle className="text-xl">
                                        <Link
                                            href={`/admin/locations/${location.id}`}
                                            className="hover:underline"
                                        >
                                            {location.name}
                                        </Link>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {location.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/locations/${location.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4 mr-1" />
                                            編輯
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{location.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        建立時間：
                                        {new Date(location.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
