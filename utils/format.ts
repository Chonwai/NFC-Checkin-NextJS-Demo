export function formatUUID(uuid: string): string {
    return uuid.split('-')[0]; // 只取第一組，例如："ee1ba9d2"
}
