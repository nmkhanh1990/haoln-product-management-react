import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/products')
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((x) => String(x.id) === String(id));
        setProduct(found || null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product)
    return (
      <div>
        <div className="text-lg font-semibold">Product not found</div>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to products
        </Link>
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="text-sm text-gray-500 mb-4">{product.category}</div>
          <div className="text-lg font-semibold text-indigo-600 mb-4">${product.price}</div>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/products" className="text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    </div>
  );
}
