'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { LoadingCard } from '@/components/LoadingCard';
import EditLocationContent from './EditLocationContent';

export default function EditLocation({ params }: { params: Promise<{ id: string }> }) {
    const [locationId, setLocationId] = useState<string | null>(null);

    useEffect(() => {
        params.then(({ id }) => setLocationId(id));
    }, [params]);

    if (!locationId) {
        return <LoadingCard />;
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<LoadingCard />}>
                    <EditLocationContent locationId={locationId} />
                </Suspense>
            </main>
        </div>
    );
}
