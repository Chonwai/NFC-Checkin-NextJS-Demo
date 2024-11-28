'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import { LoadingCard } from '@/components/LoadingCard';
import CheckinErrorContent from './CheckinErrorContent';

export default function CheckinError() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<LoadingCard />}>
                    <CheckinErrorContent />
                </Suspense>
            </main>
        </div>
    );
}
