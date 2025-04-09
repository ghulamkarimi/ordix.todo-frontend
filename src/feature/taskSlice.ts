import { ITask, TTask } from "@/interface";
import { getTasks } from "@/service";
import { RootState } from "@/store";
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";

export interface ITaskState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    tasks: TTask | null;
    error: string | null;
}

const taskAdapter = createEntityAdapter<ITask, number>({
    selectId: (task) => task.id,
    sortComparer: (a, b) => a.createdAt.toISOString().localeCompare(b.createdAt.toISOString()),

})

export const getTasksApi = createAsyncThunk(
    'task/getTasksApi',
    async () => {
        try {
            const response = await getTasks();
            console.log("tasks", response.data)
            return response.data

        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error; // Rethrow the error to be handled in the slice
        }
    }
)

const initialState: ITaskState & EntityState<ITask, number> =
    taskAdapter.getInitialState({
        status: 'idle',
        tasks: null,
        error: null,
    })

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTasksApi.pending, (state) => {
                state.status = 'loading';
            }).
            addCase(getTasksApi.fulfilled, (state, action) => {
                taskAdapter.setAll(action.payload, state);
                state.status = 'succeeded';

            })
            .addCase(getTasksApi.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Unbekannter Fehler';
                console.log("❌ getTasksApi Fehlschlag:", action.error); // Zusätzlicher Log
            });
    }
})

export const {selectAll: displayTasks, selectById: displayTaskById} = taskAdapter.getSelectors((state:RootState)=> state.task)
export default taskSlice.reducer

