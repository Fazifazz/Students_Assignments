const { randomUUID } = require("node:crypto");
const path = require("node:path");
const { readTasks, writeTasks } = require("../utils/taskStore");

const DATA_FILE = path.join(__dirname, "..", "data", "tasks.json");
const CATEGORIES = new Set(["Personal", "Study", "Work", "Other"]);
const PRIORITIES = new Set(["Low", "Medium", "High"]);
const STATUSES = new Set(["Pending", "In Progress", "Completed"]);
const editableFields = [
  "title",
  "description",
  "category",
  "priority",
  "dueDate",
  "status",
];

function validateTask(task) {
  const errors = [];

  if (typeof task.title !== "string" || task.title.trim().length === 0) {
    errors.push("Title is required.");
  } else if (task.title.trim().length > 120) {
    errors.push("Title must be 120 characters or fewer.");
  }

  if (typeof task.description !== "string") {
    errors.push("Description must be a string.");
  } else if (task.description.length > 2000) {
    errors.push("Description must be 2000 characters or fewer.");
  }

  if (!CATEGORIES.has(task.category)) {
    errors.push("Category must be Personal, Study, Work, or Other.");
  }

  if (!PRIORITIES.has(task.priority)) {
    errors.push("Priority must be Low, Medium, or High.");
  }

  if (!STATUSES.has(task.status)) {
    errors.push("Status must be Pending, In Progress, or Completed.");
  }

  if (
    typeof task.dueDate !== "string" ||
    (task.dueDate !== "" &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ||
        Number.isNaN(Date.parse(`${task.dueDate}T00:00:00Z`)) ||
        new Date(`${task.dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== task.dueDate))
  ) {
    errors.push("Due date must be a valid date in YYYY-MM-DD format or empty.");
  }

  return errors;
}

function sendServerError(response, error) {
  console.error(error);
  return response.status(500).json({ error: "Unable to access task data." });
}

async function getTasks(request, response) {
  try {
    const tasks = await readTasks(DATA_FILE);
    return response.status(200).json(tasks);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function getTask(request, response) {
  try {
    const tasks = await readTasks(DATA_FILE);
    const task = tasks.find((item) => item.id === request.params.id);

    if (!task) {
      return response.status(404).json({ error: "Task not found." });
    }

    return response.status(200).json(task);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function createTask(request, response) {
  const errors = validateTask(request.body ?? {});
  if (errors.length > 0) {
    return response.status(400).json({ error: "Invalid task data.", details: errors });
  }

  try {
    const tasks = await readTasks(DATA_FILE);
    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      title: request.body.title.trim(),
      description: request.body.description.trim(),
      category: request.body.category,
      priority: request.body.priority,
      dueDate: request.body.dueDate,
      status: request.body.status,
      createdAt: now,
      updatedAt: now,
    };

    tasks.unshift(task);
    await writeTasks(DATA_FILE, tasks);
    return response.status(201).json(task);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function updateTask(request, response) {
  const unknownFields = Object.keys(request.body ?? {}).filter(
    (field) => !editableFields.includes(field),
  );
  if (unknownFields.length > 0) {
    return response.status(400).json({
      error: "Invalid task data.",
      details: [`Unsupported field(s): ${unknownFields.join(", ")}.`],
    });
  }

  try {
    const tasks = await readTasks(DATA_FILE);
    const taskIndex = tasks.findIndex((item) => item.id === request.params.id);

    if (taskIndex === -1) {
      return response.status(404).json({ error: "Task not found." });
    }

    const updatedTask = { ...tasks[taskIndex], ...(request.body ?? {}) };
    const errors = validateTask(updatedTask);
    if (errors.length > 0) {
      return response.status(400).json({ error: "Invalid task data.", details: errors });
    }

    updatedTask.title = updatedTask.title.trim();
    updatedTask.description = updatedTask.description.trim();
    updatedTask.updatedAt = new Date().toISOString();
    tasks[taskIndex] = updatedTask;

    await writeTasks(DATA_FILE, tasks);
    return response.status(200).json(updatedTask);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function deleteTask(request, response) {
  try {
    const tasks = await readTasks(DATA_FILE);
    const taskIndex = tasks.findIndex((item) => item.id === request.params.id);

    if (taskIndex === -1) {
      return response.status(404).json({ error: "Task not found." });
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);
    await writeTasks(DATA_FILE, tasks);
    return response.status(200).json({ message: "Task deleted.", task: deletedTask });
  } catch (error) {
    return sendServerError(response, error);
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, validateTask };
