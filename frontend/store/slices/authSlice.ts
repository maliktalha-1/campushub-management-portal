import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Role = "student" | "faculty" | "admin" | "ADMIN" | "FACULTY" | "STUDENT" | null;

interface User {
  id?: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const normalizeRole = (role: Role): Role => {
  if (!role) return null;
  return role.toLowerCase() as Role;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      const user = {
        ...action.payload,
        role: normalizeRole(action.payload.role),
      };

      state.isAuthenticated = true;
      state.user = user;

      if (typeof window !== "undefined") {
        localStorage.setItem("campushub_user", JSON.stringify(user));
      }
    },

    restoreUser: (state, action: PayloadAction<User>) => {
      const user = {
        ...action.payload,
        role: normalizeRole(action.payload.role),
      };

      state.isAuthenticated = true;
      state.user = user;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("campushub_user");
        localStorage.removeItem("campushub_token");
        localStorage.removeItem("pendingUser");
      }
    },
  },
});

export const { login, restoreUser, logout } = authSlice.actions;
export default authSlice.reducer;