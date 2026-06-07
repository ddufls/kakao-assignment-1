function WeekDayCard({ date, selectedDate, setSelectedDate, todoItems }) {
  const dateString = date.toISOString().split("T")[0];
  const todayString = new Date().toISOString().split("T")[0];
  const currentDayTodos = todoItems.filter((todo) => todo.date === dateString);
  const totalCount = currentDayTodos.length;
  const remainingCount = currentDayTodos.filter((todo) => !todo.completed,).length;

  return (
    <div
      onClick={() => setSelectedDate(date)}
      className={`
        cursor-pointer
        rounded-xl
        p-3
        border
        text-center
        hover:shadow-md
        transition
        ${
          dateString === selectedDate.toISOString().split("T")[0]
            ? "bg-[#672be0] text-white"
            : "bg-white"
        }
        ${dateString === todayString ? "border-[#672be0]" : "border-gray-200"}
      `}
    >
      <div className="text-sm font-medium mb-1">
        {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
      </div>

      <div className="text-lg font-bold">{date.getDate()}</div>

      <div
        className={`text-sm mt-1 ${
          totalCount > 0 && remainingCount === 0 ? "text-[#27ae60]" : ""
        }`}
      >
        {totalCount > 0 && remainingCount === 0
          ? "✓ 완료"
          : `${remainingCount} / ${totalCount}`}
      </div>
    </div>
  );
}

export default WeekDayCard;
