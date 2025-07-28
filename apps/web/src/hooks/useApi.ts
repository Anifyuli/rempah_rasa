import { useAuth } from "../contexts/AuthContext";
import { createApiClient } from "../utils/apiClients";
import type {
  User,
  Recipe,
  DashboardStats,
  PaginatedUsers,
  PaginatedRecipes,
  ApiParams,
  RecipeData,
  ProfileData,
  PasswordData,
  AdminFormData,
  UserVerificationData,
  UserAdminStatusData,
  LoginData,
  LoginResponse,
} from "../types/api";

// useApi hooks
export function useApi() {
  const { getAccessToken, refreshAccessToken } = useAuth();
  const api = createApiClient(getAccessToken, refreshAccessToken);

  return {
    // AUTH METHODS
    login: async (loginData: LoginData): Promise<LoginResponse> => {
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${res.status}`);
      }

      return res.json();
    },

    register: async (postData: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
    }): Promise<{ user: User; message: string }> => {
      const res = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Register failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    // USER PROFILE METHODS
    getProfile: async (): Promise<{ user: User }> => {
      const res = await api("http://localhost:3000/api/user/profile");

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Get profile failed: ${res.status}`);
      }

      return res.json();
    },

    updateProfile: async (profileData: ProfileData): Promise<{ user: User; message: string }> => {
      const res = await api("http://localhost:3000/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Gagal update profil: ${res.status}`);
      }

      return res.json();
    },

    updatePassword: async (passwordData: PasswordData): Promise<{ message: string }> => {
      const res = await api("http://localhost:3000/api/user/password", {
        method: "PUT",
        body: JSON.stringify(passwordData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Gagal mengubah kata sandi: ${res.status}`);
      }

      return res.json();
    },

    // RECIPE METHODS
    createNewRecipe: async (recipeData: RecipeData): Promise<{ recipe: Recipe; message: string }> => {
      const res = await api("http://localhost:3000/api/recipe", {
        method: "POST",
        body: JSON.stringify(recipeData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Create recipe failed: ${res.status}`);
      }

      return res.json();
    },

    deleteRecipe: async (slug: string): Promise<{ message: string }> => {
      const res = await api(`http://localhost:3000/api/recipe/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Delete recipe failed: ${res.status}`);
      }

      return res.json();
    },

    // ADMIN METHODS
    getDashboardStats: async (): Promise<DashboardStats> => {
      const res = await api("http://localhost:3000/api/admin/dashboard");

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Get dashboard stats failed: ${res.status}`);
      }

      return res.json();
    },

    // Users list for regular users (deprecated, use adminGetUsersList)
    getUsersList: async (): Promise<PaginatedUsers> => {
      const res = await api("http://localhost:3000/api/admin/users");

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Get users list failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    // Admin users list with parameters
    adminGetUsersList: async (params: ApiParams = {}): Promise<PaginatedUsers> => {
      // Convert params to string values for URLSearchParams
      const stringParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          stringParams[key] = String(value);
        }
      });

      const searchParams = new URLSearchParams(stringParams);
      const res = await api(`http://localhost:3000/api/admin/users?${searchParams}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Get admin users list failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    getUserById: async (userId: string): Promise<{ user: User }> => {
      const res = await api(`http://localhost:3000/api/admin/users/${userId}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Get user by ID failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    updateUserVerification: async (userId: string, data: UserVerificationData): Promise<{ user: User; message: string }> => {
      const res = await api(`http://localhost:3000/api/admin/users/${userId}/verify`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update user verification failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    updateUserAdminStatus: async (userId: string, data: UserAdminStatusData): Promise<{ user: User; message: string }> => {
      const res = await api(`http://localhost:3000/api/admin/users/${userId}/admin`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update user admin status failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    createAdminAccount: async (data: AdminFormData): Promise<{ user: User; message: string }> => {
      const res = await api("http://localhost:3000/api/admin/users/create-admin", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Create admin account failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    deleteUser: async (userId: string): Promise<{ message: string }> => {
      const res = await api(`http://localhost:3000/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete user failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    getRecipesList: async (params: ApiParams = {}): Promise<PaginatedRecipes> => {
      // Convert params to string values for URLSearchParams
      const stringParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          stringParams[key] = String(value);
        }
      });

      const searchParams = new URLSearchParams(stringParams);
      const res = await api(`http://localhost:3000/api/admin/recipes?${searchParams}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Get recipes list failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },

    deleteRecipeAdmin: async (recipeId: string): Promise<{ message: string }> => {
      const res = await api(`http://localhost:3000/api/admin/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete recipe (admin) failed: ${res.status} ${errorText}`);
      }

      return res.json();
    },
  };
}
