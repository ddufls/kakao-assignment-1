import WeekDayCard from "./WeekDayCard";

function WeekView({
  weekDates,
  selectedDate,
  setSelectedDate,
  todoItems,
  currentWeekDate,
  setCurrentWeekDate,
}) {
  const monday = weekDates[0];
  const sunday = weekDates[6];

  const weekRange = `${monday.getFullYear()}-${String(monday.getMonth() + 1,)
    .padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}~
    ${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2,"0",)}
    -${String(sunday.getDate()).padStart(2, "0")}`;
  const moveWeek = (days) => {
    const newDate = new Date(currentWeekDate);
    newDate.setDate(newDate.getDate() + days);

    setCurrentWeekDate(newDate);
  };

  return (
    <>
      <div className="mb-2">
        <button
          onClick={() => {
            const today = new Date();

            setCurrentWeekDate(today);
            setSelectedDate(today);
          }}
          className="
            px-2
            py-0.5
            text-xs
            rounded-md
            border
            border-[#672be0]
            text-[#672be0]
          "
        >
          오늘
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => moveWeek(-7)}
          className="text-[#672be0] font-bold text-xl"
        >
          ◀
        </button>

        <div className="font-semibold text-gray-500">{weekRange}</div>

        <button
          onClick={() => moveWeek(7)}
          className="text-[#672be0] font-bold text-xl"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-8">
        {weekDates.map((date) => (
          <WeekDayCard
            key={date.toISOString()}
            date={date}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            todoItems={todoItems}
          />
        ))}
      </div>
    </>
  );
}

export default WeekView;
