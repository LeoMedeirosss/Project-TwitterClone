// Slice responsible for managing authentication state (Redux)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: null | { id: number; username: string; email: string };
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

// Creates a Redux "slice" for authentication
const authSlice = createSlice({
  name: "auth", // Name of the slice (used in Redux store)
  initialState,
  reducers: {
    // Called when a user logs in successfully
    // Stores both the user info and the authentication token in the state
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // Called when a user logs out
    // Clears the stored user and token, returning to the initial state
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
