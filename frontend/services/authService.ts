import API from "./api";

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const response = await API.post("/auth/login", data);
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await API.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: {
    token: string;
    newPassword: string;
  }) => {
    const response = await API.post("/auth/reset-password", data);
    return response.data;
  },
};