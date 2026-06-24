"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditTodoPage() {
  const router = useRouter();

  const [text, setText] = useState("Todo 수정");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const todoId = Number(
      window.location.pathname.split("/").pop()
    );

    fetch("/api/todos")
      .then((res) => res.json())
      .then((todos) => {
        const todo = todos.find(
          (t: {
            id: number;
            text: string;
            completed: boolean;
          }) => t.id === todoId
        );

        if (todo) {
          setText(todo.text);
          setCompleted(todo.completed);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f4eff8] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-[30px] shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#672be0] text-center mb-8">
          Todo 수정
        </h1>

        <div className="space-y-6">
          <div>
            <p className="text-[#4c1d95] font-semibold mb-2">
              제목
            </p>

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border-2 border-[#d7c8ff] rounded-full px-4 py-3 text-gray-800"
            />
          </div>

          <label className="flex items-center gap-3 bg-[#f6f1ff] p-4 rounded-xl text-gray-800">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) =>
                setCompleted(e.target.checked)
              }
            />
            완료됨
          </label>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                const id = Number(
                  window.location.pathname
                    .split("/")
                    .pop()
                );

                if (!id) return;

                const res = await fetch("/api/todos");
                const todos = await res.json();

                const current = todos.find(
                  (t: { id: number }) =>
                    t.id === id
                );

                await fetch("/api/todos", {
                  method: "PUT",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    id,
                    text,
                    completed,
                    date: current.date,
                  }),
                });

                router.push("/todos");
                router.refresh();
              }}
              className="flex-1 bg-[#672be0] text-white py-3 rounded-full"
            >
              저장
            </button>

            <button
              onClick={() =>
                router.push("/todos")
              }
              className="flex-1 bg-[#ece4ff] text-gray-800 py-3 rounded-full"
            >
              취소
            </button>

            <button
              onClick={async () => {
                const id = Number(
                  window.location.pathname
                    .split("/")
                    .pop()
                );

                if (!id) return;

                const ok = confirm(
                  "삭제하시겠습니까?"
                );

                if (!ok) return;

                await fetch("/api/todos", {
                  method: "DELETE",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    id,
                  }),
                });

                router.push("/todos");
                router.refresh();
              }}
              className="px-5 border border-red-300 text-red-500 rounded-full"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}