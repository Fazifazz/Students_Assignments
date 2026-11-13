const assert = require('node:assert/strict');
const http = require('node:http');
const { after, before, test } = require('node:test');
const app = require('../server');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

function request(path, { method = 'GET', body, rawBody } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const requestBody = rawBody === undefined
      ? (body === undefined ? undefined : JSON.stringify(body))
      : rawBody;
    const req = http.request(url, {
      method,
      headers: requestBody
        ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(requestBody) }
        : {}
    }, (res) => {
      let responseBody = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: responseBody ? JSON.parse(responseBody) : undefined
        });
      });
    });

    req.on('error', reject);
    if (requestBody) {
      req.write(requestBody);
    }
    req.end();
  });
}

test('book routes support listing, filtering, validation, and CRUD', async () => {
  const initialList = await request('/api/books');
  assert.equal(initialList.status, 200);
  assert.equal(initialList.body.data.length, 5);

  const fantasyBooks = await request('/api/books?genre=Fantasy');
  assert.equal(fantasyBooks.status, 200);
  assert.ok(fantasyBooks.body.data.every((book) => book.genre === 'Fantasy'));

  const searchResults = await request('/api/books/search?q=tolkien');
  assert.equal(searchResults.status, 200);
  assert.equal(searchResults.body.data[0].title, 'The Hobbit');

  const invalidBook = await request('/api/books', { method: 'POST', body: { title: '' } });
  assert.equal(invalidBook.status, 400);

  const missingBody = await request('/api/books', { method: 'POST' });
  assert.equal(missingBody.status, 400);

  const malformedJson = await request('/api/books', { method: 'POST', rawBody: '{' });
  assert.equal(malformedJson.status, 400);

  const created = await request('/api/books', {
    method: 'POST',
    body: {
      title: 'A New Book',
      author: 'A. Writer',
      genre: 'Adventure',
      publishedYear: 2024,
      available: true
    }
  });
  assert.equal(created.status, 201);
  const { id } = created.body.data;

  const fetched = await request(`/api/books/${id}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.data.title, 'A New Book');

  const updated = await request(`/api/books/${id}`, {
    method: 'PUT',
    body: {
      title: 'An Updated Book',
      author: 'A. Writer',
      genre: 'Adventure',
      publishedYear: 2025,
      available: false
    }
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.title, 'An Updated Book');

  const deleted = await request(`/api/books/${id}`, { method: 'DELETE' });
  assert.equal(deleted.status, 204);

  const missing = await request(`/api/books/${id}`);
  assert.equal(missing.status, 404);

  const invalidId = await request('/api/books/not-a-uuid');
  assert.equal(invalidId.status, 400);

  const unknownRoute = await request('/not-a-route');
  assert.equal(unknownRoute.status, 404);
});
