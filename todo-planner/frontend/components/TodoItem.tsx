"use client";

import { useRouter } from "next/navigation";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

export default function TodoItem({
  todo,
}: {
  todo: Todo;
}) {
  const router = useRouter();

  async function handleToggle() {
    await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed,
      }),
    });

    router.refresh();
  }

  async function handleDelete() {
    const ok = confirm("정말 삭제하시겠습니까?");

    if (!ok) return;

    await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: todo.id,
      }),
    });

    router.refresh();
  }

  return (
    <div className="bg-[#f6f1ff] rounded-xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className={`w-5 h-5 rounded-full border-2 border-[#672be0] ${
            todo.completed ? "bg-[#672be0]" : "bg-white"
          }`}
        />

        <p
          className={
            todo.completed
              ? "line-through text-gray-500"
              : "text-gray-800"
          }
        >
          {todo.text}
        </p>
      </div>

      <div className="flex gap-2">
        <a
          href={`/todos/${todo.id}`}
          className="px-3 h-7 rounded-full border flex items-center justify-center text-xs text-[#4c1d95]"
        >
          수정
        </a>

        <button
          onClick={handleDelete}
          className="w-7 h-7 rounded-full border flex items-center justify-center text-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}