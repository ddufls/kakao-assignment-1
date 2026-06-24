"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTodoForm() {
  const [text, setText] = useState("");
  const router = useRouter();

  async function handleAdd() {
    if (!text.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        completed: false,
        date: today,
      }),
    });

    setText("");
    router.refresh();
  }

  return (
    <div className="flex gap-2 mb-6">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
        className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-gray-800"
      />

      <button
        onClick={handleAdd}
        className="bg-[#672be0] text-white px-5 py-2 rounded-xl"
      >
        추가
      </button>
    </div>
  );
}