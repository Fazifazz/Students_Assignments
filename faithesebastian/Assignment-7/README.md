# Notes REST API

An Express REST API that stores notes in MongoDB through Mongoose.

## Setup

1. Install dependencies with `npm install`.
2. Set `MONGODB_URI` in `.env` (see `.env.example`). The default local value
   connects to the `notesdb` database on `127.0.0.1:27017`.
3. Start MongoDB, then seed sample notes once with `npm run seed`.
4. Start the API with `npm start`. The server starts after MongoDB connects
   and logs a connection confirmation.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/notes` | List notes; optional `?category=Work` filter |
| GET | `/api/notes/:id` | Get a note by MongoDB ID |
| POST | `/api/notes` | Create a note (`title`, `content`, optional `category`) |
| PUT | `/api/notes/:id` | Update a note's `title`, `content`, or `category` |
| DELETE | `/api/notes/:id` | Delete a note |

Valid categories are `General`, `Work`, `Personal`, and `Ideas`; new notes
default to `General`. Missing required fields or invalid field values return
400, missing notes return 404, and unexpected server errors return 500.

MongoDB stores notes independently of the API process, so they remain available
when the server is stopped and restarted.
