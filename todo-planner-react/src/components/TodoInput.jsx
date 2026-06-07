import { useState } from "react";

function TodoInput({ onAddTodo, setMessage }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const text = inputValue.trim();

    if (!text) {
      setMessage("할 일을 입력해주세요.");
      return;
    }

    onAddTodo(text);
    setInputValue("");
    setMessage("");
  };

  return (
    <div className="flex gap-3 mb-6">
      <input
        type="text"
        value={inputValue}
        placeholder="할 일을 입력하세요"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAdd();
          }
        }}
        className="
          flex-1
          border
          border-gray-300
          rounded-lg
          px-4
          py-3
          focus:outline-none
          focus:ring-2
          focus:ring-[#672be0]
          focus:border-[#672be0]
        "
      />

      <button
        onClick={handleAdd}
        className="
          bg-[#672be0]
          text-white
          px-6
          py-3
          rounded-xl
          hover:opacity-90
          transition
        "
      >
        추가
      </button>
    </div>
  );
}

export default TodoInput;
