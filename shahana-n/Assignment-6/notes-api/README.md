# Notes API

A RESTful API built with Node.js and Express.js to manage notes through CRUD operations.

## Features

- Create, retrieve, update, and delete notes.
- Retrieve individual notes by ID.
- Generate unique note IDs using `Date.now()`.
- Request logging middleware.
- Custom 404 and error handling.
- JSON-based request and response handling.

## Technologies

- Node.js
- Express.js
- JavaScript
- Postman

## Project Structure

```text
notes-api/
├── models/
│   └── Note.js
├── controllers/
│   └── noteController.js
├── routes/
│   └── noteRoutes.js
├── middleware/
│   ├── logger.js
│   ├── notFound.js
│   └── errorHandler.js
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Run the Project

Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Retrieve all notes |
| GET | `/api/notes/:id` | Retrieve a note by ID |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

## Sample Request

POST `/api/notes`

```json
{
  "title": "Learning Express",
  "content": "Practicing Express API",
  "category": "Development"
}
```

## Testing

All five CRUD endpoints are tested using Postman, including successful responses and error handling.

## Data Storage

Notes are stored in an in-memory array. Data resets when the server restarts.