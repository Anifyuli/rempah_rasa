# 🍳 Rempah Rasa Web API

Bagian backend dari **Rempah Rasa**, dibangun menggunakan **ExpressJS** dan **MongoDB**.  
API ini menyediakan layanan autentikasi, manajemen pengguna, dan manajemen resep.

---

## 🛠 Fitur Utama

- **Autentikasi JWT** (login, register, refresh token).
- **CRUD Resep**: Tambah, lihat, ubah, hapus.
- **Manajemen Admin & User**.
- **Dashboard Admin**: Statistik resep & pengguna.

---

## 🚀 Cara Menjalankan Backend

1. **Pindah ke folder API:**

   ```bash
   cd apps/api
  ```

2. **Copy file environment:**


   ```bash
   cp .env.example .env
   ```

   Lalu isi konfigurasi database dan secret key.

3. **Install dependencies:**

   ```bash
   yarn install
   ```

4. **Jalankan server development:**

   ```bash
   yarn dev
   ```

API berjalan di: `http://localhost:3000/api`.

---

## 📌 Rencana Pengembangan

* [ ] Penataan ulang arsitektur folder.
* [ ] Optimasi query MongoDB.
* [ ] Dokumentasi API menggunakan Swagger/OpenAPI.

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [Apache 2.0 License](../../LICENSE).

