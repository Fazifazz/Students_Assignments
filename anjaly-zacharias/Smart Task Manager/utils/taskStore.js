const fs = require("node:fs/promises");

async function readTasks(filePath) {
  const contents = await fs.readFile(filePath, "utf8");
  const tasks = JSON.parse(contents);

  if (!Array.isArray(tasks)) {
    throw new TypeError("Task data must be a JSON array.");
  }

  return tasks;
}

async function writeTasks(filePath, tasks) {
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(tasks, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, filePath);
}

module.exports = { readTasks, writeTasks };
