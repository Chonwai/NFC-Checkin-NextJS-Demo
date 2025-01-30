export interface DashboardStats {
    activities: {
        total: number;
        active: number;
    };
    check_ins: {
        total: number;
        unique_locations: number;
    };
    users: {
        total: number;
        active: number;
    };
    stats_updated_at: string;
}

export interface DashboardResponse {
    success: boolean;
    data?: {
        dashboard: DashboardStats;
    };
    error?: {
        message: string;
    };
}

export interface ActivityData {
    id: string;
    name: string;
    total_users: number;
    total_check_ins: number;
    completion_stats: {
        full_completion_rate: number;
        partial_completion_rate: number;
    };
    active_days: number;
    status: string;
}

export interface ActivitiesDataResponse {
    success: boolean;
    data?: {
        activities_data: ActivityData[];
    };
    error?: {
        message: string;
    };
}

export interface LocationData {
    name: string;
    check_in_count: number;
    unique_users: number;
    id: string | null;
}

export interface LocationsDataResponse {
    success: boolean;
    data?: {
        locations_data: LocationData[];
    };
    error?: {
        message: string;
    };
}

export interface TrendData {
    date: string;
    new_users: number;
    active_users: number;
}

export interface TrendDataResponse {
    success: boolean;
    data?: {
        trend_data: TrendData[];
    };
    error?: {
        message: string;
    };
}

export interface AdminActivity {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    meta: Record<string, any>;
    created_at: string;
    updated_at: string;
    check_in_limit: number;
    single_location_only: boolean;
    is_active: boolean;
    locations: AdminLocation[];
}

export interface AdminLocation {
    id: string;
    name: string;
    description: string;
    activity_id: string;
    address: string;
    meta: Record<string, any>;
    created_at: string;
    updated_at: string;
    check_in_icon_type?: 'default' | 'custom';
    check_in_icon_url?: string;
}

export interface AdminActivitiesResponse {
    success: boolean;
    data?: {
        activities: AdminActivity[];
    };
    error?: {
        message: string;
    };
}

export interface CreateActivityPayload {
    activity: {
        name: string;
        description: string;
        start_date: string;
        end_date: string;
        check_in_limit: number;
        single_location_only: boolean;
        is_active: boolean;
    };
}

export interface CreateActivityResponse {
    success: boolean;
    data?: {
        activity: {
            id: string;
            name: string;
        };
    };
    error?: {
        message: string;
        details?: string[];
    };
}

export interface AdminLocationsResponse {
    success: boolean;
    data?: {
        locations: AdminLocation[];
    };
    error?: {
        message: string;
    };
}

export interface CreateLocationPayload {
    location: {
        name: string;
        description: string;
        address: string;
        activity_id: string;
    };
}

export interface CreateLocationResponse {
    success: boolean;
    data?: {
        location: AdminLocation;
    };
    error?: {
        message: string;
    };
}

export interface UpdateLocationPayload {
    location: Partial<{
        name: string;
        description: string;
        address: string;
        activity_id: string;
    }>;
}

export interface LocationResponse {
    success: boolean;
    data?: {
        location: AdminLocation;
    };
    error?: {
        message: string;
    };
}

export interface TimeDistributionResponse {
    success: boolean;
    data?: {
        hourly_distribution: Record<string, number>;
        weekly_distribution: Record<string, number>;
    };
    error?: {
        message: string;
    };
}

export interface UserBehaviorStat {
    id: string;
    total_check_ins: number;
    first_check_in: string;
    last_check_in: string;
    duration: number;
}

export interface UserBehaviorResponse {
    success: boolean;
    data?: {
        user_behavior_stats: UserBehaviorStat[];
    };
    error?: {
        message: string;
    };
}

export interface LocationHeatMapItem {
    name: string;
    check_in_count: number;
    unique_users: number;
    median_check_in_hour: number;
    id: string | null;
}

export interface LocationHeatMapResponse {
    success: boolean;
    data?: {
        location_heat_map: LocationHeatMapItem[];
    };
    error?: {
        message: string;
    };
}

export interface CompletionTrendItem {
    activity_name: string;
    total_users: number;
    completion_rate: number;
}

export interface CompletionTrendResponse {
    success: boolean;
    data?: {
        completion_trend: CompletionTrendItem[];
    };
    error?: {
        message: string;
    };
}

export interface ParticipationRequirement {
    type: 'location' | 'reward';
    count: number;
    description: string;
}

export interface ParticipationInfo {
    requirements: ParticipationRequirement[];
    notices: string[];
}

export interface ActivityMeta {
    reward_api?: {
        issue_endpoint: string;
        query_endpoint: string;
    };
    subscription_api?: {
        game_id: string;
    };
    participation_info?: ParticipationInfo;
}

export interface EditActivityFormData {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    check_in_limit: number;
    single_location_only: boolean;
    is_active: boolean;
    requires_contact_info: boolean;
    meta?: ActivityMeta;
}
