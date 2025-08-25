export interface ApiResponse<T> {
    data: T;
}

export interface ApiPaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: 0;
    };
}
