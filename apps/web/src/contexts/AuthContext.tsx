import React, { createContext, useState, useEffect, useContext } from "react";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  getAccessToken: () => string | null; // ✅ Tambahan untuk API client
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // ✅ Prevent multiple refresh calls

  // Load tokens dari localStorage saat init
  useEffect(() => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");

    if (savedAccessToken) {
      setAccessToken(savedAccessToken);
    }
    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
      }
    }

    setIsInitialized(true);

    // Coba refresh token jika ada refresh token tapi tidak ada access token
    if (savedRefreshToken && !savedAccessToken) {
      refreshAccessToken();
    }
  }, []);

  // Fungsi login - simpan kedua token
  const login = (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);

    // Simpan ke localStorage
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = async () => {
    try {
      // Optional: Panggil logout endpoint jika ada
      if (accessToken) {
        await fetch("http://localhost:3000/api/user/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state dan localStorage
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  // ✅ Helper function untuk API client - selalu return token terbaru
  const getAccessToken = (): string | null => {
    return accessToken;
  };

  // Refresh access token menggunakan refresh token
  const refreshAccessToken = async (): Promise<boolean> => {
    // ✅ Prevent multiple refresh calls
    if (isRefreshing) {
      return false;
    }

    const currentRefreshToken =
      refreshToken || localStorage.getItem("refreshToken");

    if (!currentRefreshToken) {
      console.log("No refresh token available");
      return false;
    }

    setIsRefreshing(true);

    try {
      const res = await fetch("http://localhost:3000/api/user/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: currentRefreshToken,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // ✅ Update state dengan token baru
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);

        // Jika ada refresh token baru (rotation), simpan yang baru
        if (data.refreshToken) {
          setRefreshToken(data.refreshToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        // Update user data jika ada
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        return true;
      } else {
        // Refresh token invalid/expired, logout
        console.log("Refresh token invalid, logging out");
        await logout();
        return false;
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      await logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        refreshAccessToken,
        setAccessToken,
        setUser,
        getAccessToken,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
