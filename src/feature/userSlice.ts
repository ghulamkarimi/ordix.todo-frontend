import { IUser, TUser } from "@/interface";
import { getCurrentUser, getUsers, userLogin, userLogout, userRegister } from "@/service";
import { RootState } from "@/store";
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
 


export interface IUserState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    user: TUser | null;
    error: string | null;
}

const userAdapter = createEntityAdapter<IUser, number>({
    selectId: (user) => user.id,
})

export const getUsersApi = createAsyncThunk(
    'user/getUsersApi',
    async () => {
        try {
            const response = await getUsers();
            console.log("users", response.data)
            return response.data; // Assuming the API returns an array of users
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error; // Rethrow the error to be handled in the slice

        }
    }
)


export const userRegisterApi = createAsyncThunk(
    'user/register',
    async (user: TUser, { rejectWithValue }) => {
        try {
            const response = await userRegister(user);
            return {
                user: response.data,
                message: response.data.message,
            };
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error); // genaue Backend-Meldung
            }
            return rejectWithValue("Unbekannter Fehler");
        }
    }
);


export const userLoginApi = createAsyncThunk(
    'user/login',
    async (user: TUser, { rejectWithValue }) => {
        try {
            const response = await userLogin(user);

            return {
                user: response.data.user,
                message: response.data.message,
            };
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error); // genaue Backend-Meldung
            }
            return rejectWithValue("Unbekannter Fehler");
        }
    }
);

export const checkSessionAPi = createAsyncThunk(
    "user/checkSession",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser()
            return response.data.user; // Assuming the API returns the current user
        } catch (error: any) {
            ;

            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error); // genaue Backend-Meldung
            }
            return rejectWithValue("Unbekannter Fehler");
        }
    }
)


export const getCurrentUserApi = createAsyncThunk(
    'user/getCurrentUserApi',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();
            return response.data.user; // Assuming the API returns the current user
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error); // genaue Backend-Meldung
            }
            return rejectWithValue("Unbekannter Fehler");
        }
    }
)


export const userLogoutApi = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userLogout();
            return {
                message: response.data.message,
            };
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                return rejectWithValue(error.response.data.error); // genaue Backend-Meldung
            }
            return rejectWithValue("Unbekannter Fehler");
        }
    }
)

const initialState: IUserState & EntityState<IUser, number> =
    userAdapter.getInitialState({
        status: 'idle',
        error: null,
        user: null,
    })

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userRegisterApi.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userRegisterApi.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
            })
            .addCase(userRegisterApi.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Unknown error";
            }).
            addCase(userLoginApi.fulfilled, (state, action)=> {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(getCurrentUserApi.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            }).
            addCase(getCurrentUserApi.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Unknown error"
            })
            .addCase(checkSessionAPi.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(userLogoutApi.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userLogoutApi.fulfilled, (state) => {
                state.status = "succeeded";
                state.user = null;
                state.error = null;
                localStorage.removeItem('userId');
            }).
            addCase(checkSessionAPi.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Unknown error";
                localStorage.removeItem('userId');
             
            }
            )
    }
});


export const { selectAll: displayUsers, selectById: displayUserById } = userAdapter.getSelectors((state: RootState) => state.user)
export const selectUser = (state: RootState) => state.user.user;
export const selectedIsAuthenticated = (state: RootState) => !!state.user.user;

export default userSlice.reducer;

