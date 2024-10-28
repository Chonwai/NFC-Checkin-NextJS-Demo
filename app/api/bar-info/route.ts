import { NextResponse } from 'next/server';

// 這裡應該是從數據庫中獲取酒吧信息
// 這只是一個模擬的數據
const bars: any = {
    '1': { id: '1', name: 'Cozy Bar' },
    '2': { id: '2', name: 'Happy Hour Pub' },
    '3': { id: '3', name: 'Nightowl Lounge' }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !bars[id]) {
        return NextResponse.json({ error: 'Bar not found' }, { status: 404 });
    }

    return NextResponse.json(bars[id]);
}
