import { displayTasks } from "@/feature/taskSlice";
import { useAppSelector } from "@/store";

const HomePage = () => {
  const tasks = useAppSelector(displayTasks); // ✅ ruft die selektierten Tasks aus dem State
  console.log("tasks", tasks);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Willkommen auf der Startseite</h1>
      <div className="bg-gray-100 shadow-lg p-6 rounded-lg w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Deine Aufgaben:</h2>
        <ul className="list-disc pl-5">
          {tasks.map((task) => (
            <li key={task.id} className="mb-2">
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
