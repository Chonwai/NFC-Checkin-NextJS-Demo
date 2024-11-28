'use client';

import { useLocation } from '@/hooks/admin/useLocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LocationDetails({ params }: { params: Promise<{ id: string }> }) {
    const [locationId, setLocationId] = useState<string | null>(null);
    const { location, isLoading, error } = useLocation(locationId);

    useEffect(() => {
        params.then(({ id }) => setLocationId(id));
    }, [params]);

    if (!locationId || isLoading) {
        return <div>載入中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!location) {
        return <div>找不到地點</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{location.name}</h1>
                <Link href={`/admin/locations/${location.id}/edit`}>
                    <Button variant="outline">
                        <Pencil className="h-4 w-4 mr-2" />
                        編輯地點
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>地點資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">描述</h3>
                        <p className="text-muted-foreground">{location.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{location.address}</span>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">所屬活動</h3>
                        <Link
                            href={`/admin/activities/${location.activity_id}`}
                            className="text-primary hover:underline"
                        >
                            查看活動詳情
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
