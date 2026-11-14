const test = require("node:test");
const assert = require("node:assert/strict");
const { validateTask } = require("../controllers/taskController");

const validTask = {
  title: "Plan the week",
  description: "Review priorities.",
  category: "Personal",
  priority: "High",
  dueDate: "2027-01-18",
  status: "Pending",
};

test("accepts a complete task with an empty optional due date", () => {
  assert.deepEqual(validateTask({ ...validTask, dueDate: "" }), []);
});

test("rejects a blank title and unsupported enum values", () => {
  const errors = validateTask({
    ...validTask,
    title: "   ",
    category: "Home",
    priority: "Urgent",
    status: "Blocked",
  });

  assert.equal(errors.length, 4);
  assert.ok(errors.some((error) => error.includes("Title is required")));
});

test("rejects impossible dates and overlong titles", () => {
  const errors = validateTask({
    ...validTask,
    title: "x".repeat(121),
    dueDate: "2027-02-30",
  });

  assert.equal(errors.length, 2);
  assert.ok(errors.some((error) => error.includes("120 characters")));
  assert.ok(errors.some((error) => error.includes("valid date")));
});
