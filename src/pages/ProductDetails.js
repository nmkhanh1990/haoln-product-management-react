import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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

  useEffect(() => {
    if (!product) return;
    const gallery = product.images && product.images.length ? [...product.images].sort((a,b)=>a.displayOrder - b.displayOrder) : [];
    const primary = gallery.find(i=>i.isPrimary) || gallery[0];
    setSelectedImage(primary ? primary.imageUrl : null);
  }, [product]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="text-sm text-gray-500 mb-4">{product.brand} • {product.category}</div>
          <div className="text-lg font-semibold text-indigo-600 mb-4">${product.price}</div>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div><strong>SKU:</strong> {product.sku}</div>
            <div><strong>Stock:</strong> {product.stockQuantity}</div>
            <div><strong>Color:</strong> {product.color}</div>
            <div><strong>Size:</strong> {product.size}</div>
            <div><strong>Material:</strong> {product.material}</div>
            <div><strong>Gender:</strong> {product.gender}</div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="p-4 border rounded">
            <div className="mb-4">
              <img src={selectedImage || 'https://placehold.co/600x400?text=No+Image'} alt={product.name} className="w-full h-80 object-cover rounded" />
            </div>

            {(product.images && product.images.length > 0) && (
              <div className="flex gap-2 overflow-x-auto mb-4">
                {[...product.images].sort((a,b)=>a.displayOrder-b.displayOrder).map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(img.imageUrl)} className={`p-0 border rounded ${selectedImage===img.imageUrl ? 'ring-2 ring-indigo-500' : ''}`}>
                    <img src={img.imageUrl} alt={`${product.name}-${idx}`} className="w-20 h-30 object-cover rounded" />
                  </button>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-500">Availability</div>
            <div className={`mt-2 text-lg font-semibold ${product.stockQuantity>0? 'text-green-600':'text-red-600'}`}>
              {product.stockQuantity>0 ? 'In Stock' : 'Out of Stock'}
            </div>

            <div className="mt-4">
              <button className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50" disabled={product.stockQuantity<=0}>
                Add to cart
              </button>
            </div>
          </div>
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
