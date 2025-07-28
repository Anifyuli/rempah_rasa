# 🌶️ Rempah Rasa Project

**Rempah Rasa** adalah platform blog tentang makanan dan resep andalan, dibangun dengan **MERN Stack**:  
**MongoDB**, **ExpressJS**, **React**, dan **NodeJS**.

---

## 📂 Struktur Direktori

```plaintext
apps/
├── api    # Backend ReST API (Express + MongoDB)
└── web    # Frontend (React + Vite)
````

---

## 🔧 Teknologi Utama

* **Backend**: ExpressJS, MongoDB, JWT Authentication
* **Frontend**: React, Vite, TypeScript, Tailwind CSS
* **Monorepo Tools**: Yarn Workspaces
* **Lainnya**: SWC untuk optimasi build, ESLint, Prettier

---

## 🚀 Cara Menjalankan Proyek

1. **Clone repository ini:**

  ```bash
  git clone https://github.com/username/rempah_rasa.git
   cd rempah_rasa
  ```

2. **Install dependencies untuk seluruh workspace:**

  ```bash
  yarn install
  ```

3. **Jalankan Web Frontend:**

  ```bash
  yarn workspace web dev
  ```

4. **Jalankan Backend API:**

  ```bash
  yarn workspace api dev
  ```

---

## 📌 Rencana Pengembangan

* [ ] Notifikasi admin dari pengguna.
* [ ] Penghitung views pada resep.
* [ ] Refactoring struktur backend dan frontend.
* [ ] Konfigurasi `.env` untuk keamanan.

---

## ✨ Kontribusi

Kontribusi terbuka untuk siapa saja.

* **Fork**, buat branch (`git checkout -b fitur-baru`),
* **Commit**, lalu ajukan **pull request**.

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [Apache 2.0 License](LICENSE).

> 💡 **Rempah Rasa** — tempat berbagi resep favorit dengan sentuhan teknologi modern!
