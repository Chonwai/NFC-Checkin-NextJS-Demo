'use client';

import { useCreateActivity } from '@/hooks/admin/useCreateActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import dayjs from 'dayjs';
import {
    formatUTCToZonedInput,
    formatDateTimeForInput,
    formatInputToUTC,
    formatDateTime
} from '@/utils/dateTime';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ActivityInfoModal } from '@/components/ActivityInfoModal';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { PARTICIPATION_TEMPLATES } from '@/constants/participationTemplates';
import { ParticipationRequirement } from '@/types/admin';
import { RewardMode } from '@/types/admin';

interface CreateActivityFormData {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    check_in_limit: number;
    single_location_only: boolean;
    is_active: boolean;
    requires_contact_info: boolean;
    reward_mode: RewardMode;
    meta: {
        participation_info: {
            requirements: ParticipationRequirement[];
            notices: string[];
        };
        reward_threshold?: number;
    };
    game_id?: string;
}

export default function CreateActivity() {
    const { createActivity, isLoading } = useCreateActivity();
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<CreateActivityFormData>({
        name: '',
        description: '',
        start_date: formatUTCToZonedInput(dayjs().format()),
        end_date: formatUTCToZonedInput(dayjs().add(7, 'day').format()),
        check_in_limit: 1,
        single_location_only: true,
        is_active: true,
        requires_contact_info: false,
        reward_mode: 'full',
        meta: {
            participation_info: {
                requirements: [],
                notices: []
            },
            reward_threshold: 1
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                activity: {
                    ...formData,
                    start_date: formatInputToUTC(formData.start_date),
                    end_date: formatInputToUTC(formData.end_date),
                    meta: {
                        ...(formData.requires_contact_info
                            ? {
                                  subscription_api: {
                                      game_id: formData.game_id
                                  }
                              }
                            : {}),
                        participation_info: formData.meta?.participation_info,
                        ...(formData.reward_mode === 'partial' && {
                            reward_threshold: formData.meta?.reward_threshold
                        })
                    }
                }
            };

            const response = await createActivity(payload);

            if (response.success) {
                toast({
                    title: '建立成功',
                    description: `活動「${formData.name}」已成功建立`,
                    duration: 3000
                });
                router.push('/admin/activities');
            }
        } catch (err: any) {
            toast({
                title: '建立失敗',
                description: err.message || '未知錯誤',
                variant: 'destructive',
                duration: 3000
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">建立新活動</h1>
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
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">活動描述</label>
                            <Textarea
                                required
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
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
                            <label className="text-sm font-medium">打卡次數上限</label>
                            <Input
                                type="number"
                                min="1"
                                required
                                value={formData.check_in_limit}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        check_in_limit: parseInt(e.target.value)
                                    })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">限制單一地點</label>
                            <Switch
                                checked={formData.single_location_only}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, single_location_only: checked })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">立即啟用</label>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">需要收集聯絡資訊？</label>
                                <Switch
                                    checked={formData.requires_contact_info}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, requires_contact_info: checked })
                                    }
                                />
                            </div>

                            {formData.requires_contact_info && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Game ID</label>
                                    <Input
                                        value={formData.game_id || ''}
                                        onChange={(e) =>
                                            setFormData({ ...formData, game_id: e.target.value })
                                        }
                                        placeholder="請輸入外部系統的 Game ID"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">獎勵模式</label>
                                <Select
                                    value={formData.reward_mode}
                                    onValueChange={(value: RewardMode) =>
                                        setFormData({ ...formData, reward_mode: value })
                                    }
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="選擇獎勵模式" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full">全部完成</SelectItem>
                                        <SelectItem value="partial">部分完成</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.reward_mode === 'partial' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">獎勵門檻</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max={
                                            formData.single_location_only
                                                ? formData.check_in_limit
                                                : undefined
                                        }
                                        value={formData.meta?.reward_threshold || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                meta: {
                                                    ...formData.meta,
                                                    reward_threshold: parseInt(e.target.value)
                                                }
                                            })
                                        }
                                    />
                                </div>
                            )}
                        </div>

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
                                                        } as {
                                                            requirements: ParticipationRequirement[];
                                                            notices: string[];
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

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                取消
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? '建立中...' : '建立活動'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
