import { displayTasks, getTasksApi } from "@/feature/taskSlice";
import { getCurrentUserApi } from "@/feature/userSlice";
import { AppDispatch, RootState } from "@/store";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
    // Tasks und Status aus dem Redux-Store abrufen
    const tasks = useSelector(displayTasks);
    const taskStatus = useSelector((state: RootState) => state.task.status);
    const taskError = useSelector((state: RootState) => state.task.error);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      if (getCurrentUserApi()) {
          dispatch(getTasksApi());
      }
  }, [getCurrentUserApi, dispatch]);

    // Lade- und Fehlerzustand behandeln
    if (taskStatus === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (taskStatus === 'failed') {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
                    <p className="font-semibold">Fehler beim Laden der Aufgaben:</p>
                    <p>{taskError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  flex flex-col items-center py-10">
            {/* Header */}
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">
         Anstehende Aufgaben
            </h1>

            {/* Aufgaben-Container */}
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-200 pb-2">
                    Deine Aufgaben
                </h2>

                {/* Falls keine Aufgaben vorhanden sind */}
                {tasks.length === 0 ? (
                    <p className="text-center text-gray-500 italic">Keine Aufgaben vorhanden.</p>
                ) : (
                    <ul className="space-y-4">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-50 transition-colors duration-200"
                            >
                                {/* Titel */}
                                <div className="text-lg font-medium text-gray-800">
                                    {task.title}
                                </div>

                                {/* Beschreibung */}
                                <div className="text-gray-600 text-sm mt-1">
                                    {task.description}
                                </div>

                                {/* Fälligkeitsdatum */}
                                <div className="text-gray-500 text-sm mt-1">
                                    <span className="font-semibold">Fällig: </span>
                                    {new Date(task.due_date).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </div>

                                {/* Status */}
                                <div className="mt-1">
                                    <span
                                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                                            task.is_completed
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                    >
                                        {task.is_completed ? "Erledigt" : "Nicht erledigt"}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HomePage;