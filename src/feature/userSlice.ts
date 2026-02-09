import { IUser, TUser } from "@/interface";
import type { AxiosError } from "axios";
import {
  getCurrentUser,
  getUsers,
  requestPasswordReset,
  userLogin,
  userLogout,
  userRegister,
  verifyResetCode,
  resetPassword,
} from "@/service";
import { RootState } from "@/store";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";

export interface IUserState {
  status: "idle" | "loading" | "succeeded" | "failed";
  user: TUser | null;
  error: string | null;
}

const userAdapter = createEntityAdapter<IUser, number>({
  selectId: (user) => user.id,
});

// Bestehende Thunks
export const getUsersApi = createAsyncThunk(
  "user/getUsersApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsers();
      console.log("users", response.data);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

export const userRegisterApi = createAsyncThunk(
  "user/register",
  async (user: TUser, { rejectWithValue }) => {
    try {
      const response = await userRegister(user);
      return { user: response.data, message: response.data.message };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

export const userLoginApi = createAsyncThunk<
  { user: IUser; message: string }, // Hier stand vorher 'unknown', jetzt 'IUser'
  TUser,
  { rejectValue: string }
>("user/login", async (user, { rejectWithValue }) => {
  try {
    const response = await userLogin(user);
    // Wir geben das User-Objekt explizit als IUser zurück
    return { 
      user: response.data.user as IUser, 
      message: response.data.message 
    };
  } catch (error: unknown) {
    const err = error as AxiosError<{ error?: string }>;
    return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
  }
});

export const requestPasswordResetApi = createAsyncThunk(
  "user/requestPasswordResetApi",
  async (user: TUser, { rejectWithValue }) => {
    try {
      const response = await requestPasswordReset(user);
      console.log("requestPasswordResetApi", response.data);
      return { message: response.data.message };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

export const verifyResetCodeApi = createAsyncThunk(
  "user/verifyResetCode",
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await verifyResetCode({ email, code });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

export const resetPasswordApi = createAsyncThunk(
  "user/resetPassword",
  async (
    {
      email,
      code,
      newPassword,
    }: { email: string; code: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await resetPassword({ email, code, newPassword });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

export const checkSessionAPi = createAsyncThunk(
  "user/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data.user;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

export const getCurrentUserApi = createAsyncThunk(
  "user/getCurrentUserApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data.user;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

export const userLogoutApi = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userLogout();
      return { message: response.data.message };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;

      return rejectWithValue(err.response?.data?.error ?? "Unbekannter Fehler");
    }
  },
);

const initialState: IUserState & EntityState<IUser, number> =
  userAdapter.getInitialState({
    status: "idle",
    error: null,
    user: null,
  });

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userRegisterApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userRegisterApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user as IUser;
      })
      .addCase(userRegisterApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })
      .addCase(userLoginApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user as IUser;
        state.error = null;
      })
      .addCase(getCurrentUserApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getCurrentUserApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })
      .addCase(checkSessionAPi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(checkSessionAPi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
        localStorage.removeItem("userId");
      })
      .addCase(userLogoutApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userLogoutApi.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.error = null;
        localStorage.removeItem("userId");
      })
      .addCase(userLogoutApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })
      // Fehlende extraReducers hinzufügen
      .addCase(requestPasswordResetApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestPasswordResetApi.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(requestPasswordResetApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error";
      })
      .addCase(verifyResetCodeApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyResetCodeApi.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(verifyResetCodeApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error";
      })
      .addCase(resetPasswordApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordApi.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(resetPasswordApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error";
      });
  },
});

export const { selectAll: displayUsers, selectById: displayUserById } =
  userAdapter.getSelectors((state: RootState) => state.user);
export const selectUser = (state: RootState) => state.user.user;
export const selectedIsAuthenticated = (state: RootState) => !!state.user.user;

export default userSlice.reducer;
