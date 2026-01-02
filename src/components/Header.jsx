import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl">🚗</div>
            <div className="text-xl font-bold text-gray-800">
              فروشگاه لوازم یدکی
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              صفحه اصلی
            </Link>

            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span className="text-2xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {profile?.is_admin && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    پنل مدیریت
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  ورود
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
