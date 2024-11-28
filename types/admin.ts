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
