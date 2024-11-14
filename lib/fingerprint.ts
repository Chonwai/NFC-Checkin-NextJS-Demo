'use client';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

// 初始化 FingerprintJS
export async function getDeviceId(): Promise<string> {
    if (typeof window === 'undefined') return '';

    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceId = result.visitorId;
        localStorage.setItem('device_id', deviceId);
    }
    console.log('deviceId: ', deviceId);
    return deviceId;
}
