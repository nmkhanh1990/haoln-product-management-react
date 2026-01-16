import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('/products')
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const handleOpenAddSidebar = () => {
    setEditingProduct(null);
    setShowSidebar(true);
  };

  const handleOpenEditSidebar = (product) => {
    setEditingProduct(product);
    setShowSidebar(true);
  };

  const handleSaveProduct = (formData) => {
    if (editingProduct) {
      // Update existing product
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...formData, id: p.id } : p
      );
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    } else {
      // Create new product
      const maxId = products.length ? Math.max(...products.map(p => p.id)) : 0;
      formData.id = maxId + 1;
      const updated = [...products, formData];
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    }
    setShowSidebar(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
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
