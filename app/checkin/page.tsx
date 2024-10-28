'use client';

import React, { Suspense } from 'react';
import Header from '../components/Header';
import CheckinContent from './CheckinContent';

export default function Checkin() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <CheckinContent />
                </Suspense>
            </main>
        </div>
    );
}
