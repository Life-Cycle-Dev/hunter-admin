export interface ErrorResponse {
  error: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorResponse = (data: any): data is ErrorResponse => {
  return typeof data.error === "string";
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
  role: string;
  permissions: string[];
  created_at: string;
}

export const initUserType: UserType = {
  id: "",
  name: "",
  email: "",
  is_developer: false,
  is_email_verified: false,
  role: "User",
  permissions: [],
  created_at: "",
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

export interface Permission {
  id: string;
  title: string;
  mapping: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionListResponse {
  data: Permission[];
  pagination: PaginationResponse;
  query: string;
}

export interface Role {
  id: string;
  title: string;
  mapping: string;
  created_at: string;
  updated_at: string;
}

export interface RoleListResponse {
  data: Role[];
  pagination: PaginationResponse;
  query: string;
}

export interface CreatePermissionRequest {
  title: string;
  mapping: string;
}

export interface UpdatePermissionRequest {
  title: string;
  mapping: string;
}

export interface CreateRoleRequest {
  title: string;
  mapping: string;
  permission_ids: string[];
}

export interface CreateRoleResponse {
  permissions: Permission[];
  role: Role;
}

export interface GetRoleByIdResponse {
  permissions: Permission[];
  role: Role;
}

export interface UpdateRoleRequest {
  title: string;
  mapping: string;
  permission_ids: string[];
}

export interface UpdateRoleResponse {
  permissions: Permission[];
  role: Role;
}

export interface UserView {
  id: string;
  email: string;
  is_developer: boolean;
  is_email_verified: boolean;
  name: string;
  role: string;
}

export interface UserListResponse {
  data: UserView[];
  pagination: PaginationResponse;
  query: string;
}

export interface GetUserByIdResponse {
  id: string;
  name: string;
  email: string;
  is_developer: boolean;
  is_email_verified: boolean;
  role_id: string;
  role: Role;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}
