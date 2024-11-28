import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !isValidAuthHeader(authHeader)) {
            return new NextResponse(null, {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Admin Area"'
                }
            });
        }
    }

    return NextResponse.next();
}

function isValidAuthHeader(authHeader: string) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export const config = {
    matcher: '/admin/:path*'
};
