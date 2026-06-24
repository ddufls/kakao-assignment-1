import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filter = searchParams.get("filter");
  const search = searchParams.get("search");

  const params = new URLSearchParams();

  if (filter) params.set("filter", filter);
  if (search) params.set("search", search);

  const url =
    params.toString().length > 0
      ? `${BACKEND_URL}/todos?${params.toString()}`
      : `${BACKEND_URL}/todos`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/todos/${body.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: body.text,
      completed: body.completed,
      date: body.date,
    }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/todos/${body.id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  return NextResponse.json(data);
}