import { NextResponse } from 'next/server';

// This would be replaced with a database in a real application
const checkins: any = [];

export async function POST(request: Request) {
    const { barId, barName } = await request.json();

    if (!barId || !barName) {
        return NextResponse.json({ error: 'Invalid check-in data' }, { status: 400 });
    }

    const newCheckin = {
        barId,
        barName,
        timestamp: new Date().toISOString()
    };

    checkins.push(newCheckin);

    return NextResponse.json({ message: 'Check-in successful', checkin: newCheckin });
}

export async function GET() {
    return NextResponse.json({ checkins });
}
