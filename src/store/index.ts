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

// Tasks und Lists nur laden, wenn der Benutzer eingeloggt ist
store.dispatch(getCurrentUserApi()).unwrap().then(() => {
    console.log("Benutzer eingeloggt, lade Tasks und Lists...");
    store.dispatch(getTasksApi());
    store.dispatch(getListsApi());
}).catch((err: any) => {
    console.error("Fehler beim Abrufen des aktuellen Benutzers:", err);
});

// store.dispatch(getTasksApi())
// store.dispatch(getListsApi())



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;