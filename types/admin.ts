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
