
const fs = require("fs");
const path = require("path");

function getFilePath(fileName) {
  return path.join(__dirname, "..", "data", fileName);
}

function readData(fileName) {
  const filePath = getFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
  }

  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content || "[]");
}

function writeData(fileName, data) {
  const filePath = getFilePath(fileName);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

module.exports = { readData, writeData };
