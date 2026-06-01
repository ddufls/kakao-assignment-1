const STORAGE_KEY = "todoItems";

/* DOM */
const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodoButton");
const todoList = document.getElementById("todoList");
const messageText = document.getElementById("messageText");

const weekView = document.getElementById("weekView");
const weekRangeText = document.getElementById("weekRangeText");
const previousWeekButton = document.getElementById("previousWeekButton");
const nextWeekButton = document.getElementById("nextWeekButton");
const filterButtons = document.querySelectorAll(".filter-button");

/* 상태 */
let todoItems = [];
let currentFilter = "all";
let selectedDate = new Date();
let currentWeekDate = new Date();

/* LocalStorage */
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
}

function loadTodos() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        todoItems = JSON.parse(savedData);
    }
}

/* 날짜 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getMonday(date) {
    const copiedDate = new Date(date);

    const day = copiedDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    copiedDate.setDate(copiedDate.getDate() + diff);

    return copiedDate;
}

function getWeekDates() {
    const monday = getMonday(currentWeekDate);

    const dates = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);

        date.setDate(monday.getDate() + i);
        dates.push(date);
    }

    return dates;
}

/* 주간뷰 */
function renderWeekView() {
    weekView.innerHTML = "";

    const weekDates = getWeekDates();
    const monday = weekDates[0];
    const sunday = weekDates[6];

    weekRangeText.textContent = `${formatDate(monday)} ~ ${formatDate(sunday)}`;

    const todayString = formatDate(new Date());

    weekDates.forEach((date) => {
        const dateString = formatDate(date);

        const currentDayTodos = todoItems.filter(
            (todo) => todo.date === dateString
        );

        const totalCount = currentDayTodos.length;

        const remainingCount =
            currentDayTodos.filter(
                (todo) => !todo.completed
            ).length;

        let progressText = "";

        if (totalCount > 0 && remainingCount === 0) {
            progressText = '<span class="completed-day">✓ 완료</span>';
        } else {
            progressText = `${remainingCount} / ${totalCount}`;
        }

        const dayCard = document.createElement("div");

        dayCard.classList.add("day-card");

        if (dateString === formatDate(selectedDate)) {
            dayCard.classList.add("selected-day");
        }

        if (dateString === todayString) {
            dayCard.classList.add("today");
        }

        dayCard.innerHTML = `
            <div class="day-name">
                ${["일","월","화","수","목","금","토"][date.getDay()]}
            </div>

            <div class="day-date">
                ${date.getMonth() + 1}월 ${date.getDate()}일
            </div>

            <div class="todo-progress">
                ${progressText}
            </div>
        `;

        dayCard.addEventListener(
            "click",
            () => {
                selectedDate = new Date(date);

                updateScreen();
            }
        );

        weekView.appendChild(dayCard);
    });
}

/* 메시지 */
function showMessage(message) {
    messageText.textContent = message;
}

/* 필터 */
function getVisibleTodos() {
    const selectedDateString = formatDate(selectedDate);

    return todoItems.filter(
        (todo) => {
            if (todo.date !== selectedDateString) {
                return false;
            }

            if (currentFilter === "active") {
                return !todo.completed;
            }

            if (currentFilter === "completed") {
                return todo.completed;
            }

            return true;
        }
    );
}

/* Todo 렌더 */
function renderTodoList() {
    todoList.innerHTML = "";

    const visibleTodos = getVisibleTodos();

    if (visibleTodos.length === 0) {
        todoList.innerHTML ='<li class="empty-message">등록된 할 일이 없습니다.</li>';

        updateFilterCounts();
        return;
    }

    visibleTodos.forEach(
        (todoItem) => {
            const index = todoItems.indexOf(todoItem);
            const item = document.createElement("li");

            item.classList.add("todo-item");

            const text = document.createElement("span");

            text.classList.add("todo-content");

            text.textContent = todoItem.text;

            if (todoItem.completed) {
                text.classList.add("completed");
            }

            const actions = document.createElement("div");

            actions.classList.add("todo-actions");

            actions.innerHTML = `
                <button class="action-button edit-button">
                    수정
                </button>

                <button class="action-button ${
                    todoItem.completed
                        ? "undo-button"
                        : "complete-button"
                }">
                    ${
                        todoItem.completed
                            ? "취소"
                            : "완료"
                    }
                </button>

                <button class="action-button delete-button">
                    삭제
                </button>
            `;

            actions.children[0].onclick = () => editTodo(index);
            actions.children[1].onclick = () => toggleTodoComplete(index);
            actions.children[2].onclick = () => deleteTodo(index);

            item.append(text, actions);

            todoList.appendChild(item);
        }
    );
    updateFilterCounts();
}

function updateScreen() {
    renderWeekView();
    renderTodoList();
}

/* CRUD */
function addTodo() {
    const text = todoInput.value.trim();

    if (!text) {
        showMessage("할 일을 입력해주세요.");
        return;
    }

    todoItems.push({
        text,
        completed: false,
        date: formatDate(selectedDate)
    });

    saveTodos();
    todoInput.value = "";
    updateScreen();
}

function editTodo(index) {
    const text = prompt("수정", todoItems[index].text);

    if (text === null || !text.trim()) {
        return;
    }

    todoItems[index].text = text.trim();

    saveTodos();
    updateScreen();
}

function toggleTodoComplete(index) {
    todoItems[index].completed = !todoItems[index].completed;

    saveTodos();
    updateScreen();
}

function deleteTodo(index) {
    todoItems.splice(index, 1);

    saveTodos();
    updateScreen();
}

/* 필터 이벤트 */

filterButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                currentFilter = button.dataset.filter;

                filterButtons.forEach(
                    (btn) => btn.classList.remove("active-filter")
                );

                button.classList.add("active-filter");

                renderTodoList();
            }
        );
    }
);

/**
 * 필터별 Todo 개수 표시
 */
function updateFilterCounts() {
    const selectedDateString = formatDate(selectedDate);

    const currentDateTodos = todoItems.filter(
        (todo) => todo.date === selectedDateString
    );

    const totalCount = currentDateTodos.length;

    const activeCount =
        currentDateTodos.filter(
            (todo) => !todo.completed
        ).length;

    const completedCount =
        currentDateTodos.filter(
            (todo) => todo.completed
        ).length;

    const allFilterButton =
        document.getElementById("allFilterButton");
    const activeFilterButton =
        document.getElementById("activeFilterButton");
    const completedFilterButton =
        document.getElementById("completedFilterButton");

    allFilterButton.textContent = `전체 (${totalCount})`;
    activeFilterButton.textContent = `진행 중 (${activeCount})`;
    completedFilterButton.textContent = `완료 (${completedCount})`;
}

/* 주 이동 */

previousWeekButton.addEventListener(
    "click",
    () => {
        currentWeekDate.setDate(currentWeekDate.getDate() - 7);
        renderWeekView();
    }
);

nextWeekButton.addEventListener(
    "click",
    () => {
        currentWeekDate.setDate(currentWeekDate.getDate() + 7);
        renderWeekView();
    }
);

addTodoButton.addEventListener("click", addTodo);

todoInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            addTodo();
        }
    }
);

/* 초기화 */

loadTodos();
updateScreen();
updateFilterCounts();