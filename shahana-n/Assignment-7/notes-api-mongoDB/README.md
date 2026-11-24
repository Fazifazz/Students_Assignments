# Notes API

A RESTful API built with Node.js, Express.js, MongoDB, and Mongoose to manage notes through CRUD operations.

## Features

- Create, retrieve, update, and delete notes.
- Retrieve individual notes by ID.
- Store notes permanently in MongoDB using Mongoose.
- Filter notes by category.
- Mongoose schema validation.
- Request logging middleware.
- Centralized error handling.
- Seed file to populate sample notes.
- JSON-based request and response handling.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- dotenv
- Postman

## Project Structure

```text
notes-api-mongoDB/
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
├── seed.js
├── index.js
├── package.json
└── README.md
```

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

Create a `.env` file with your MongoDB connection string:

```env
DB_URI=mongodb://localhost:27017/notedb
```

## Run the Project

Start the development server:

```bash
npm run dev
```

## Seed Data

Run the seed file once to populate the database with sample notes:

```bash
node seed.js
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Retrieve all notes |
| GET | `/api/notes/:id` | Retrieve a note by ID |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

## Category Filtering

Filter notes using the category query parameter:

```http
GET /api/notes?category=Work
```

Available categories: `General`, `Work`, `Personal`, `Ideas`.

## Sample Request

POST `/api/notes`

```json
{
  "title": "Learning Mongoose",
  "content": "Practicing MongoDB CRUD operations",
  "category": "Work"
}
```

## Error Handling

- `400` – Validation errors or invalid ID format.
- `404` – Note not found.
- `500` – Unexpected server errors.

## Testing

All five CRUD endpoints are tested using Postman, including category filtering and error handling.

## Data Storage

Notes are stored permanently in MongoDB using Mongoose. Seed data can be inserted using `seed.js`. Data persists even after stopping and restarting the server.