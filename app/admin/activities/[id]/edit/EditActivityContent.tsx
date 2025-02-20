'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUpdateActivity } from '@/hooks/admin/useUpdateActivity';
import { useActivity } from '@/hooks/useActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    formatLocalToUTC,
    formatDateTimeForInput,
    formatUTCToZonedInput,
    formatInputToUTC
} from '@/utils/dateTime';
import { ActivityMeta, ParticipationRequirement, VerificationSettings } from '@/types/admin';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Plus, Trash2, Eye } from 'lucide-react';
import { PARTICIPATION_TEMPLATES } from '@/constants/participationTemplates';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ActivityInfoModal } from '@/components/ActivityInfoModal';
import { Checkbox } from '@/components/ui/checkbox';

interface EditActivityFormData {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    check_in_limit: number;
    single_location_only: boolean;
    is_active: boolean;
    requires_contact_info: boolean;
    participation_info?: {
        requirements: ParticipationRequirement[];
        notices: string[];
    };
    meta: {
        participation_info?: {
            requirements: ParticipationRequirement[];
            notices: string[];
        };
        reward_api?: {
            issue_endpoint: string;
            query_endpoint: string;
        };
        verification_settings?: VerificationSettings;
    };
    game_id?: string;
    coupon_id?: string;
    verification_settings?: VerificationSettings;
}

export default function EditActivityContent({ activityId }: { activityId: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const { activity, isLoading: isLoadingActivity } = useActivity(activityId, deviceId);
    const { updateActivity, isLoading: isUpdating } = useUpdateActivity();
    const [formData, setFormData] = useState<EditActivityFormData>({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        check_in_limit: 1,
        single_location_only: true,
        is_active: true,
        requires_contact_info: false,
        meta: {
            participation_info: {
                requirements: [],
                notices: []
            },
            verification_settings: {
                enabled: false,
                methods: [],
                required: false,
                game_id: ''
            }
        }
    });

    useEffect(() => {
        if (activity) {
            let game_id = '';
            let coupon_id = '';

            if (activity.meta?.reward_api?.issue_endpoint) {
                const matches = activity.meta.reward_api.issue_endpoint.match(
                    /games\/(.*?)\/coupons\/(.*?)$/
                );
                if (matches) {
                    game_id = matches[1];
                    coupon_id = matches[2];
                }
            }

            // 使用根層級的 verification_settings
            const verification_settings = activity.verification_settings || {
                enabled: false,
                methods: [],
                required: false,
                game_id: null
            };

            setFormData({
                ...activity,
                game_id,
                coupon_id,
                meta: {
                    ...activity.meta,
                    verification_settings: undefined // 清除 meta 中的 verification_settings
                },
                verification_settings // 使用根層級的 verification_settings
            });
        }
    }, [activity]);

    const validateVerificationSettings = (settings?: VerificationSettings) => {
        if (!settings?.enabled) return true;

        if (settings.methods.length === 0) {
            toast({
                title: '驗證設置錯誤',
                description: '啟用驗證時必須選擇至少一種驗證方式',
                variant: 'destructive'
            });
            return false;
        }

        if (settings.methods.includes('phone') && !settings.game_id) {
            toast({
                title: '驗證設置錯誤',
                description: '啟用手機驗證時必須設置 Game ID',
                variant: 'destructive'
            });
            return false;
        }

        if (settings.required && settings.methods.length === 0) {
            toast({
                title: '驗證設置錯誤',
                description: '啟用必要驗證時必須選擇至少一種驗證方法',
                variant: 'destructive'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateVerificationSettings(formData.verification_settings)) {
            return;
        }

        try {
            const payload = {
                activity: {
                    ...formData,
                    start_date: formatInputToUTC(formData.start_date),
                    end_date: formatInputToUTC(formData.end_date),
                    verification_settings: formData.verification_settings, // 直接使用根層級的 verification_settings
                    meta: {
                        ...formData.meta,
                        verification_settings: undefined // 確保 meta 中沒有 verification_settings
                    }
                }
            };

            const response = await updateActivity(activityId, payload);

            if (response.success) {
                toast({
                    title: '更新成功',
                    description: `活動「${formData.name}」已成功更新`,
                    duration: 3000
                });
                router.push('/admin/activities');
            }
        } catch (err: any) {
            toast({
                title: '更新失敗',
                description: err.message || '未知錯誤',
                variant: 'destructive',
                duration: 3000
            });
        }
    };

    if (isLoadingActivity) {
        return <div>載入中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">編輯活動</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>活動資訊</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">活動名稱</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">活動描述</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">開始時間</label>
                                <Input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(formData.start_date)}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_date: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">結束時間</label>
                                <Input
                                    type="datetime-local"
                                    value={formatDateTimeForInput(formData.end_date)}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">打卡次數限制</label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.check_in_limit}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        check_in_limit: parseInt(e.target.value)
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">僅限單一地點打卡</label>
                            <Switch
                                checked={formData.single_location_only}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, single_location_only: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">活動開啟</label>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">需要聯絡資訊</label>
                            <Switch
                                checked={formData.requires_contact_info}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, requires_contact_info: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">需要獎勵機制？</label>
                            <Switch
                                checked={!!formData.meta?.reward_api}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        meta: {
                                            ...formData.meta,
                                            reward_api: checked
                                                ? {
                                                      issue_endpoint: `https://games.travel3exp.xyz/api/games/${formData.game_id || ''}/coupons/${formData.coupon_id || ''}`,
                                                      query_endpoint: `https://games.travel3exp.xyz/api/games/${formData.game_id || ''}/users/%{user_id}`
                                                  }
                                                : undefined
                                        }
                                    })
                                }
                            />
                        </div>

                        {formData.meta?.reward_api && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Game ID</label>
                                    <Input
                                        value={formData.game_id || ''}
                                        onChange={(e) => {
                                            const gameId = e.target.value;
                                            setFormData({
                                                ...formData,
                                                game_id: gameId,
                                                meta: {
                                                    ...formData.meta,
                                                    reward_api: {
                                                        issue_endpoint: `https://games.travel3exp.xyz/api/games/${gameId}/coupons/${formData.coupon_id || ''}`,
                                                        query_endpoint: `https://games.travel3exp.xyz/api/games/${gameId}/users/%{user_id}`
                                                    }
                                                }
                                            });
                                        }}
                                        placeholder="請輸入 Game ID"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Coupon ID</label>
                                    <Input
                                        value={formData.coupon_id || ''}
                                        onChange={(e) => {
                                            const couponId = e.target.value;
                                            setFormData({
                                                ...formData,
                                                coupon_id: couponId,
                                                meta: {
                                                    ...formData.meta,
                                                    reward_api: {
                                                        issue_endpoint: `https://games.travel3exp.xyz/api/games/${formData.game_id || ''}/coupons/${couponId}`,
                                                        query_endpoint: `https://games.travel3exp.xyz/api/games/${formData.game_id || ''}/users/%{user_id}`
                                                    }
                                                }
                                            });
                                        }}
                                        placeholder="請輸入 Coupon ID"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">參與方式設定</h3>
                                <div className="flex gap-2">
                                    <Select
                                        onValueChange={(value) => {
                                            const template = PARTICIPATION_TEMPLATES.find(
                                                (t) => t.name === value
                                            );
                                            if (template) {
                                                setFormData({
                                                    ...formData,
                                                    meta: {
                                                        ...formData.meta,
                                                        participation_info: {
                                                            requirements: [
                                                                ...template.requirements
                                                            ],
                                                            notices: [...template.notices]
                                                        }
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="選擇模板" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PARTICIPATION_TEMPLATES.map((template) => (
                                                <SelectItem
                                                    key={template.name}
                                                    value={template.name}
                                                >
                                                    {template.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                預覽
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-lg">
                                            <ActivityInfoModal
                                                activity={{
                                                    ...formData,
                                                    participation_info:
                                                        formData.meta?.participation_info
                                                }}
                                            >
                                                <div />
                                            </ActivityInfoModal>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            {/* 參與要求 */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">參與要求</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newRequirements = [
                                                ...(formData.meta?.participation_info
                                                    ?.requirements || []),
                                                {
                                                    type: 'location',
                                                    count: 1,
                                                    description: ''
                                                }
                                            ];
                                            setFormData({
                                                ...formData,
                                                meta: {
                                                    ...formData.meta,
                                                    participation_info: {
                                                        ...formData.meta?.participation_info,
                                                        requirements:
                                                            newRequirements as ParticipationRequirement[]
                                                    } as {
                                                        requirements: ParticipationRequirement[];
                                                        notices: string[];
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        新增要求
                                    </Button>
                                </div>

                                {formData.meta?.participation_info?.requirements?.map(
                                    (req, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg"
                                        >
                                            <Select
                                                value={req.type}
                                                onValueChange={(value) => {
                                                    const newRequirements = [
                                                        ...formData.meta!.participation_info!
                                                            .requirements
                                                    ];
                                                    newRequirements[index] = {
                                                        ...newRequirements[index],
                                                        type: value as 'location' | 'reward'
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        meta: {
                                                            ...formData.meta,
                                                            participation_info: {
                                                                ...formData.meta
                                                                    ?.participation_info,
                                                                requirements: newRequirements
                                                            } as {
                                                                requirements: ParticipationRequirement[];
                                                                notices: string[];
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="類型" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="location">
                                                        地點要求
                                                    </SelectItem>
                                                    <SelectItem value="reward">獎勵要求</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Input
                                                type="number"
                                                min="1"
                                                className="w-[100px]"
                                                value={req.count}
                                                onChange={(e) => {
                                                    const newRequirements = [
                                                        ...formData.meta!.participation_info!
                                                            .requirements
                                                    ];
                                                    newRequirements[index] = {
                                                        ...newRequirements[index],
                                                        count: parseInt(e.target.value)
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        meta: {
                                                            ...formData.meta,
                                                            participation_info: {
                                                                ...formData.meta
                                                                    ?.participation_info,
                                                                requirements: newRequirements
                                                            } as {
                                                                requirements: ParticipationRequirement[];
                                                                notices: string[];
                                                            }
                                                        }
                                                    });
                                                }}
                                            />

                                            <Input
                                                className="flex-1"
                                                value={req.description}
                                                onChange={(e) => {
                                                    const newRequirements = [
                                                        ...formData.meta!.participation_info!
                                                            .requirements
                                                    ];
                                                    newRequirements[index] = {
                                                        ...newRequirements[index],
                                                        description: e.target.value
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        meta: {
                                                            ...formData.meta,
                                                            participation_info: {
                                                                ...formData.meta
                                                                    ?.participation_info,
                                                                requirements: newRequirements
                                                            } as {
                                                                requirements: ParticipationRequirement[];
                                                                notices: string[];
                                                            }
                                                        }
                                                    });
                                                }}
                                                placeholder="輸入要求描述"
                                            />

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newRequirements =
                                                        formData.meta!.participation_info!.requirements.filter(
                                                            (_, i) => i !== index
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        meta: {
                                                            ...formData.meta,
                                                            participation_info: {
                                                                ...formData.meta
                                                                    ?.participation_info,
                                                                requirements: newRequirements
                                                            } as {
                                                                requirements: ParticipationRequirement[];
                                                                notices: string[];
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* 注意事項 */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">注意事項</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newNotices = [
                                                ...(formData.meta?.participation_info?.notices ||
                                                    []),
                                                ''
                                            ];
                                            setFormData({
                                                ...formData,
                                                meta: {
                                                    ...formData.meta,
                                                    participation_info: {
                                                        ...formData.meta?.participation_info,
                                                        notices: newNotices
                                                    } as {
                                                        requirements: ParticipationRequirement[];
                                                        notices: string[];
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        新增注意事項
                                    </Button>
                                </div>

                                {formData.meta?.participation_info?.notices?.map(
                                    (notice, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={notice}
                                                onChange={(e) => {
                                                    const newNotices = [
                                                        ...formData.meta!.participation_info!
                                                            .notices
                                                    ];
                                                    newNotices[index] = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        meta: {
                                                            ...formData.meta,
                                                            participation_info: {
                                                                ...formData.meta
                                                                    ?.participation_info,
                                                                notices: newNotices
                                                            } as {
                                                                requirements: ParticipationRequirement[];
                                                                notices: string[];
                                                            }
                                                        }
                                                    });
                                                }}
                                                placeholder="輸入注意事項"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newNotices =
                                                        formData.meta!.participation_info!.notices.filter(
                                                            (_, i) => i !== index
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        meta: {
                                                            ...formData.meta,
                                                            participation_info: {
                                                                ...formData.meta
                                                                    ?.participation_info,
                                                                notices: newNotices
                                                            } as {
                                                                requirements: ParticipationRequirement[];
                                                                notices: string[];
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">驗證設置</h3>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">啟用驗證</label>
                                <Switch
                                    checked={formData.verification_settings?.enabled}
                                    onCheckedChange={(checked) =>
                                        setFormData({
                                            ...formData,
                                            verification_settings: {
                                                ...formData.verification_settings,
                                                enabled: checked,
                                                methods: checked
                                                    ? formData.verification_settings?.methods || []
                                                    : []
                                            }
                                        })
                                    }
                                />
                            </div>

                            {formData.verification_settings?.enabled && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">驗證方式</label>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={formData.verification_settings?.methods.includes(
                                                        'phone'
                                                    )}
                                                    onCheckedChange={(checked) => {
                                                        const methods =
                                                            formData.verification_settings
                                                                ?.methods || [];
                                                        const newMethods = checked
                                                            ? [...methods, 'phone']
                                                            : methods.filter((m) => m !== 'phone');

                                                        setFormData({
                                                            ...formData,
                                                            verification_settings: {
                                                                ...formData.verification_settings,
                                                                methods: newMethods
                                                            }
                                                        });
                                                    }}
                                                />
                                                <label>手機驗證</label>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={formData.verification_settings?.methods.includes(
                                                        'email'
                                                    )}
                                                    onCheckedChange={(checked) => {
                                                        const methods =
                                                            formData.verification_settings
                                                                ?.methods || [];
                                                        const newMethods = checked
                                                            ? [...methods, 'email']
                                                            : methods.filter((m) => m !== 'email');

                                                        setFormData({
                                                            ...formData,
                                                            verification_settings: {
                                                                ...formData.verification_settings,
                                                                methods: newMethods
                                                            }
                                                        });
                                                    }}
                                                />
                                                <label>電子郵件驗證</label>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.verification_settings?.methods.includes('phone') && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Game ID</label>
                                            <Input
                                                value={
                                                    formData.verification_settings?.game_id || ''
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        verification_settings: {
                                                            ...formData.verification_settings,
                                                            game_id: e.target.value
                                                        }
                                                    })
                                                }
                                                placeholder="請輸入手機驗證用的 Game ID"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">必須驗證</label>
                                        <Switch
                                            checked={formData.verification_settings?.required}
                                            onCheckedChange={(checked) =>
                                                setFormData({
                                                    ...formData,
                                                    verification_settings: {
                                                        ...formData.verification_settings,
                                                        required: checked
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                取消
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? '更新中...' : '更新活動'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
