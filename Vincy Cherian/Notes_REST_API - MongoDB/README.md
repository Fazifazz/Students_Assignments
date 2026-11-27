# Notes REST API – MongoDB & Mongoose

A RESTful Notes API built using Node.js, Express.js, MongoDB, and Mongoose. This project supports complete CRUD operations with persistent database storage, category-based filtering, schema validation, and centralized error handling.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- Postman (API Testing)

## Project Structure

NOTES_REST_API/
│
├── controllers/
│   └── noteController.js
│
├── middleware/
│   └── errorHandler.js
│
├── Models/
│   └── notes.js
│
├── routes/
│   └── noteRoutes.js
│
├── seed.js
├── index.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Features

- Connects to MongoDB using Mongoose.
- Stores notes permanently in MongoDB.
- Performs all five CRUD operations.
- Supports filtering notes by category.
- Validates required fields using a Mongoose schema.
- Handles invalid IDs, missing notes, validation errors, and unexpected server errors.
- Includes a database seeding script with five sample notes.
- Verifies data persistence after server restart.

## Note Schema

Each note contains the following fields:

| Field | Data Type | Description |
|---|---|---|
| title | String | Required note title |
| content | String | Required note content |
| category | String | General, Work, Personal or Ideas |
| createdAt | Date | Defaults to the current date |

MongoDB automatically generates a unique `_id` for each note.

## API Endpoints

Base URL: `http://localhost:3000/api/notes`

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Retrieve all notes |
| GET | `/api/notes/:id` | Retrieve a note by ID |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

### Category Filtering

The GET endpoint supports an optional category query parameter.

Example:

```http
GET /api/notes?category=Work
```

This returns only notes belonging to the Work category. Without the query parameter, all notes are returned.

## Request Body

Example JSON for creating a new note:

```json
{
  "title": "Learning MongoDB",
  "content": "Understanding MongoDB and Mongoose operations.",
  "category": "General"
}
```

The title and content fields are required. The category defaults to `General` when omitted.

## Error Handling

The API handles errors with appropriate HTTP status codes:

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Note created successfully |
| 400 | Validation error or invalid note ID |
| 404 | Note not found |
| 500 | Unexpected server error |

## Database Seeding

A `seed.js` script is included to populate MongoDB with at least five sample notes.

Run the following command:

```bash
npm run seed
```

The seed script connects to MongoDB, inserts the sample notes, and closes the database connection.

The seeded data persists in MongoDB even after stopping and restarting the Node.js server.


## Testing

All five CRUD endpoints can be tested using Postman.

Testing includes:
- Retrieving all notes and filtering by category.
- Retrieving a note using its MongoDB ObjectId.
- Creating notes with valid and invalid request bodies.
- Updating existing notes.
- Deleting existing notes.
- Testing 400 and 404 error responses.
- Verifying database persistence after restarting the server.

---

**Assignment:** 7 – Notes REST API with MongoDB & Mongoose

**Phase:** 4 – Backend Development