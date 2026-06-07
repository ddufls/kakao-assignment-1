import { useState } from "react";

function TodoItem({ todo, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (!editText.trim()) {
      return;
    }
    onEdit(todo.id, editText);
    setIsEditing(false);
  };
  return (
    <li
      className="
        bg-white
        rounded-xl
        border
        border-gray-200
        p-4
        flex
        justify-between
        items-center
        mb-3
        shadow-sm
        hover:shadow-md
        transition"
    >
      {isEditing ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            className="
                flex-1
                border
                border-[#672be0]
                rounded-lg
                px-3
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-[#672be0]
                "
          />

          <div className="flex gap-2 ml-4">
            <button
              onClick={handleSave}
              className="px-3 py-2 rounded-lg bg-[#672be0] text-white">
              저장
            </button>

            <button
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
              className="
                px-3
                py-2
                rounded-lg
                bg-gray-500
                text-white
                "
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <span
            className={`flex-1 text-lg
            ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}
            `}
          >
            {todo.text}
          </span>

          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onToggle(todo.id)}
              className={`
                px-3
                py-2
                rounded-lg
                text-white
                ${todo.completed ? "bg-gray-400" : "bg-[#672be0]"}
              `}
            >
              {todo.completed ? "취소" : "완료"}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="
                px-3
                py-2
                rounded-lg
                bg-gray-100
                text-gray-700
                border
                border-gray-200
                "
            >
              수정
            </button>

            <button
              onClick={() => onDelete(todo.id)}
              className="
                px-3
                py-2
                rounded-lg
                bg-red-500
                text-white
              "
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
