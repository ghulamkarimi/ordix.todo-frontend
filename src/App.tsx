import Sidebar from "./components/menu/Sidebar";
import { Outlet } from "react-router-dom";
import { checkSessionAPi, getCurrentUserApi } from "./feature/userSlice";
import { useEffect } from "react";
import { AppDispatch } from "./store";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkSessionAPi());
  }, []);

  useEffect(() => {
    dispatch(getCurrentUserApi());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
