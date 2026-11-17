const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "..", "uploads");
const acceptedTypes = {
  "image/jpeg": { extension: ".jpg", signature: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  "image/png": { extension: ".png", signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/webp": { extension: ".webp", signature: (buffer) => buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" },
  "application/pdf": { extension: ".pdf", signature: (buffer) => buffer.toString("ascii", 0, 5) === "%PDF-" }
};

function removeFiles(files = []) {
  files.forEach((file) => {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdirSync(uploadDirectory, { recursive: true });
      callback(null, uploadDirectory);
    },
    filename: (req, file, callback) => {
      const type = acceptedTypes[file.mimetype];
      callback(null, `${crypto.randomBytes(16).toString("hex")}${type.extension}`);
    }
  }),
  limits: {
    files: 5,
    fileSize: 8 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const type = acceptedTypes[file.mimetype];
    const extension = path.extname(file.originalname).toLowerCase();
    if (!type || extension !== type.extension) {
      return callback(new Error("Upload up to 5 JPG, PNG, WEBP or PDF files."));
    }
    callback(null, true);
  }
});

function uploadAttachments(req, res, next) {
  upload.array("attachments", 5)(req, res, (error) => {
    if (error) {
      removeFiles(req.files);
      const message = error.code === "LIMIT_FILE_SIZE"
        ? "Each attachment must be 8 MB or smaller."
        : error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE"
          ? "You can upload up to 5 attachments."
          : error.message;
      return res.status(400).json({ success: false, message });
    }

    const invalidFile = (req.files || []).find((file) => {
      const type = acceptedTypes[file.mimetype];
      const signature = fs.readFileSync(file.path).subarray(0, 12);
      return !type.signature(signature);
    });

    if (invalidFile) {
      removeFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "An attachment's content does not match its file type."
      });
    }

    next();
  });
}

module.exports = { uploadAttachments, removeFiles, uploadDirectory };
