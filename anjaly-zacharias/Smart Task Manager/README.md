# Smart Task Manager

A responsive task dashboard built with plain HTML, CSS, and browser JavaScript, with an Express REST API and a JSON file for persistence. No frontend framework or database server is required.

## Features

- Dashboard totals for all, pending, in-progress, completed, overdue, and completion percentage.
- Create, view, edit, complete, and delete tasks.
- Search by title; filter by category, priority, and status; sort by due date.
- Responsive sidebar, task list, status and priority labels, form validation, and success/error notifications.
- JSON-backed REST API with request validation, HTTP status codes, and unknown-route handling.

## Project structure

| File | Purpose |
| --- | --- |
| `server.js` | Runs the Express REST API on port 3001, configures CORS for the frontend, and handles unknown API routes and JSON parsing errors. |
| `frontend-server.js` | Runs a separate Express static server for the frontend on port 3000. |
| `routes/taskRoutes.js` | Maps task API URLs and HTTP methods to controller functions. |
| `controllers/taskController.js` | Validates task data and implements the CRUD API operations and response codes. |
| `utils/taskStore.js` | Reads and writes the JSON task collection; writes use a temporary file before replacing the data file. |
| `data/tasks.json` | Persistent task data and starter tasks. |
| `public/index.html` | Dashboard layout, navigation, filters, task form, and accessible status regions. |
| `public/css/style.css` | Visual design, component styling, responsive layouts, and reduced-motion handling. |
| `public/js/script.js` | Loads and updates tasks through `fetch`, renders dashboard metrics and task cards, and wires search, filtering, sorting, and form actions. |

## Requirements

- Node.js 18 or newer
- npm

## Install and run

From the project directory, install dependencies once:

```bash
npm install
```

Start the backend and frontend in two separate terminals:

```bash
npm run start:backend
```

```bash
npm run start:frontend
```

Open [http://localhost:3000](http://localhost:3000). The API is available separately at [http://localhost:3001/api/tasks](http://localhost:3001/api/tasks). During development, use `npm run dev:backend` and `npm run dev:frontend` in place of the corresponding start commands. Run the tests with `npm test`.

The backend port can be changed with `PORT`, and the frontend port with `FRONTEND_PORT`. If the frontend uses a non-default host or port, set `FRONTEND_ORIGINS` to a comma-separated list of allowed frontend origins (for example, `http://localhost:4200`). The frontend sends API requests to port 3001 on the same host used to open the page.

## REST API

The base URL is `http://localhost:3001/api/tasks`. Task fields are `title`, `description`, `category`, `priority`, `dueDate`, and `status`. The due date is `YYYY-MM-DD` or an empty string. Categories are `Personal`, `Study`, `Work`, and `Other`; priorities are `Low`, `Medium`, and `High`; statuses are `Pending`, `In Progress`, and `Completed`.

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| `GET` | `/api/tasks` | List tasks | `200` |
| `GET` | `/api/tasks/:id` | Get one task | `200` |
| `POST` | `/api/tasks` | Create a task | `201` |
| `PUT` | `/api/tasks/:id` | Update one or more task fields | `200` |
| `DELETE` | `/api/tasks/:id` | Delete a task | `200` |

Invalid input returns `400`, missing tasks return `404`, and data access or unexpected server errors return `500`.

## Postman examples

Start the backend first, then create requests with `Content-Type: application/json` where a request body is used.

### List tasks

```http
GET http://localhost:3001/api/tasks
```

### Get a task

```http
GET http://localhost:3001/api/tasks/sample-task-1
```

### Create a task

```http
POST http://localhost:3001/api/tasks
Content-Type: application/json

{
  "title": "Prepare presentation",
  "description": "Draft the project update slides.",
  "category": "Work",
  "priority": "High",
  "dueDate": "2027-02-01",
  "status": "Pending"
}
```

### Update a task

```http
PUT http://localhost:3001/api/tasks/sample-task-1
Content-Type: application/json

{
  "status": "Completed",
  "priority": "Medium"
}
```

### Delete a task

```http
DELETE http://localhost:3001/api/tasks/sample-task-1
```

The starter data includes sample task IDs. Any changes made through the app or API are saved to `data/tasks.json`.
