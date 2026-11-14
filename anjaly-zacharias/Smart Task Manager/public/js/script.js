const API_URL = `${window.location.protocol}//${window.location.hostname}:3001/api/tasks`;
const elements = {
  taskList: document.querySelector("#task-list"),
  dialog: document.querySelector("#task-dialog"),
  form: document.querySelector("#task-form"),
  formError: document.querySelector("#form-error"),
  search: document.querySelector("#search-input"),
  category: document.querySelector("#category-filter"),
  priority: document.querySelector("#priority-filter"),
  status: document.querySelector("#status-filter"),
  sort: document.querySelector("#sort-filter"),
  toast: document.querySelector("#toast"),
};

let tasks = [];
let selectedView = "all";
let toastTimer;

function localDateString(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${value}T00:00:00`));
}

function showToast(message, isError = false) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle("is-error", isError);
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 3200);
}

async function request(path = "", options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(payload.details) ? ` ${payload.details.join(" ")}` : "";
    throw new Error(`${payload.error || "The request failed."}${details}`);
  }
  return payload;
}

async function loadTasks(successMessage) {
  elements.taskList.innerHTML = '<div class="loading-state">Loading your tasks<span class="loading-dots">...</span></div>';
  try {
    tasks = await request();
    render();
    if (successMessage) showToast(successMessage);
  } catch (error) {
    elements.taskList.replaceChildren();
    const message = document.createElement("p");
    message.className = "error-state";
    message.textContent = error.message;
    elements.taskList.append(message);
    showToast(error.message, true);
  }
}

function taskCounts() {
  const today = localDateString();
  return tasks.reduce((counts, task) => {
    counts.total += 1;
    if (task.status === "Pending") counts.pending += 1;
    if (task.status === "In Progress") counts.progress += 1;
    if (task.status === "Completed") counts.completed += 1;
    if (task.status !== "Completed" && task.dueDate && task.dueDate < today) counts.overdue += 1;
    return counts;
  }, { total: 0, pending: 0, progress: 0, completed: 0, overdue: 0 });
}

function updateDashboard() {
  const counts = taskCounts();
  const percentage = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  document.querySelector("#stat-total").textContent = counts.total;
  document.querySelector("#stat-pending").textContent = counts.pending;
  document.querySelector("#stat-progress").textContent = counts.progress;
  document.querySelector("#stat-completed").textContent = counts.completed;
  document.querySelector("#stat-overdue").textContent = counts.overdue;
  document.querySelector("#nav-total").textContent = counts.total;
  document.querySelector("#nav-pending").textContent = counts.pending;
  document.querySelector("#nav-progress").textContent = counts.progress;
  document.querySelector("#nav-completed").textContent = counts.completed;
  document.querySelector("#completion-rate").textContent = `${percentage}%`;
  document.querySelector("#progress-fill").style.width = `${percentage}%`;
  document.querySelector("#progress-bar").setAttribute("aria-valuenow", String(percentage));
  document.querySelector("#progress-subtitle").textContent = counts.total
    ? `${counts.completed} of ${counts.total} ${counts.total === 1 ? "task" : "tasks"} complete. Keep it up!`
    : "A good day starts with one small step.";
}

function visibleTasks() {
  const query = elements.search.value.trim().toLocaleLowerCase();
  const filtered = tasks.filter((task) => {
    return (!selectedView || selectedView === "all" || task.status === selectedView)
      && (!query || task.title.toLocaleLowerCase().includes(query))
      && (!elements.category.value || task.category === elements.category.value)
      && (!elements.priority.value || task.priority === elements.priority.value)
      && (!elements.status.value || task.status === elements.status.value);
  });

  return filtered.sort((first, second) => {
    const firstDate = first.dueDate || (elements.sort.value === "asc" ? "9999-12-31" : "0000-01-01");
    const secondDate = second.dueDate || (elements.sort.value === "asc" ? "9999-12-31" : "0000-01-01");
    return elements.sort.value === "asc"
      ? firstDate.localeCompare(secondDate)
      : secondDate.localeCompare(firstDate);
  });
}

function makeCell(label, value, className) {
  const cell = document.createElement("div");
  cell.className = `task-cell ${className}`;
  const caption = document.createElement("span");
  caption.className = "cell-label";
  caption.textContent = label;
  const content = document.createElement("span");
  content.textContent = value;
  cell.append(caption, content);
  return { cell, content };
}

function createTaskRow(task) {
  const row = document.createElement("article");
  row.className = "task-row";

  const main = document.createElement("div");
  main.className = "task-main";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = task.status === "Completed";
  checkbox.setAttribute("aria-label", `Mark ${task.title} ${checkbox.checked ? "incomplete" : "complete"}`);
  checkbox.addEventListener("change", () => updateTaskStatus(task, checkbox.checked));
  const copy = document.createElement("div");
  copy.style.minWidth = "0";
  const title = document.createElement("p");
  title.className = `task-title${task.status === "Completed" ? " is-completed" : ""}`;
  title.textContent = task.title;
  const description = document.createElement("p");
  description.className = "task-description";
  description.textContent = task.description || "No description";
  copy.append(title, description);
  main.append(checkbox, copy);

  const category = makeCell("Category", task.category, "category-cell");
  category.content.className = "category-tag";

  const priority = makeCell("Priority", task.priority, "priority-cell");
  priority.content.className = `priority-tag priority-${task.priority.toLowerCase()}`;

  const due = makeCell("Due date", formatDate(task.dueDate), "due-cell");
  due.content.className = "due-date";
  if (task.dueDate && task.dueDate < localDateString() && task.status !== "Completed") {
    due.content.classList.add("is-overdue");
    due.content.textContent += " · Overdue";
  }

  const status = makeCell("Status", task.status, "status-cell");
  status.content.className = `status-badge status-${task.status === "In Progress" ? "progress" : task.status.toLowerCase()}`;

  const actions = document.createElement("div");
  actions.className = "task-actions";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "icon-button";
  edit.setAttribute("aria-label", `Edit ${task.title}`);
  edit.title = "Edit task";
  edit.textContent = "✎";
  edit.addEventListener("click", () => openEditDialog(task.id));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "icon-button delete-button";
  remove.setAttribute("aria-label", `Delete ${task.title}`);
  remove.title = "Delete task";
  remove.textContent = "⌫";
  remove.addEventListener("click", () => deleteTask(task));
  actions.append(edit, remove);
  row.append(main, category.cell, priority.cell, due.cell, status.cell, actions);
  return row;
}

function render() {
  updateDashboard();
  const filteredTasks = visibleTasks();
  document.querySelector("#visible-count").textContent = filteredTasks.length;
  elements.taskList.replaceChildren();

  if (filteredTasks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const heading = document.createElement("strong");
    const description = document.createElement("span");
    const hasFilters = elements.search.value || elements.category.value || elements.priority.value
      || elements.status.value || selectedView !== "all";
    heading.textContent = hasFilters ? "No tasks match those filters" : "A clear space to begin";
    description.textContent = hasFilters
      ? "Try changing your search or filters."
      : "Add a task to turn your plans into progress.";
    empty.append(heading, description);
    if (!hasFilters) {
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "button button-primary";
      addButton.textContent = "Create your first task";
      addButton.addEventListener("click", () => openCreateDialog());
      empty.append(addButton);
    }
    elements.taskList.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  filteredTasks.forEach((task) => fragment.append(createTaskRow(task)));
  elements.taskList.append(fragment);
}

function openCreateDialog() {
  elements.form.reset();
  document.querySelector("#task-id").value = "";
  document.querySelector("#dialog-title").textContent = "Create a task";
  document.querySelector("#dialog-eyebrow").textContent = "MAKE IT HAPPEN";
  document.querySelector("#save-task").textContent = "Create task";
  document.querySelector("#task-status").value = "Pending";
  elements.formError.textContent = "";
  elements.dialog.showModal();
  document.querySelector("#task-title").focus();
}

async function openEditDialog(id) {
  try {
    const task = await request(`/${encodeURIComponent(id)}`);
    document.querySelector("#task-id").value = task.id;
    document.querySelector("#task-title").value = task.title;
    document.querySelector("#task-description").value = task.description;
    document.querySelector("#task-category").value = task.category;
    document.querySelector("#task-priority").value = task.priority;
    document.querySelector("#task-due-date").value = task.dueDate;
    document.querySelector("#task-status").value = task.status;
    document.querySelector("#dialog-title").textContent = "Edit task";
    document.querySelector("#dialog-eyebrow").textContent = "KEEP IT MOVING";
    document.querySelector("#save-task").textContent = "Save changes";
    elements.formError.textContent = "";
    elements.dialog.showModal();
    document.querySelector("#task-title").focus();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function saveTask(event) {
  event.preventDefault();
  if (!elements.form.reportValidity()) return;

  const id = document.querySelector("#task-id").value;
  const taskData = {
    title: document.querySelector("#task-title").value.trim(),
    description: document.querySelector("#task-description").value.trim(),
    category: document.querySelector("#task-category").value,
    priority: document.querySelector("#task-priority").value,
    dueDate: document.querySelector("#task-due-date").value,
    status: document.querySelector("#task-status").value,
  };
  if (!taskData.title) {
    elements.formError.textContent = "Please enter a task title.";
    return;
  }

  const saveButton = document.querySelector("#save-task");
  saveButton.disabled = true;
  elements.formError.textContent = "";
  try {
    await request(id ? `/${encodeURIComponent(id)}` : "", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(taskData),
    });
    elements.dialog.close();
    await loadTasks(id ? "Task updated successfully." : "Task created successfully.");
  } catch (error) {
    elements.formError.textContent = error.message;
  } finally {
    saveButton.disabled = false;
  }
}

async function updateTaskStatus(task, isComplete) {
  try {
    await request(`/${encodeURIComponent(task.id)}`, {
      method: "PUT",
      body: JSON.stringify({ status: isComplete ? "Completed" : "Pending" }),
    });
    await loadTasks(isComplete ? "Task marked as complete." : "Task moved back to to do.");
  } catch (error) {
    showToast(error.message, true);
    await loadTasks();
  }
}

async function deleteTask(task) {
  if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
  try {
    await request(`/${encodeURIComponent(task.id)}`, { method: "DELETE" });
    await loadTasks("Task deleted.");
  } catch (error) {
    showToast(error.message, true);
  }
}

function setView(view, navButton) {
  selectedView = view;
  document.querySelectorAll(".nav-link").forEach((button) => button.classList.remove("is-active"));
  navButton.classList.add("is-active");
  const labels = { all: "Overview", Pending: "To do", "In Progress": "In progress", Completed: "Completed" };
  document.querySelector("#page-label").textContent = labels[view];
  document.querySelector("#tasks-heading").firstChild.textContent = view === "all" ? "Your tasks " : `${labels[view]} `;
  render();
}

function initializeDates() {
  const now = new Date();
  const fullDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  }).format(now);
  const shortDate = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(now);
  document.querySelector("#today-label").textContent = fullDate;
  document.querySelector("#date-chip-text").textContent = shortDate;
}

document.querySelector("#add-task-top").addEventListener("click", openCreateDialog);
document.querySelector("#add-task-main").addEventListener("click", openCreateDialog);
document.querySelector("#close-dialog").addEventListener("click", () => elements.dialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => elements.dialog.close());
elements.form.addEventListener("submit", saveTask);
[elements.search, elements.category, elements.priority, elements.status, elements.sort]
  .forEach((control) => control.addEventListener("input", render));
document.querySelectorAll(".nav-link, .brand").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    setView(button.dataset.view || "all", button.matches(".nav-link")
      ? button
      : document.querySelector('.nav-link[data-view="all"]'));
  });
});

initializeDates();
loadTasks();
