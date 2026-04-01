import { api } from "./api";

export const authService = {

  async login(email: string, password: string) {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    return res.data;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  
};