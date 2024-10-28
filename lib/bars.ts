export const bars = [
    { id: '1', name: 'Cozy Bar' },
    { id: '2', name: 'Happy Hour Pub' },
    { id: '3', name: 'Nightowl Lounge' }
];

export function getBar(id: string) {
    return bars.find((bar) => bar.id === id);
}
