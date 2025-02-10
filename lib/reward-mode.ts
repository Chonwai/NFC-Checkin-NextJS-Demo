export const getRewardModeColor = (mode: string) => {
    switch (mode) {
        case 'full':
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                hover: 'hover:bg-blue-100'
            };
        case 'partial':
            return {
                bg: 'bg-green-100',
                text: 'text-green-800',
                hover: 'hover:bg-green-100'
            };
        case 'two_tier':
            return {
                bg: 'bg-purple-100',
                text: 'text-purple-800',
                hover: 'hover:bg-purple-100'
            };
        case 'multi-tier':
            return {
                bg: 'bg-orange-100',
                text: 'text-orange-800',
                hover: 'hover:bg-orange-100'
            };
        default:
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                hover: 'hover:bg-gray-100'
            };
    }
};
