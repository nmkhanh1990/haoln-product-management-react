import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import './App.css';

function App() {
  return (
    <div className="min-h-screen text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Product Management</h1>
          <nav>
            <Link to="/products" className="text-blue-600 hover:underline">
              Products
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
