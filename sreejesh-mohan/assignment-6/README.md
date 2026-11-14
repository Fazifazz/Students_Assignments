# Assignment 6: Build a Notes REST API with Node.js & Express

A structured RESTful API for managing notes built with **Node.js** and **Express**, featuring in-memory data storage, route-controller separation, and full CRUD operations.

---

## 📁 Project Structure

```text
assignment-6/
├── controllers/
│   └── noteController.js   # Handles business logic for notes CRUD operations
├── routes/
│   └── noteRoutes.js       # Express router defining endpoints
├── .env                    # Environment variables (PORT, NODE_ENV)
├── .env.example            # Environment template for version control
├── .gitignore              # Ignores node_modules and .env
├── index.js                # Server entry point, middleware, and route mounting
├── package.json            # Project dependencies and npm scripts
└── README.md               # Documentation and Postman testing guide
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16 or higher)
- npm

### 2. Installation
Open your terminal in the project directory and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create or verify your `.env` file (copied from `.env.example`):
```env
PORT=3000
NODE_ENV=development
```

### 4. Running the Server
- **Production mode**:
  ```bash
  npm start
  ```
- **Development mode** (auto-restarts with nodemon):
  ```bash
  npm run dev
  ```

The server starts at `http://localhost:3000`.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/notes` | Fetch all notes (starts with 3 pre-loaded notes) | `200 OK` |
| **GET** | `/api/notes/:id` | Fetch a single note by ID (or 404 if not found) | `200 OK` / `404 Not Found` |
| **POST** | `/api/notes` | Create a new note (`title`, `content`, `category`) | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/notes/:id` | Update an existing note by ID | `200 OK` / `404 Not Found` |
| **DELETE**| `/api/notes/:id` | Delete a note by ID | `200 OK` / `404 Not Found` |

---

## 🧪 Postman Testing & Screenshot Guide

Use Postman or Thunder Client to test all 5 endpoints and take screenshots for your submission.

### 1. GET All Notes
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/notes`
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Learn Node.js Core Modules",
      "content": "Explore built-in modules like fs, path, events, and http.",
      "category": "Study"
    },
    {
      "id": 2,
      "title": "Master Async JavaScript",
      "content": "Understand callbacks, promises, and async/await in Node.js.",
      "category": "Study"
    },
    {
      "id": 3,
      "title": "Build REST API with Express",
      "content": "Implement routes, controllers, and test endpoints in Postman.",
      "category": "Project"
    }
  ]
}
```
📸 *Capture screenshot showing status 200 OK and response body.*

---

### 2. GET Note by ID
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/notes/1`
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Learn Node.js Core Modules",
    "content": "Explore built-in modules like fs, path, events, and http.",
    "category": "Study"
  }
}
```
*(Also test `http://localhost:3000/api/notes/999` to verify 404 Not Found handling)*

📸 *Capture screenshot showing status 200 OK and response body.*

---

### 3. POST Create Note
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/notes`
- **Headers**: `Content-Type: application/json`
- **Body** (`raw` -> `JSON`):
```json
{
  "title": "Database Integration with MongoDB",
  "content": "Connect Express app to MongoDB and use Mongoose schemas.",
  "category": "Backend"
}
```
- **Expected Status**: `201 Created`
- **Expected Response**:
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 1712345678901,
    "title": "Database Integration with MongoDB",
    "content": "Connect Express app to MongoDB and use Mongoose schemas.",
    "category": "Backend"
  }
}
```
📸 *Capture screenshot showing status 201 Created, request body, and response body.*

---

### 4. PUT Update Note
- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/notes/1`
- **Headers**: `Content-Type: application/json`
- **Body** (`raw` -> `JSON`):
```json
{
  "title": "Learn Node.js Core Modules (Updated)",
  "content": "Deep dive into fs, path, events, http, and streams.",
  "category": "Advanced Study"
}
```
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": 1,
    "title": "Learn Node.js Core Modules (Updated)",
    "content": "Deep dive into fs, path, events, http, and streams.",
    "category": "Advanced Study"
  }
}
```
*(Also test `http://localhost:3000/api/notes/999` to verify 404 Not Found handling)*

📸 *Capture screenshot showing status 200 OK, request body, and updated response body.*

---

### 5. DELETE Note
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/notes/2`
- **Expected Status**: `200 OK`
- **Expected Response**:
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 2,
    "title": "Master Async JavaScript",
    "content": "Understand callbacks, promises, and async/await in Node.js.",
    "category": "Study"
  }
}
```
*(Also test `http://localhost:3000/api/notes/999` to verify 404 Not Found handling)*

📸 *Capture screenshot showing status 200 OK and deleted note response.*

---

## 📝 Assignment Submission Checklist
- [x] Node.js & Express project created with `express.json()` middleware
- [x] Clear modular structure: `routes/noteRoutes.js`, `controllers/noteController.js`, `index.js`
- [x] In-memory store with at least 3 initial notes
- [x] Unique ID generation via `Date.now()` on POST
- [x] 404 error handling for missing note IDs
- [x] All 5 endpoints tested in Postman
- [ ] Push repository to GitHub
- [ ] Prepare Google Doc with Name, Batch Code, Assignment Details, GitHub Link, and Postman Screenshots (Set permission to "Anyone with the link can view")
