// // // src/AppRoutes.js
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import { AuthProvider } from './context/AuthContext';
// // import { ThemeProvider } from './context/ThemeContext';
// // import ProtectedRoute from './components/ProtectedRoute';
// // import Navbar from './components/Navbar';
// // import Home from './pages/Home';
// // import Login from './pages/Login';
// // import Dashboard from './pages/Dashboard';
// // import BookList from './components/BookList';
// // import BookForm from './components/BookForm';
// // import BorrowerList from './components/BorrowerList';
// // import BorrowerForm from './components/BorrowerForm';
// // import BorrowBook from './components/BorrowBook';
// // import Reports from './components/Reports';
// // import FineManagement from './components/FineManagement';
// // import SearchBook from './components/SearchBook';

// // function AppRoutes() {
// //   return (
// //     <Router>
// //       <ThemeProvider>
// //         <AuthProvider>
// //           <Navbar />
// //           <Routes>
// //             {/* Public routes */}
// //             <Route path="/" element={<Home />} />
// //             <Route path="/login" element={<Login />} />
            
// //             {/* Protected routes */}
// //             <Route element={<ProtectedRoute />}>
// //               <Route path="/dashboard" element={<Dashboard />} />
// //               <Route path="/books" element={<BookList />} />
// //               <Route path="/books/add" element={<BookForm />} />
// //               <Route path="/books/edit/:id" element={<BookForm />} />
// //               <Route path="/borrowers" element={<BorrowerList />} />
// //               <Route path="/borrowers/add" element={<BorrowerForm />} />
// //               <Route path="/borrowers/edit/:id" element={<BorrowerForm />} />
// //               <Route path="/borrow" element={<BorrowBook />} />
// //               <Route path="/reports" element={<Reports />} />
// //               <Route path="/fines" element={<FineManagement />} />
// //               <Route path="/search" element={<SearchBook />} />
// //             </Route>
// //           </Routes>
// //         </AuthProvider>
// //       </ThemeProvider>
// //     </Router>
// //   );
// // }

// import React, { useState } from 'react';
// import BookForm from './components/BookForm';
// import BookList from './components/BookList';
// import BorrowerForm from './components/BorrowerForm';
// import BorrowerList from './components/BorrowerList';
// import BorrowBook from './components/BorrowBook';
// import './App.css';

// function App() {
// const [activeTab, setActiveTab] = useState('books');
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleBookAdded = () => {
//     setRefreshKey(prev => prev + 1);
//   };

//   const handleBorrowerAdded = () => {
//     setRefreshKey(prev => prev + 1);
//   };

//   const handleBorrowSuccess = () => {
//     setRefreshKey(prev => prev + 1);
//   };

//   return (
//     <div className="app">
//       <header>
//         <h1>Library Management System</h1>
//         <nav>
//           <button 
//             className={activeTab === 'books' ? 'active' : ''} 
//             onClick={() => setActiveTab('books')}
//           >
//             Books
//           </button>
//           <button 
//             className={activeTab === 'borrowers' ? 'active' : ''} 
//             onClick={() => setActiveTab('borrowers')}
//           >
//             Borrowers
//           </button>
//           <button 
//             className={activeTab === 'borrow' ? 'active' : ''} 
//             onClick={() => setActiveTab('borrow')}
//           >
//             Borrow Book
//           </button>
//         </nav>
//       </header>

//       <main>
//         {activeTab === 'books' && (
//           <div className="books-section">
//             <BookForm onBookAdded={handleBookAdded} />
//             <BookList key={refreshKey} onBookDeleted={handleBookAdded} />
//           </div>
//         )}

//         {activeTab === 'borrowers' && (
//           <div className="borrowers-section">
//             <BorrowerForm onBorrowerAdded={handleBorrowerAdded} />
//             <BorrowerList key={refreshKey} />
//           </div>
//         )}

//         {activeTab === 'borrow' && (
//           <div className="borrow-section">
//             <BorrowBook onBorrowSuccess={handleBorrowSuccess} />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;
// // export default AppRoutes;