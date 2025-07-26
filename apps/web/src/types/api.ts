export interface LoginData {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: number;
  servings?: number;
  difficulty?: string;
  category?: string;
  imageUrl?: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalRecipes: number;
    verifiedUsers: number;
    adminUsers: number;
    unverifiedUsers: number;
  };
  recent: {
    users: User[];
    recipes: Recipe[];
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedUsers {
  users: User[];
  pagination: Pagination;
}

export interface PaginatedRecipes {
  recipes: Recipe[];
  pagination: Pagination;
}

export interface ApiParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  [key: string]: any;
}

export interface RecipeData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: number;
  servings?: number;
  difficulty?: string;
  category?: string;
  imageUrl?: string;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface UserVerificationData {
  isVerified: boolean;
}

export interface UserAdminStatusData {
  isAdmin: boolean;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
