import { IList } from "@/interface";
import { getLists } from "@/service";
import { RootState } from "@/store";
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";

export interface IListState {
    status: "idle" | "loading" | "succeeded" | "failed";
    list: IList | null;
    error: string | null;
}

const listAdapter = createEntityAdapter<IList, number>({
    selectId: (list) => list.id,
    sortComparer: (a, b) => a.createdAt.toISOString().localeCompare(b.createdAt.toISOString()),
})


export const  getListsApi = createAsyncThunk(
    "list/getListsApi",
    async () => {
        try {
            const response = await getLists();
            console.log("list",response.data)
            return response.data; // Assuming the API returns an array of lists
         
        } catch (error) {
            console.error("Error fetching lists:", error);
            throw error; // Rethrow the error to be handled in the slice
        }
    }
)

 const initialState: IListState & EntityState<IList, number>=
 listAdapter.getInitialState({
    status: "idle",
    list: null,
    error: null,
 })

 const listSlice = createSlice({
    name: "list",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getListsApi.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getListsApi.fulfilled, (state, action) => {
                state.status = "succeeded";
                listAdapter.setAll(action.payload, state);
            })
            .addCase(getListsApi.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Unknown error occurred";
            });
    },

 })


 export const { selectAll: displayLists, selectById: displayListById } = listAdapter.getSelectors((state: RootState) => state.list)
 export default listSlice.reducer