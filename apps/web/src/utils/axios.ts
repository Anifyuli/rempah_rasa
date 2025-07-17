import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api", // sesuaikan dengan backend-mu
  withCredentials: false, // ubah jika pakai cookies/session
});

export default instance;
