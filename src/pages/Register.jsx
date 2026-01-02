import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('این ایمیل قبلا ثبت شده است');
      } else {
        setError('خطا در ثبت‌نام. لطفا دوباره تلاش کنید');
      }
      setLoading(false);
    } else {
      alert('ثبت‌نام با موفقیت انجام شد!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-800">ثبت‌نام</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="علی احمدی"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ایمیل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="حداقل 6 کاراکتر"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              تکرار رمز عبور
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="تکرار رمز عبور"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            قبلا ثبت‌نام کرده‌اید؟{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
