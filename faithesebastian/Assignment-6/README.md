Assignment No.6

Title: Build a Notes REST API with Node.js & Express

Objective:

The purpose of this assignment is to evaluate Node.js and Express skills —
covered in Sessions 43 to 45 — by building a structured Notes REST API with
proper project organisation, routing, controllers, and Postman-tested
endpoints using in-memory data.

Assignment: Build a complete Notes REST API using Node.js and Express.

Requirements:

● Set up a Node.js project with Express — use folder structure:
routes/noteRoutes.js, controllers/noteController.js, and index.js;
configure express.json() middleware.

● Create GET /api/notes — returns all notes from an in-memory array;
start with at least 3 pre-loaded notes.

● Create GET /api/notes/:id — returns a single note by its ID or responds
with 404 and a message if not found.

● Create POST /api/notes — accepts { title, content, category } in the
request body, assigns a unique ID (using Date.now()), and adds it to the
array.

● Create PUT /api/notes/:id — updates the note's title, content, or
category by ID; returns 404 if the note is not found.

● Create DELETE /api/notes/:id — removes the note from the array by ID;
returns 404 if not found.

● Test all 5 endpoints in Postman — screenshot each request showing the
correct status code and response body and submit the screenshots.
