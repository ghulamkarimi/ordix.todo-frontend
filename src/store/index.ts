import { configureStore } from "@reduxjs/toolkit";
import userReducer, { getCurrentUserApi, getUsersApi } from "../feature/userSlice"
import taskReducer, { getTasksApi } from "../feature/taskSlice";
import listReducer, { getListsApi } from "../feature/listSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import appreducer from "../feature/appSlice";


export const store = configureStore({
    reducer:{
        user: userReducer,
        task: taskReducer,
        list: listReducer,
        app:appreducer
    }
})

store.dispatch(getUsersApi())
store.dispatch(getTasksApi())
store.dispatch(getListsApi())
store.dispatch(getCurrentUserApi())


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;