const BASE_URL = 'http://localhost:3000/api/api/users';

// ✅ User Auth
export const registerUser = (userData) =>
  // eslint-disable-next-line no-undef
  axios.post(`${BASE_URL}/register`, userData);

export const loginUser = (credentials) =>
  // eslint-disable-next-line no-undef
  axios.post(`${BASE_URL}/login`, credentials);















// export const fetchBooks = async () => {
//   const response = await fetch(`${API_BASE_URL}/books`);
//   if (!response.ok) throw new Error('Failed to fetch books');
//   return { data: await response.json() };
// };

// export const addBook = async (bookData) => {
//   const response = await fetch(`${API_BASE_URL}/books`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(bookData),
//   });
//   if (!response.ok) throw new Error('Failed to add book');
//   return await response.json();
// };

// export const updateBook = async (id, bookData) => {
//   const response = await fetch(`${API_BASE_URL}/books/${id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(bookData),
//   });
//   if (!response.ok) throw new Error('Failed to update book');
//   return await response.json();
// };

// export const getBook = async (id) => {
//   const response = await fetch(`${API_BASE_URL}/books/${id}`);
//   if (!response.ok) throw new Error('Failed to fetch book');
//   return { data: await response.json() };
// };

// export const deleteBook = async (id) => {
//   const response = await fetch(`${API_BASE_URL}/books/${id}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) throw new Error('Failed to delete book');
//   return {};
// };

// export const fetchBorrowers = async () => {
//   const response = await fetch(`${API_BASE_URL}/borrowers`);
//   if (!response.ok) throw new Error('Failed to fetch borrowers');
//   return { data: await response.json() };
// };

// export const addBorrower = async (borrowerData) => {
//   const response = await fetch(`${API_BASE_URL}/borrowers`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(borrowerData),
//   });
//   if (!response.ok) throw new Error('Failed to add borrower');
//   return await response.json();
// };

// export const getActiveBorrowsByBorrower = async (borrowerId) => {
//   const response = await fetch(`${API_BASE_URL}/borrowers/${borrowerId}/borrows`);
//   if (!response.ok) throw new Error('Failed to fetch active borrows');
//   return { data: await response.json() };
// };

// export const borrowBook = async (borrowData) => {
//   const response = await fetch(`${API_BASE_URL}/borrows`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(borrowData),
//   });
//   if (!response.ok) throw new Error('Failed to borrow book');
//   return {};
// };


// export const returnBook = async (borrowId) => {
//   const response = await fetch(`${API_BASE_URL}/borrows/${borrowId}/return`, {
//     method: 'PUT',
//   });
//   if (!response.ok) throw new Error('Failed to return book');
//   return {};
// };