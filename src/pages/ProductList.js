import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/products')
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              className="block bg-white rounded-lg shadow p-4 hover:shadow-md"
            >
              <div className="text-lg font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">{p.category}</div>
              <div className="mt-2 text-indigo-600 font-semibold">${p.price}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
