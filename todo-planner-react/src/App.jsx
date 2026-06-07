import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterButtons from "./components/FilterButtons";
import WeekView from "./components/WeekView";

const STORAGE_KEY = "todoItems";

function App() {
  const [todoItems, setTodoItems] = useState(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);

    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [message, setMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : new Date();
  });
  const [currentWeekDate, setCurrentWeekDate] = useState(() => {
    const savedWeekDate = localStorage.getItem("currentWeekDate");
    return savedWeekDate ? new Date(savedWeekDate) : new Date();
  });


  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("currentWeekDate", currentWeekDate.toISOString());
  }, [currentWeekDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
  }, [todoItems]);

  const getMonday = (date) => {
    const copiedDate = new Date(date);
    const day = copiedDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    copiedDate.setDate(copiedDate.getDate() + diff);

    return copiedDate;
  };

  const monday = getMonday(currentWeekDate);
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }

  const addTodo = (text) => {
    setTodoItems([...todoItems, {
        id: Date.now(),
        text,
        completed: false,
        date: selectedDate.toISOString().split("T")[0],
      },
    ]);
  };

  const deleteTodo = (id) => {setTodoItems(todoItems.filter((todo) => todo.id !== id));};

  const toggleTodo = (id) => {
    setTodoItems(
      todoItems.map((todo) =>
        todo.id === id
          ? {...todo, completed: !todo.completed,}
          : todo,
      ),
    );
  };

  const editTodo = (id, text) => {
    setTodoItems(todoItems.map((todo) => (todo.id === id ? { ...todo, text } : todo)),);
  };

  const visibleTodos = todoItems.filter((todo) => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    if (todo.date !== selectedDateString) {return false;}
    if (currentFilter === "active") {return !todo.completed;}
    if (currentFilter === "completed") {return todo.completed;}

    return true;
  });
  const selectedDateString = selectedDate.toISOString().split("T")[0];

  const currentDateTodos = todoItems.filter((todo) => todo.date === selectedDateString,);
  const totalCount = currentDateTodos.length;
  const activeCount = currentDateTodos.filter((todo) => !todo.completed).length;
  const completedCount = currentDateTodos.filter(
    (todo) => todo.completed,
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div
        className="
      max-w-4xl
      mx-auto
      bg-white
      rounded-2xl
      border
      border-gray-200
      shadow-sm
      p-8
    "
      >
        <h1 className="text-4xl font-bold text-[#672be0] mb-8 text-center">
          Todo List
        </h1>

        <WeekView
          weekDates={weekDates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          todoItems={todoItems}
          currentWeekDate={currentWeekDate}
          setCurrentWeekDate={setCurrentWeekDate}
        />
        <TodoInput onAddTodo={addTodo} setMessage={setMessage} />

        <p className="text-red-500 mt-2">{message}</p>

        <FilterButtons
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          totalCount={totalCount}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        <TodoList
          todoItems={visibleTodos}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
          onEdit={editTodo}
        />
      </div>
    </div>
  );
}

export default App;