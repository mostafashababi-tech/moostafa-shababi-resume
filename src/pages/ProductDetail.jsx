import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          brands (name),
          car_models (name)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/');
        return;
      }
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('لطفا ابتدا وارد حساب کاربری خود شوید');
      navigate('/login');
      return;
    }
    await addToCart(product.id, quantity);
    alert('محصول به سبد خرید اضافه شد');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        ← بازگشت
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl">
              🔧
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <div className="flex gap-4 mb-6">
            {product.categories && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {product.categories.name}
              </span>
            )}
            {product.brands && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {product.brands.name}
              </span>
            )}
            {product.car_models && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                {product.car_models.name}
              </span>
            )}
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">توضیحات</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {product.sku && (
            <div className="mb-4">
              <span className="text-gray-600">کد محصول: </span>
              <span className="font-mono text-gray-800">{product.sku}</span>
            </div>
          )}

          <div className="mb-6">
            <span className="text-gray-600">موجودی: </span>
            {product.stock > 0 ? (
              <span className="text-green-600 font-bold">
                {product.stock} عدد
              </span>
            ) : (
              <span className="text-red-600 font-bold">ناموجود</span>
            )}
          </div>

          <div className="text-3xl font-bold text-blue-600 mb-6">
            {formatPrice(product.price)} تومان
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-700 font-medium">تعداد:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg text-xl"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-16 text-center border border-gray-300 rounded-lg py-2"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg text-xl"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-bold transition-colors"
            >
              افزودن به سبد خرید
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
