import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import productService from '../../services/productService';
import { formatErrorMessage } from '../../utils/apiErrorHandler';

const PRODUCT_FIELDS = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'sku', label: 'SKU', type: 'text', required: true },
  { name: 'brand', label: 'Brand', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'text', required: true },
  { name: 'price', label: 'Price', type: 'number', step: '0.01', required: true },
  { name: 'stockQuantity', label: 'Stock', type: 'number', required: true },
  { name: 'color', label: 'Color', type: 'text', required: false },
  { name: 'size', label: 'Size', type: 'text', required: false },
  { name: 'material', label: 'Material', type: 'text', required: false },
  { name: 'gender', label: 'Gender', type: 'select', required: false, options: ['Unisex', 'Male', 'Female'] },
  { name: 'description', label: 'Description', type: 'textarea', required: false, rows: 3 }
];

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await productService.syncProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleOpenAddSidebar = () => {
    setEditingProduct(null);
    setShowSidebar(true);
  };

  const handleOpenEditSidebar = (product) => {
    setEditingProduct(product);
    setShowSidebar(true);
  };

  const handleSaveProduct = async (formData) => {
    setError(null);
    setSuccess(null);
    try {
      if (editingProduct) {
        // Update existing product
        await productService.updateProduct(editingProduct.id, formData);
        setSuccess('Product updated successfully!');
      } else {
        // Create new product
        await productService.createProduct(formData);
        setSuccess('Product created successfully!');
      }
      
      // Refresh products list
      const updated = await productService.syncProducts();
      setProducts(updated);
      setShowSidebar(false);
      setEditingProduct(null);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setError(null);
      setSuccess(null);
      try {
        await productService.deleteProduct(id);
        const updated = await productService.syncProducts();
        setProducts(updated);
        setSuccess('Product deleted successfully!');
      } catch (err) {
        const errorMessage = formatErrorMessage(err);
        setError(errorMessage);
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-green-800 font-medium">Success</p>
            <p className="text-green-700 text-sm mt-1">{success}</p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <button
          onClick={handleOpenAddSidebar}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Brand</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3 text-sm text-gray-500">{p.sku}</td>
                  <td className="py-3 text-sm">{p.brand}</td>
                  <td className="py-3 text-indigo-600 font-semibold">${p.price}</td>
                  <td className="py-3">{p.stockQuantity}</td>
                  <td className="py-3 text-sm">{p.category}</td>
                  <td className="py-3 flex gap-2">
                    <button
                      onClick={() => handleOpenEditSidebar(p)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* <div className="mt-6">
        <Link to="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div> */}

      {/* Sidebar Component */}
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSubmit={handleSaveProduct}
        title={editingProduct ? `Edit: ${editingProduct.name}` : 'New Product'}
        submitLabel={editingProduct ? 'Update' : 'Create'}
        fields={PRODUCT_FIELDS}
        initialData={editingProduct || {
          name: '',
          description: '',
          sku: '',
          price: '',
          stockQuantity: '',
          brand: '',
          color: '',
          size: '',
          material: '',
          gender: 'Unisex',
          category: '',
          images: []
        }}
      />
    </div>
  );
}
