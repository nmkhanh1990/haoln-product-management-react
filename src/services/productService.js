/**
 * Product Service - CRUD operations
 * Currently operates on /products JSON file (static data)
 * Can be upgraded to real API endpoints later
 */

import { apiCall, formatErrorMessage } from '../utils/apiErrorHandler';

let cachedProducts = null;

// Fetch all products from /products file
async function getProducts() {
  try {
    const data = await apiCall('/products'); // file public/products.json
    cachedProducts = data;
    return data;
  } catch (error) {
    console.error('Error fetching products:', formatErrorMessage(error));
    return [];
  }
}

// Get single product by ID
async function getProductById(id) {
  const products = cachedProducts || await getProducts();
  return products.find((p) => p.id === parseInt(id));
}

// Create new product
async function createProduct(productData) {
  try {
    const products = cachedProducts || await getProducts();
    const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
    const newProduct = { ...productData, id: maxId + 1 };
    const updated = [...products, newProduct];
    
    // Save to localStorage (simulating API save)
    localStorage.setItem('products', JSON.stringify(updated));
    cachedProducts = updated;
    
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Update existing product
async function updateProduct(id, productData) {
  try {
    const products = cachedProducts || await getProducts();
    const updated = products.map((p) =>
      p.id === parseInt(id) ? { ...productData, id: p.id } : p
    );
    
    // Save to localStorage (simulating API save)
    localStorage.setItem('products', JSON.stringify(updated));
    cachedProducts = updated;
    
    return updated.find((p) => p.id === parseInt(id));
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete product
async function deleteProduct(id) {
  try {
    const products = cachedProducts || await getProducts();
    const updated = products.filter((p) => p.id !== parseInt(id));
    
    // Save to localStorage (simulating API save)
    localStorage.setItem('products', JSON.stringify(updated));
    cachedProducts = updated;
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Sync with localStorage (load saved changes)
async function syncProducts() {
  const saved = localStorage.getItem('products');
  if (saved) {
    cachedProducts = JSON.parse(saved);
    return cachedProducts;
  }
  return getProducts();
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  syncProducts
};
