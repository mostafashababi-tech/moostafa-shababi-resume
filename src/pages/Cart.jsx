import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, loading } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleCheckout = async () => {
    if (!profile?.phone || !profile?.address) {
      alert('لطفا ابتدا اطلاعات تماس و آدرس خود را در پروفایل تکمیل کنید');
      return;
    }

    alert('قابلیت ثبت سفارش به زودی فعال می‌شود');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          برای مشاهده سبد خرید وارد شوید
        </h2>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          ورود به حساب کاربری
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          سبد خرید شما خالی است
        </h2>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex gap-4"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.products?.image_url ? (
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🔧
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Link
                  to={`/product/${item.product_id}`}
                  className="text-lg font-bold text-gray-800 hover:text-blue-600 block mb-2"
                >
                  {item.products?.name}
                </Link>

                <div className="text-blue-600 font-bold mb-3">
                  {formatPrice(item.products?.price || 0)} تومان
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg"
                      disabled={item.quantity >= (item.products?.stock || 0)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="text-left font-bold text-lg text-gray-800">
                {formatPrice((item.products?.price || 0) * item.quantity)} تومان
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              خلاصه سبد خرید
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>تعداد اقلام:</span>
                <span>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} عدد
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>جمع کل:</span>
                <span className="text-blue-600">
                  {formatPrice(cartTotal)} تومان
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-colors"
            >
              تکمیل خرید
            </button>

            <Link
              to="/"
              className="block text-center text-blue-600 hover:text-blue-700 mt-4"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
