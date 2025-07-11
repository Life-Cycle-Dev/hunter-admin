export interface ErrorResponse {
    error: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorResponse = (data: any): data is ErrorResponse => {
    return typeof data.error === 'string';
};

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    refresh_token: string;
    access_token: string;
}

export interface UserType {
    id: string;
    name: string;
    email: string;
    is_developer: boolean;
    is_email_verified: boolean;
    created_at: string;
}

export const initUserType: UserType = {
    id: '',
    name: '',
    email: '',
    is_developer: false,
    is_email_verified: false,
    created_at: ''
};

export interface PaginationResponse {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
}

export interface Application {
    id: string;
    title: string;
    description: string;
    image_url: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ApplicationListResponse {
    data: Application[];
    pagination: PaginationResponse;
    query: string;
}

export interface ApplicationCreateRequest {
    title: string;
    description: string;
    active: boolean;
}
