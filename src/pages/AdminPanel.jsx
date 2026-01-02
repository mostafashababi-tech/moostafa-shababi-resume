import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        supabase.from('products').select('*, categories(name), brands(name)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
      ]);

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('خطا در حذف محصول');
    } else {
      fetchData();
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      alert('خطا در حذف دسته‌بندی');
    } else {
      fetchData();
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    const { error } = await supabase.from('brands').delete().eq('id', id);

    if (error) {
      alert('خطا در حذف برند');
    } else {
      fetchData();
    }
  };

  const openProductModal = (product = null) => {
    setEditingItem(product);
    setShowModal(true);
  };

  const openCategoryModal = (category = null) => {
    setEditingItem(category);
    setShowModal(true);
  };

  const openBrandModal = (brand = null) => {
    setEditingItem(brand);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">پنل مدیریت</h1>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            مدیریت محصولات
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'categories'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            مدیریت دسته‌بندی‌ها
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'brands'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            مدیریت برندها
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">محصولات</h2>
                <button
                  onClick={() => openProductModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  افزودن محصول
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right">نام</th>
                      <th className="px-4 py-3 text-right">قیمت</th>
                      <th className="px-4 py-3 text-right">موجودی</th>
                      <th className="px-4 py-3 text-right">دسته‌بندی</th>
                      <th className="px-4 py-3 text-right">برند</th>
                      <th className="px-4 py-3 text-right">وضعیت</th>
                      <th className="px-4 py-3 text-right">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">
                          {new Intl.NumberFormat('fa-IR').format(product.price)}
                        </td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">
                          {product.categories?.name || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {product.brands?.name || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.is_active ? 'فعال' : 'غیرفعال'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openProductModal(product)}
                            className="text-blue-600 hover:text-blue-700 ml-3"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">دسته‌بندی‌ها</h2>
                <button
                  onClick={() => openCategoryModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  افزودن دسته‌بندی
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold">{category.name}</div>
                      <div className="text-sm text-gray-600">
                        {category.name_en}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openCategoryModal(category)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">برندها</h2>
                <button
                  onClick={() => openBrandModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  افزودن برند
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold">{brand.name}</div>
                      <div className="text-sm text-gray-600">
                        {brand.name_en}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openBrandModal(brand)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          activeTab={activeTab}
          item={editingItem}
          categories={categories}
          brands={brands}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingItem(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function Modal({ activeTab, item, categories, brands, onClose, onSuccess }) {
  const [formData, setFormData] = useState(item || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'products') {
        const productData = {
          name: formData.name,
          description: formData.description || '',
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          category_id: formData.category_id || null,
          brand_id: formData.brand_id || null,
          image_url: formData.image_url || '',
          sku: formData.sku || '',
          is_active: formData.is_active !== false,
        };

        if (item) {
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', item.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('products').insert(productData);
          if (error) throw error;
        }
      } else if (activeTab === 'categories') {
        const categoryData = {
          name: formData.name,
          name_en: formData.name_en,
        };

        if (item) {
          const { error } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('id', item.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('categories').insert(categoryData);
          if (error) throw error;
        }
      } else if (activeTab === 'brands') {
        const brandData = {
          name: formData.name,
          name_en: formData.name_en,
        };

        if (item) {
          const { error } = await supabase
            .from('brands')
            .update(brandData)
            .eq('id', item.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('brands').insert(brandData);
          if (error) throw error;
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving:', error);
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {item ? 'ویرایش' : 'افزودن'}{' '}
            {activeTab === 'products'
              ? 'محصول'
              : activeTab === 'categories'
              ? 'دسته‌بندی'
              : 'برند'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'products' && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    نام محصول
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    توضیحات
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      قیمت (تومان)
                    </label>
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      موجودی
                    </label>
                    <input
                      type="number"
                      value={formData.stock || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      دسته‌بندی
                    </label>
                    <select
                      value={formData.category_id || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, category_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">انتخاب کنید</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      برند خودرو
                    </label>
                    <select
                      value={formData.brand_id || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, brand_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">انتخاب کنید</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    آدرس تصویر
                  </label>
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    کد محصول (SKU)
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-5 h-5"
                  />
                  <label className="text-gray-700 font-medium">
                    محصول فعال است
                  </label>
                </div>
              </>
            )}

            {(activeTab === 'categories' || activeTab === 'brands') && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    نام فارسی
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    نام انگلیسی
                  </label>
                  <input
                    type="text"
                    value={formData.name_en || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name_en: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
