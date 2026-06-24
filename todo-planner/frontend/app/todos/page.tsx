import { getTodos } from "../actions";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    search?: string;
  }>;
}

export default async function TodosPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const filter = params.filter;
  const search = params.search;

  const todos: Todo[] = await getTodos(filter, search);

  return (
    <div className="min-h-screen bg-[#f4eff8] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-[30px] shadow-lg p-8">
        <h1 className="text-3xl font-bold italic text-[#672be0] text-center mb-2">
          Todo List
        </h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          {new Date().toLocaleDateString("ko-KR")}
        </p>

        {/* WeekView 느낌 */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
            <div
              key={day}
              className="bg-[#f1ebf7] rounded-xl py-3 text-center"
            >
              <p className="text-xs text-[#4c1d95] font-semibold">
                {day}
              </p>
            </div>
          ))}
        </div>

        <AddTodoForm />

        {/* 검색 */}
        <form className="flex gap-2 mb-6">
          <input
            type="text"
            name="search"
            placeholder="검색어를 입력하세요"
            defaultValue={search}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-gray-800"
          />

          {filter && (
            <input
              type="hidden"
              name="filter"
              value={filter}
            />
          )}

          <button
            type="submit"
            className="bg-[#672be0] text-white px-5 py-2 rounded-full"
          >
            검색
          </button>
        </form>

        {/* 필터 */}
        <div className="flex gap-3 mb-8">
          <a
            href={`/todos${search ? `?search=${search}` : ""}`}
            className={`flex-1 text-center py-2 rounded-full ${
              !filter
                ? "bg-[#672be0] text-white"
                : "bg-[#e7e0f6] text-[#672be0]"
            }`}
          >
            전체
          </a>

          <a
            href={`/todos?filter=active${
              search ? `&search=${search}` : ""
            }`}
            className={`flex-1 text-center py-2 rounded-full ${
              filter === "active"
                ? "bg-[#672be0] text-white"
                : "bg-[#e7e0f6] text-[#672be0]"
            }`}
          >
            진행 중
          </a>

          <a
            href={`/todos?filter=completed${
              search ? `&search=${search}` : ""
            }`}
            className={`flex-1 text-center py-2 rounded-full ${
              filter === "completed"
                ? "bg-[#672be0] text-white"
                : "bg-[#e7e0f6] text-[#672be0]"
            }`}
          >
            완료
          </a>
        </div>

        {/* 목록 */}
        {todos.length === 0 ? (
          <p className="text-center text-gray-600 py-10">
            할 일이 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
                <TodoItem
                key={todo.id}
                todo={todo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}