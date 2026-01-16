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
          {products.map((p) => {
            const primaryImage = p.images && p.images.find((i) => i.isPrimary) && p.images.find((i) => i.isPrimary).imageUrl;
            const thumb = primaryImage || 'https://placehold.co/400x300?text=No+Image';
            return (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="block bg-white rounded-lg shadow hover:shadow-md overflow-hidden"
              >
                <img src={thumb} alt={p.name} className="w-full h-80 object-cover" />
                <div className="p-4">
                  <div className="flex items-baseline justify-between">
                    <div className="text-lg font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">SKU: {p.sku}</div>
                  </div>
                  <div className="text-sm text-gray-500">{p.brand} • {p.category}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-indigo-600 font-semibold">${p.price}</div>
                    <div className={`text-sm ${p.stockQuantity>0? 'text-green-600':'text-red-600'}`}>
                      {p.stockQuantity} in stock
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
