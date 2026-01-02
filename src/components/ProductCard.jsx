import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(product.id, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🔧
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">
            {formatPrice(product.price)} تومان
          </div>
          {product.stock > 0 && user && (
            <button
              onClick={handleAddToCart}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              افزودن به سبد
            </button>
          )}
        </div>

        {product.stock > 0 && product.stock < 5 && (
          <div className="mt-2 text-orange-600 text-sm">
            تنها {product.stock} عدد موجود است
          </div>
        )}
      </div>
    </Link>
  );
}
