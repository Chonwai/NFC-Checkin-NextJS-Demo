// 國家/地區電話代碼配置
export interface CountryPhoneCode {
    code: string; // 國家代碼
    name: string; // 國家/地區名稱
    phoneCode: string; // 電話區號
    pattern: RegExp; // 電話號碼驗證規則
    example: string; // 電話號碼示例
    digitLength: number; // 電話號碼位數
}

// 支持的國家/地區及其區號
export const COUNTRY_PHONE_CODES: CountryPhoneCode[] = [
    {
        code: 'MO',
        name: '澳門',
        phoneCode: '853',
        pattern: /^[2-9]\d{7}$/, // 8位數字，首位不為0或1
        example: '61234567',
        digitLength: 8
    },
    {
        code: 'HK',
        name: '香港',
        phoneCode: '852',
        pattern: /^[2-9]\d{7}$/, // 8位數字，首位不為0或1
        example: '61234567',
        digitLength: 8
    },
    {
        code: 'CN',
        name: '中國內地',
        phoneCode: '86',
        pattern: /^1[3-9]\d{9}$/, // 11位數字，以1開頭
        example: '13812345678',
        digitLength: 11
    }
];

// 根據國家代碼獲取國家資訊
export const getCountryByCode = (code: string): CountryPhoneCode => {
    return COUNTRY_PHONE_CODES.find((country) => country.code === code) || COUNTRY_PHONE_CODES[0];
};

// 根據電話區號獲取國家資訊
export const getCountryByPhoneCode = (phoneCode: string): CountryPhoneCode => {
    return (
        COUNTRY_PHONE_CODES.find((country) => country.phoneCode === phoneCode) ||
        COUNTRY_PHONE_CODES[0]
    );
};
