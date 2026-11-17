# Notes REST API

A simple, beginner-friendly REST API for managing notes, built with **Node.js** and **Express.js**.
Notes are stored in an **in-memory array** (no database), so data resets whenever the server restarts.

## Technologies Used

- Node.js
- Express.js
- JavaScript (CommonJS modules)
- Postman (for testing)

## Project Structure

```
notes-rest-api/
├── controllers/
│   └── noteController.js   # Logic for each endpoint + in-memory notes array
├── routes/
│   └── noteRoutes.js       # Maps URLs/HTTP methods to controller functions
├── index.js                # Server entry point (middleware, routes, error handling)
├── package.json
└── README.md
```

## Installation

Prerequisite: [Node.js](https://nodejs.org) (v18 or newer) installed.

```bash
# 1. Go into the project folder
cd notes-rest-api

# 2. Install dependencies (Express)
npm install
```

### Creating the project from scratch (optional)

```bash
mkdir notes-rest-api
cd notes-rest-api
npm init -y
npm install express
mkdir controllers routes
```

Then create `index.js`, `controllers/noteController.js`, `routes/noteRoutes.js` and `README.md`.
(On Windows PowerShell: `New-Item index.js, README.md, controllers/noteController.js, routes/noteRoutes.js`.
On macOS/Linux: `touch index.js README.md controllers/noteController.js routes/noteRoutes.js`.)

## Starting the Server

```bash
npm start
```

You should see:

```
Server running at http://localhost:3000
```

Optional: `npm run dev` restarts the server automatically when you edit files (Node 18.11+).

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint         | Description            | Success Code |
|--------|------------------|------------------------|--------------|
| GET    | `/api/notes`     | Get all notes          | 200          |
| GET    | `/api/notes/:id` | Get a single note      | 200          |
| POST   | `/api/notes`     | Create a new note      | 201          |
| PUT    | `/api/notes/:id` | Update a note (partial updates allowed) | 200 |
| DELETE | `/api/notes/:id` | Delete a note          | 200          |

Error codes: **404** (note not found / unknown route), **400** (invalid or missing fields, or malformed JSON).

Three notes are pre-loaded (ids `1`, `2`, `3`). New notes get an id from `Date.now()`.

### 1. GET /api/notes

**Response — 200 OK**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Welcome to Notes API",
      "content": "This is your first pre-loaded note.",
      "category": "General",
      "createdAt": "2026-11-12T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Grocery List",
      "content": "Milk, eggs, bread, and fruits.",
      "category": "Personal",
      "createdAt": "2026-11-12T10:00:00.000Z"
    },
    {
      "id": 3,
      "title": "Study Plan",
      "content": "Revise Node.js and Express routing for 2 hours.",
      "category": "Study",
      "createdAt": "2026-11-12T10:00:00.000Z"
    }
  ]
}
```

### 2. GET /api/notes/:id

**Response — 200 OK** (`GET /api/notes/1`)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Welcome to Notes API",
    "content": "This is your first pre-loaded note.",
    "category": "General",
    "createdAt": "2026-11-12T10:00:00.000Z"
  }
}
```

**Response — 404 Not Found** (`GET /api/notes/9999`)
```json
{
  "success": false,
  "message": "Note with id 9999 not found"
}
```

### 3. POST /api/notes

`title` and `content` are required. `category` is optional (defaults to `"General"`).

**Request body**
```json
{
  "title": "My First Note",
  "content": "This is my note content",
  "category": "Personal"
}
```

**Response — 201 Created**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 1731412345678,
    "title": "My First Note",
    "content": "This is my note content",
    "category": "Personal",
    "createdAt": "2026-11-12T10:05:00.000Z"
  }
}
```

**Response — 400 Bad Request** (missing/empty title or content)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "title is required and must be a non-empty string",
    "content is required and must be a non-empty string"
  ]
}
```

### 4. PUT /api/notes/:id

Send any of `title`, `content`, `category` (at least one).

**Request body** (`PUT /api/notes/1`)
```json
{
  "title": "Updated Welcome Note"
}
```

**Response — 200 OK**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Welcome Note",
    "content": "This is your first pre-loaded note.",
    "category": "General",
    "createdAt": "2026-11-12T10:00:00.000Z",
    "updatedAt": "2026-11-12T10:10:00.000Z"
  }
}
```

**Response — 404 Not Found** (id does not exist)
```json
{
  "success": false,
  "message": "Note with id 9999 not found"
}
```

### 5. DELETE /api/notes/:id

**Response — 200 OK** (`DELETE /api/notes/2`)
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": 2,
    "title": "Grocery List",
    "content": "Milk, eggs, bread, and fruits.",
    "category": "Personal",
    "createdAt": "2026-11-12T10:00:00.000Z"
  }
}
```

**Response — 404 Not Found** (id does not exist or was already deleted)
```json
{
  "success": false,
  "message": "Note with id 2 not found"
}
```

## Postman Testing Guide

1. Start the server with `npm start` and keep that terminal open.
2. Open Postman and click **New → HTTP Request** for each test below.
3. For requests with a body (POST, PUT): open the **Body** tab, choose **raw**, and select **JSON** from the dropdown on the right. Postman then adds the header `Content-Type: application/json` automatically (check the **Headers** tab).

> Restarting the server resets the data to the 3 sample notes. Run the tests in the order below.

| # | Test | Method | URL | Body | Expected Status |
|---|------|--------|-----|------|-----------------|
| 1 | Get all notes | GET | `http://localhost:3000/api/notes` | — | **200 OK** |
| 2 | Get one note | GET | `http://localhost:3000/api/notes/1` | — | **200 OK** |
| 3 | Get invalid id | GET | `http://localhost:3000/api/notes/9999` | — | **404 Not Found** |
| 4 | Create note | POST | `http://localhost:3000/api/notes` | see below | **201 Created** |
| 5 | Create invalid note | POST | `http://localhost:3000/api/notes` | `{ "title": "" }` | **400 Bad Request** |
| 6 | Update note | PUT | `http://localhost:3000/api/notes/1` | see below | **200 OK** |
| 7 | Update invalid id | PUT | `http://localhost:3000/api/notes/9999` | `{ "title": "x" }` | **404 Not Found** |
| 8 | Delete note | DELETE | `http://localhost:3000/api/notes/2` | — | **200 OK** |
| 9 | Delete invalid id | DELETE | `http://localhost:3000/api/notes/9999` | — | **404 Not Found** |
| 10 | Verify changes | GET | `http://localhost:3000/api/notes` | — | **200 OK** |

**Headers:** GET and DELETE need none. POST and PUT need `Content-Type: application/json`.

**Test 4 body (POST):**
```json
{
  "title": "My First Note",
  "content": "This is my note content",
  "category": "Personal"
}
```

**Test 6 body (PUT):**
```json
{
  "title": "Updated Welcome Note"
}
```

The expected JSON for each test is shown in the endpoint sections above.
After test 4, note the `id` in the response; you can use it for extra GET/PUT/DELETE tests (`/api/notes/<that id>`).

### How to Take Screenshots for Submission

For each request, the screenshot must show **all three** of these at once:

1. **The request**: method, full URL, and (for POST/PUT) the Body tab with your JSON.
2. **The status code**: the green/red badge in the response bar (e.g. `201 Created`).
3. **The response body**: the JSON in the lower panel (use the **Pretty** view).

Steps:

1. Send the request, then make sure the response panel is visible below the request.
2. Take the screenshot:
   - **Windows:** `Win + Shift + S`, drag over the Postman window, then paste into Word/Docs.
   - **macOS:** `Cmd + Shift + 4` (or `Cmd + Shift + 5`).
   - **Linux:** `PrtSc` or your screenshot tool.
3. Save with clear names, e.g. `01-get-all-200.png`, `04-post-201.png`, `08-delete-200.png`.
4. Take at least one screenshot per endpoint (5 total), plus the 404 tests (3, 7, 9) as bonus evidence.

## Notes

- Data lives in memory only; restarting the server resets it.
- IDs for new notes come from `Date.now()` as required by the assignment.
