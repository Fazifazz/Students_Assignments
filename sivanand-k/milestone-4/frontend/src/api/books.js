import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export function getBooks(filters = {}) {
  return api.get('/books', { params: filters }).then((response) => response.data.data);
}

export function getBook(id) {
  return api.get(`/books/${encodeURIComponent(id)}`).then((response) => response.data.data);
}

export function createBook(book) {
  return api.post('/books', book).then((response) => response.data.data);
}

export function updateBook(id, book) {
  return api.put(`/books/${encodeURIComponent(id)}`, book).then((response) => response.data.data);
}

export function deleteBook(id) {
  return api.delete(`/books/${encodeURIComponent(id)}`);
}

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
}
