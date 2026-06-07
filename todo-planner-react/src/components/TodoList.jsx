import TodoItem from "./TodoItem";

function TodoList({ todoItems, onDelete, onToggle, onEdit }) {
  if (todoItems.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        등록된 할 일이 없습니다.
      </div>
    );
  }

  return (
    <ul>
      {todoItems.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
