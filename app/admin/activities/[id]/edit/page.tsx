'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { LoadingCard } from '@/components/LoadingCard';
import EditActivityContent from './EditActivityContent';

export default function EditActivity({ params }: { params: Promise<{ id: string }> }) {
    const [activityId, setActivityId] = useState<string | null>(null);

    useEffect(() => {
        params.then(({ id }) => setActivityId(id));
    }, [params]);

    return (
        <div className="min-h-screen">
            <main className="container mx-auto">
                <Suspense fallback={<LoadingCard />}>
                    {activityId && <EditActivityContent activityId={activityId} />}
                </Suspense>
            </main>
        </div>
    );
}
