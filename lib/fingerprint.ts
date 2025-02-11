'use client';

export async function getDeviceId(): Promise<string> {
    if (typeof window === 'undefined') return '';

    // 1. 檢查現有 device_id
    let deviceId = localStorage.getItem('device_id');
    if (deviceId) return deviceId;

    // 2. 生成新的 UUID
    deviceId = crypto.randomUUID();
    localStorage.setItem('device_id', deviceId);

    return deviceId;
}
