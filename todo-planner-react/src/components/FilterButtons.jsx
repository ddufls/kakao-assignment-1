function FilterButtons({
  currentFilter,
  setCurrentFilter,
  totalCount,
  activeCount,
  completedCount,
}) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setCurrentFilter("all")}
        className={`px-4 py-2 rounded-lg ${
          currentFilter === "all"
            ? "bg-[#672be0] text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        전체 ({totalCount})
      </button>

      <button
        onClick={() => setCurrentFilter("active")}
        className={`px-4 py-2 rounded-lg ${
          currentFilter === "active"
            ? "bg-[#672be0] text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        진행 중 ({activeCount})
      </button>

      <button
        onClick={() => setCurrentFilter("completed")}
        className={`px-4 py-2 rounded-lg ${
          currentFilter === "completed"
            ? "bg-[#672be0] text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        완료 ({completedCount})
      </button>
    </div>
  );
}

export default FilterButtons;
