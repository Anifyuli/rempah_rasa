import {
  Edit2,
  Lock,
  Mail,
  Save,
  ShieldUser,
  User,
  UserRound,
  UserRoundCheck,
  Users,
  UserSquare,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

export default function UserProfile() {
  const { getProfile, updateProfile, updatePassword } = useApi();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changing, setChanging] = useState(false);

  // ----------------------------
  // Ambil profil user
  // ----------------------------
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (data?.user) {
        setUser(data.user);
        setEditForm({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          username: data.user.username || "",
          email: data.user.email || "",
        });
      } else {
        console.warn("Response getProfile tidak ada user");
      }
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
      alert("Gagal mengambil profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ----------------------------
  // Handle Edit & Save
  // ----------------------------
  const handleSave = async () => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      alert("Nama depan dan nama belakang harus diisi!");
      return;
    }

    try {
      await updateProfile(editForm);
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Gagal update profil:", err);
      alert("Gagal update profil.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // ----------------------------
  // Handle Password Change
  // ----------------------------
  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Password baru dan konfirmasi tidak sama!");
      return;
    }
    try {
      setChanging(true);
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: ""
      });
      alert("Password berhasil diubah");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Gagal mengganti password", err);
      alert("Gagal mengganti password");
    } finally {
      setChanging(false);
    }
  };

  // ----------------------------
  // Render
  // ----------------------------
  if (loading) return <div className="p-8 text-center">Memuat profil...</div>;
  if (!user) return <div className="p-8 text-center">Profil tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-lg">
              <UserSquare className="w-18 h-18 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-emerald-50 mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-emerald-100 text-lg">@{user.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Informasi Profil</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-full px-6 py-3 hover:scale-105 transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500 text-white rounded-full px-6 py-3 hover:scale-105 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Simpan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-500 text-white rounded-full px-6 py-3 hover:scale-105 transition-all"
                  >
                    <X className="w-5 h-5" />
                    Batal
                  </button>
                </div>
              )}
            </div>

            {/* Informasi Profil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nama Depan */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Nama Depan
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-xl text-gray-800 font-medium">
                    {user.firstName}
                  </div>
                )}
              </div>

              {/* Nama Belakang */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Nama Belakang
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-xl text-gray-800 font-medium">
                    {user.lastName}
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Username
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-xl text-gray-800 font-medium">
                  @{user.username}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-xl text-gray-800 font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  {user.email}
                </div>
              </div>
            </div>

            {/* Status Akun */}
            <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status Akun</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Verifikasi Email */}
                <div className="flex items-center gap-3">
                  {user.isVerified ? (
                    <UserRoundCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <UserRound className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-gray-700 font-medium">
                    {user.isVerified ? "Email Terverifikasi" : "Email Belum Terverifikasi"}
                  </span>
                </div>

                {/* Hak Akses */}
                <div className="flex items-center gap-3">
                  {user.isAdmin ? (
                    <ShieldUser className="w-5 h-5 text-purple-500" />
                  ) : (
                    <Users className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-gray-700 font-medium">
                    {user.isAdmin ? "Administrator" : "Pengguna Biasa"}
                  </span>
                </div>

                {/* Akun Aktif */}
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 font-medium">Akun Aktif</span>
                </div>
              </div>
            </div>

            {/* Tombol Ganti Password */}
            <div className="mt-8">
              <button
                onClick={() => setShowPasswordForm((prev) => !prev)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-full px-6 py-3 hover:scale-105 transition-all"
              >
                <Lock className="w-5 h-5" />
                {showPasswordForm ? "Tutup Ganti Kata Sandi" : "Ganti Kata Sandi"}
              </button>
            </div>

            {/* Form Ganti Password */}
            {showPasswordForm && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-600" /> Ganti Kata Sandi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Password lama"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="password"
                    placeholder="Password baru"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="password"
                    placeholder="Konfirmasi password baru"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={handleUpdatePassword}
                  disabled={changing}
                  className="mt-4 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-full px-6 py-3 hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {changing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            )}

            {/* User ID */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  User ID
                </span>
                <span className="text-sm text-gray-500 font-mono">{user._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
