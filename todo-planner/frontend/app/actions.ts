"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTodos(
  filter?: string,
  search?: string
) {
  const params = new URLSearchParams();

  if (filter) params.set("filter", filter);
  if (search) params.set("search", search);

  const url =
    params.toString().length > 0
      ? `${API_URL}/todos?${params.toString()}`
      : `${API_URL}/todos`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch todos");
  }

  return res.json();
}

export async function createTodo(
  text: string,
  date: string
) {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      completed: false,
      date,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create todo");
  }

  return res.json();
}

export async function updateTodo(
  id: number,
  text: string,
  completed: boolean,
  date: string
) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      completed,
      date,
    }),
  });

  return res.json();
}

export async function deleteTodo(id: number) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });

  return res.json();
}