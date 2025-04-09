import { displayTasks } from "@/feature/taskSlice";
import { useAppSelector } from "@/store";

const HomePage = () => {
  const tasks = useAppSelector(displayTasks); // ✅ ruft die selektierten Tasks aus dem State
  console.log("tasks", tasks);

  return (
    <div>
      homepage
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
