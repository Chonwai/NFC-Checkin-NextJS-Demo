'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import { LoadingCard } from '@/components/LoadingCard';
import CheckinSuccessContent from './CheckinSuccessContent';

export default function CheckinSuccess() {
    return (
        <div className="min-h-screen bg-[#00777b]">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<LoadingCard />}>
                    <CheckinSuccessContent />
                </Suspense>
            </main>
        </div>
    );
}
