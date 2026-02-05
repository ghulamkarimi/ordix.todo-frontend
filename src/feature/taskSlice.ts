import { ITask } from "@/interface";
import { getTasks } from "@/service";
import { RootState } from "@/store";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { userLogoutApi } from "@/feature/userSlice"; // Importiere userLogoutApi

export interface ITaskState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface TaskError {
  error: string;
}

const taskAdapter = createEntityAdapter<ITask, number>({
  selectId: (task) => task.id,
});

export const getTasksApi = createAsyncThunk<
  ITask[], // Rückgabetyp im Erfolgsfall
  void, // Argumenttyp
  { rejectValue: TaskError } // Typ für rejectWithValue
>("task/getTasksApi", async (_, { rejectWithValue }) => {
  try {
    const response: ITask[] = await getTasks();
    console.log("API Response:", response);
    return response;
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    if (error.response) {
      return rejectWithValue(error.response.data);
    } else if (error.request) {
      return rejectWithValue({
        error: "Netzwerkfehler: Server nicht erreichbar",
      });
    } else {
      return rejectWithValue({ error: error.message });
    }
  }
});

const initialState: ITaskState & EntityState<ITask, number> =
  taskAdapter.getInitialState({
    status: "idle",
    error: null,
  });

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    resetTasks: (state) => {
      taskAdapter.removeAll(state);
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksApi.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTasksApi.fulfilled, (state, action) => {
        console.log("Tasks Payload:", action.payload);
        taskAdapter.setAll(state, action.payload);
        state.status = "succeeded";
      })
      .addCase(getTasksApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error ?? "Unbekannter Fehler";
        console.log("❌ getTasksApi Fehlschlag:", action.payload);
      })
      // Tasks zurücksetzen, wenn der Benutzer ausgeloggt wird
      .addCase(userLogoutApi.fulfilled, (state) => {
        taskAdapter.removeAll(state);
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { resetTasks } = taskSlice.actions;
export const { selectAll: displayTasks, selectById: displayTaskById } =
  taskAdapter.getSelectors((state: RootState) => state.task);
export default taskSlice.reducer;
