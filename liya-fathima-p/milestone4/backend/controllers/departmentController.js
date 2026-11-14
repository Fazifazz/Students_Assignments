
const { readData, writeData } = require("../utils/fileHandler");
const generateId = require("../utils/generateId");

function getDepartments(req, res) {
  const departments = readData("departments.json");

  res.status(200).json({
    success: true,
    departments
  });
}

function createDepartment(req, res) {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Department name is required"
    });
  }

  const departments = readData("departments.json");

  if (departments.some(
    (item) => item.name.toLowerCase() === name.trim().toLowerCase()
  )) {
    return res.status(409).json({
      success: false,
      message: "Department already exists"
    });
  }

  const department = {
    id: generateId("DEP"),
    name: name.trim(),
    description: description || ""
  };

  departments.push(department);
  writeData("departments.json", departments);

  res.status(201).json({
    success: true,
    message: "Department created successfully",
    department
  });
}

function updateDepartment(req, res) {
  const { name, description } = req.body;
  const departments = readData("departments.json");

  const department = departments.find(
    (item) => item.id === req.params.id
  );

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found"
    });
  }

  if (name) department.name = name.trim();
  if (description !== undefined) department.description = description;

  writeData("departments.json", departments);

  res.status(200).json({
    success: true,
    message: "Department updated successfully",
    department
  });
}

function deleteDepartment(req, res) {
  const departments = readData("departments.json");
  const department = departments.find(
    (item) => item.id === req.params.id
  );

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found"
    });
  }

  const complaints = readData("complaints.json");
  const isAssigned = complaints.some(
    (item) => item.departmentId === department.id
  );

  if (isAssigned) {
    return res.status(400).json({
      success: false,
      message: "This department is assigned to complaints and cannot be deleted"
    });
  }

  writeData(
    "departments.json",
    departments.filter((item) => item.id !== req.params.id)
  );

  res.status(200).json({
    success: true,
    message: "Department deleted successfully"
  });
}

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
