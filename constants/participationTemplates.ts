export const PARTICIPATION_TEMPLATES = [
    {
        name: '基本模板',
        requirements: [
            {
                type: 'location' as const,
                count: 1,
                description: '到訪指定地點並完成打卡'
            },
            {
                type: 'reward' as const,
                count: 1,
                description: '集滿印章即可獲得特別獎勵'
            }
        ],
        notices: ['打卡需在活動期間內完成', '獎勵需在活動結束前領取']
    },
    {
        name: '多地點模板',
        requirements: [
            {
                type: 'location' as const,
                count: 3,
                description: '到訪三個不同地點並完成打卡'
            },
            {
                type: 'reward' as const,
                count: 3,
                description: '集滿三個不同印章即可獲得特別獎勵'
            }
        ],
        notices: ['打卡需在活動期間內完成', '獎勵需在活動結束前領取', '每個地點限打卡一次']
    }
];
