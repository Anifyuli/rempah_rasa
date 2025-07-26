import {
  Activity,
  BookOpen,
  LogOut,
  Search,
  Shield,
  ShieldCheck,
  ShieldUser,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Temporary interfaces untuk TypeScript
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}

interface Recipe {
  _id: string;
  title: string;
  description: string;
  userId: {
    firstName: string;
    lastName: string;
    username: string;
  };
  created_at: string;
}

interface DashboardStats {
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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface AdminFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const AdminDashboard: React.FC = () => {
  const api = useApi();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showCreateAdminModal, setShowCreateAdminModal] =
    useState<boolean>(false);

  // Pagination states
  const [userPage, setUserPage] = useState<number>(1);
  const [recipePage, setRecipePage] = useState<number>(1);
  const [userPagination, setUserPagination] = useState<Pagination>(
    {} as Pagination,
  );
  const [recipePagination, setRecipePagination] = useState<Pagination>(
    {} as Pagination,
  );

  // Filter states
  const [userSearch, setUserSearch] = useState<string>("");
  const [userStatus, setUserStatus] = useState<string>("all");
  const [recipeSearch, setRecipeSearch] = useState<string>("");

  // Form state for create admin
  const [adminForm, setAdminForm] = useState<AdminFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  // Mock API functions untuk development - ganti dengan useApi nanti
  const mockApiCall = async (
    endpoint: string,
    _options: any = {},
  ): Promise<any> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock responses based on endpoint
    if (endpoint === "/api/admin/dashboard") {
      return {
        stats: {
          totalUsers: 150,
          totalRecipes: 320,
          verifiedUsers: 120,
          adminUsers: 5,
          unverifiedUsers: 30,
        },
        recent: {
          users: [
            {
              _id: "1",
              firstName: "John",
              lastName: "Doe",
              username: "johndoe",
              email: "john@example.com",
              isVerified: true,
              isAdmin: false,
              createdAt: "2024-01-15",
            },
            {
              _id: "2",
              firstName: "Jane",
              lastName: "Smith",
              username: "janesmith",
              email: "jane@example.com",
              isVerified: false,
              isAdmin: false,
              createdAt: "2024-01-14",
            },
          ],
          recipes: [
            {
              _id: "1",
              title: "Nasi Goreng Spesial",
              description: "Resep nasi goreng yang lezat",
              userId: {
                firstName: "John",
                lastName: "Doe",
                username: "johndoe",
              },
              createdAt: "2024-01-15",
            },
            {
              _id: "2",
              title: "Rendang Padang",
              description: "Rendang khas Padang yang autentik",
              userId: {
                firstName: "Jane",
                lastName: "Smith",
                username: "janesmith",
              },
              createdAt: "2024-01-14",
            },
          ],
        },
      };
    }

    if (endpoint.includes("/api/admin/users")) {
      return {
        users: [
          {
            _id: "1",
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "john@example.com",
            isVerified: true,
            isAdmin: false,
            createdAt: "2024-01-15",
          },
          {
            _id: "2",
            firstName: "Jane",
            lastName: "Smith",
            username: "janesmith",
            email: "jane@example.com",
            isVerified: false,
            isAdmin: false,
            createdAt: "2024-01-14",
          },
          {
            _id: "3",
            firstName: "Admin",
            lastName: "User",
            username: "admin",
            email: "admin@example.com",
            isVerified: true,
            isAdmin: true,
            createdAt: "2024-01-10",
          },
        ],
        pagination: { total: 150, page: 1, limit: 10, pages: 15 },
      };
    }

    if (endpoint.includes("/api/admin/recipes")) {
      return {
        recipes: [
          {
            _id: "1",
            title: "Nasi Goreng Spesial",
            description: "Resep nasi goreng yang lezat",
            userId: { firstName: "John", lastName: "Doe", username: "johndoe" },
            createdAt: "2024-01-15",
          },
          {
            _id: "2",
            title: "Rendang Padang",
            description: "Rendang khas Padang yang autentik",
            userId: {
              firstName: "Jane",
              lastName: "Smith",
              username: "janesmith",
            },
            createdAt: "2024-01-14",
          },
          {
            _id: "3",
            title: "Gudeg Jogja",
            description: "Gudeg khas Yogyakarta",
            userId: {
              firstName: "Budi",
              lastName: "Santoso",
              username: "budisan",
            },
            createdAt: "2024-01-13",
          },
        ],
        pagination: { total: 320, page: 1, limit: 10, pages: 32 },
      };
    }

    return { message: "Success" };
  };

  useEffect(() => {
    if (activeSection === "dashboard") {
      fetchDashboardStats();
    } else if (activeSection === "users") {
      fetchUsers();
    } else if (activeSection === "recipes") {
      fetchRecipes();
    }
  }, [
    activeSection,
    userPage,
    recipePage,
    userSearch,
    userStatus,
    recipeSearch,
  ]);

  const fetchDashboardStats = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats(); // Gunakan ini saat sudah siap
      //const data = await mockApiCall('/api/admin/dashboard'); // Temporary mock
      setDashboardStats(data);
      setError("");
    } catch (err) {
      setError("Gagal memuat statistik dashboard");
      console.error("Dashboard stats error:", err);
    }
    setLoading(false);
  };

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await api.getUsersList();
      // const params = new URLSearchParams({
      //   page: userPage.toString(),
      //   limit: "10",
      //   search: userSearch,
      //   status: userStatus,
      // });
      //const data = await mockApiCall(`/api/admin/users?${params}`); // Temporary mock
      setUsers(data.users);
      setUserPagination(data.pagination);
      setError("");
    } catch (err) {
      setError("Gagal memuat data pengguna");
      console.error("Users fetch error:", err);
    }
    setLoading(false);
  };

  const fetchRecipes = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await api.getRecipesList({
        // Gunakan ini saat sudah siap
        page: recipePage,
        limit: 10,
        search: recipeSearch,
      });
      // const params = new URLSearchParams({
      //   page: recipePage.toString(),
      //   limit: "10",
      //   search: recipeSearch,
      // });
      // const data = await mockApiCall(`/api/admin/recipes?${params}`); // Temporary mock
      setRecipes(data.recipes);
      setRecipePagination(data.pagination);
      setError("");
    } catch (err) {
      setError("Gagal memuat data resep");
      console.error("Recipes fetch error:", err);
    }
    setLoading(false);
  };

  const handleUpdateUserVerification = async (
    userId: string,
    isVerified: boolean,
  ): Promise<void> => {
    try {
      await api.updateUserVerification(userId, { isVerified }); // Gunakan ini saat sudah siap
      //await mockApiCall(`/api/admin/users/${userId}/verify`, {
      //   method: "PATCH",
      //   body: { isVerified },
      // }); // Temporary mock
      setSuccess(
        `Pengguna berhasil ${isVerified ? "diverifikasi" : "dibatalkan verifikasinya"}`,
      );
      fetchUsers();
    } catch (err) {
      setError("Gagal memperbarui status verifikasi");
      console.error("Update verification error:", err);
    }
  };

  const handleUpdateUserAdminStatus = async (
    userId: string,
    isAdmin: boolean,
  ): Promise<void> => {
    try {
      await api.updateUserAdminStatus(userId, { isAdmin }); // Gunakan ini saat sudah siap
      // await mockApiCall(`/api/admin/users/${userId}/admin`, {
      //   method: "PATCH",
      //   body: { isAdmin },
      // }); // Temporary mock
      setSuccess(
        `Pengguna berhasil ${isAdmin ? "dipromosikan menjadi" : "diturunkan dari"} admin`,
      );
      fetchUsers();
    } catch (err) {
      setError("Gagal memperbarui status admin");
      console.error("Update admin status error:", err);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?"))
      return;

    try {
      await api.deleteUser(userId); // Gunakan ini saat sudah siap
      // await mockApiCall(`/api/admin/users/${userId}`, { method: "DELETE" }); // Temporary mock
      setSuccess("Pengguna berhasil dihapus");
      fetchUsers();
    } catch (err) {
      setError("Gagal menghapus pengguna");
      console.error("Delete user error:", err);
    }
  };

  const handleDeleteRecipe = async (recipeId: string): Promise<void> => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus resep ini?")) return;

    try {
      await api.deleteRecipeAdmin(recipeId); // Gunakan ini saat sudah siap
      // await mockApiCall(`/api/admin/recipes/${recipeId}`, { method: "DELETE" }); // Temporary mock
      setSuccess("Resep berhasil dihapus");
      fetchRecipes();
    } catch (err) {
      setError("Gagal menghapus resep");
      console.error("Delete recipe error:", err);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.createAdminAccount(adminForm); // Gunakan ini saat sudah siap
      // await mockApiCall("/api/admin/users/create-admin", {
      //   method: "POST",
      //   body: adminForm,
      // }); // Temporary mock
      setSuccess("Admin berhasil dibuat");
      setShowCreateAdminModal(false);
      setAdminForm({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });
      fetchUsers();
    } catch (err) {
      setError("Gagal membuat admin");
      console.error("Create admin error:", err);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, icon: Icon, color }) => (
    <div
      className={`bg-gradient-to-r ${color} rounded-xl p-6 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-blue-200" />
      </div>
    </div>
  );

  const Badge: React.FC<{
    children: React.ReactNode;
    variant?: "success" | "warning" | "danger" | "info" | "default";
  }> = ({ children, variant = "default" }) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      danger: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
      default: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
      >
        {children}
      </span>
    );
  };

  function handleLogout(): void {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Title & Icon */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full shadow-inner">
                <ShieldUser className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide">
                Hai Admin
              </h1>
            </div>

            {/* Logout Button with Icon */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
          <p className="text-blue-100 mt-2 text-sm">
            Kelola pengguna dan resep dengan mudah
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === "dashboard"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-blue-50 shadow"
            }`}
          >
            <Activity className="h-5 w-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection("users")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === "users"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-blue-50 shadow"
            }`}
          >
            <Users className="h-5 w-5" />
            Pengguna
          </button>
          <button
            onClick={() => setActiveSection("recipes")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === "recipes"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-blue-50 shadow"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            Resep
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Memuat statistik...</p>
              </div>
            ) : (
              dashboardStats && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Total Pengguna"
                      value={dashboardStats.stats.totalUsers}
                      icon={Users}
                      color="from-blue-600 to-blue-700"
                    />
                    <StatCard
                      title="Total Resep"
                      value={dashboardStats.stats.totalRecipes}
                      icon={BookOpen}
                      color="from-cyan-600 to-cyan-700"
                    />
                    <StatCard
                      title="Pengguna Terverifikasi"
                      value={dashboardStats.stats.verifiedUsers}
                      icon={ShieldCheck}
                      color="from-green-600 to-green-700"
                    />
                    <StatCard
                      title="Admin"
                      value={dashboardStats.stats.adminUsers}
                      icon={Shield}
                      color="from-purple-600 to-purple-700"
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Pengguna Terbaru
                      </h3>
                      <div className="space-y-4">
                        {dashboardStats.recent.users.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                @{user.username}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {user.isVerified && (
                                <Badge variant="success">Terverifikasi</Badge>
                              )}
                              {user.isAdmin && (
                                <Badge variant="info">Admin</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Resep Terbaru
                      </h3>
                      <div className="space-y-4">
                        {dashboardStats.recent.recipes.map((recipe) => (
                          <div
                            key={recipe._id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <p className="font-medium text-gray-800">
                              {recipe.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              oleh {recipe.userId.firstName}{" "}
                              {recipe.userId.lastName}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                Manajemen Pengguna
              </h2>
              <button
                onClick={() => setShowCreateAdminModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                Buat Admin
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={userStatus}
                onChange={(e) => setUserStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="verified">Terverifikasi</option>
                <option value="unverified">Belum Terverifikasi</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Memuat data pengguna...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Nama
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          @{user.username}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {user.isVerified ? (
                              <Badge variant="success">Terverifikasi</Badge>
                            ) : (
                              <Badge variant="warning">
                                Belum Terverifikasi
                              </Badge>
                            )}
                            {user.isAdmin && (
                              <Badge variant="info">Admin</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleUpdateUserVerification(
                                  user._id,
                                  !user.isVerified,
                                )
                              }
                              className={`p-1 rounded ${
                                user.isVerified
                                  ? "text-yellow-600 hover:bg-yellow-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                user.isVerified
                                  ? "Batalkan Verifikasi"
                                  : "Verifikasi"
                              }
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateUserAdminStatus(
                                  user._id,
                                  !user.isAdmin,
                                )
                              }
                              className={`p-1 rounded ${
                                user.isAdmin
                                  ? "text-orange-600 hover:bg-orange-50"
                                  : "text-blue-600 hover:bg-blue-50"
                              }`}
                              title={
                                user.isAdmin
                                  ? "Turunkan dari Admin"
                                  : "Jadikan Admin"
                              }
                            >
                              <Shield className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {userPagination.pages && userPagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setUserPage((prev) => Math.max(prev - 1, 1))}
                  disabled={userPage === 1}
                  className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Halaman {userPage} dari {userPagination.pages || 0}
                </span>
                <button
                  onClick={() =>
                    setUserPage((prev) =>
                      Math.min(prev + 1, userPagination.pages || 1),
                    )
                  }
                  disabled={userPage === (userPagination.pages || 1)}
                  className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recipes Section */}
        {activeSection === "recipes" && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Manajemen Resep
            </h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari resep..."
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Recipes Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Memuat data resep...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Judul
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Deskripsi
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Penulis
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recipes.map((recipe) => (
                      <tr key={recipe._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">
                            {recipe.title}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-600 text-sm truncate max-w-xs">
                            {recipe.description}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-gray-800">
                              {recipe.userId.firstName} {recipe.userId.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              @{recipe.userId.username}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {recipe.created_at
                            ? new Date(recipe.created_at).toLocaleDateString(
                                "id-ID",
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteRecipe(recipe._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Hapus Resep"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {recipePagination.pages && recipePagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setRecipePage((prev) => Math.max(prev - 1, 1))}
                  disabled={recipePage === 1}
                  className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Halaman {recipePage} dari {recipePagination.pages || 0}
                </span>
                <button
                  onClick={() =>
                    setRecipePage((prev) =>
                      Math.min(prev + 1, recipePagination.pages || 1),
                    )
                  }
                  disabled={recipePage === (recipePagination.pages || 1)}
                  className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Buat Admin Baru
              </h3>
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Depan
                </label>
                <input
                  type="text"
                  value={adminForm.firstName}
                  onChange={(e) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Belakang
                </label>
                <input
                  type="text"
                  value={adminForm.lastName}
                  onChange={(e) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={adminForm.username}
                  onChange={(e) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) =>
                    setAdminForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAdminModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Buat Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
