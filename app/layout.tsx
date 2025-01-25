import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Metrics from './metrics';
import { Providers } from './providers';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

export const metadata: Metadata = {
    title: 'Travel3 - 集點活動',
    description: 'Travel3 - 集點活動'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-TW">
            <head>
                <Metrics />
            </head>
            <body>
                <Providers>
                    {children}
                    <Toaster duration={3000} />
                </Providers>
            </body>
        </html>
    );
}
