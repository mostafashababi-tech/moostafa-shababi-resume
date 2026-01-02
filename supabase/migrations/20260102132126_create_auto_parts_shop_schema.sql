/*
  # ایجاد سیستم فروشگاه لوازم یدکی خودرو

  ## جداول جدید
  
  ### 1. brands (برندهای خودرو)
    - `id` (uuid, primary key)
    - `name` (text) - نام برند (تویوتا، بنز، پژو، ایران‌خودرو)
    - `name_en` (text) - نام انگلیسی برند
    - `logo_url` (text) - آدرس لوگوی برند
    - `created_at` (timestamp)
  
  ### 2. car_models (مدل‌های خودرو)
    - `id` (uuid, primary key)
    - `brand_id` (uuid, foreign key) - ارجاع به برند
    - `name` (text) - نام مدل (کرولا، 206، پراید)
    - `name_en` (text) - نام انگلیسی
    - `year_from` (integer) - سال شروع تولید
    - `year_to` (integer) - سال پایان تولید (null اگر هنوز تولید می‌شود)
    - `created_at` (timestamp)
  
  ### 3. categories (دسته‌بندی قطعات)
    - `id` (uuid, primary key)
    - `name` (text) - نام دسته (موتور، ترمز، تعلیق)
    - `name_en` (text) - نام انگلیسی
    - `parent_id` (uuid) - برای دسته‌بندی چند سطحی
    - `icon` (text) - آیکون دسته
    - `created_at` (timestamp)
  
  ### 4. products (محصولات - لوازم یدکی)
    - `id` (uuid, primary key)
    - `name` (text) - نام محصول
    - `description` (text) - توضیحات کامل
    - `category_id` (uuid, foreign key) - دسته‌بندی
    - `brand_id` (uuid, foreign key) - برند خودرو مناسب (nullable - برای قطعات عمومی)
    - `model_id` (uuid, foreign key) - مدل خودرو (nullable)
    - `price` (numeric) - قیمت
    - `stock` (integer) - موجودی انبار
    - `sku` (text) - کد محصول
    - `image_url` (text) - تصویر اصلی
    - `images` (jsonb) - آرایه تصاویر اضافی
    - `is_active` (boolean) - فعال/غیرفعال
    - `specifications` (jsonb) - مشخصات فنی
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
  
  ### 5. profiles (پروفایل کاربران)
    - `id` (uuid, primary key, foreign key to auth.users)
    - `full_name` (text) - نام کامل
    - `phone` (text) - شماره تلفن
    - `address` (text) - آدرس
    - `city` (text) - شهر
    - `postal_code` (text) - کد پستی
    - `is_admin` (boolean) - آیا ادمین است؟
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
  
  ### 6. cart_items (سبد خرید)
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key) - کاربر
    - `product_id` (uuid, foreign key) - محصول
    - `quantity` (integer) - تعداد
    - `created_at` (timestamp)
  
  ### 7. orders (سفارشات)
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key) - کاربر
    - `status` (text) - وضعیت (pending, processing, shipped, delivered, cancelled)
    - `total_amount` (numeric) - مبلغ کل
    - `shipping_address` (text) - آدرس ارسال
    - `phone` (text) - تلفن تماس
    - `notes` (text) - یادداشت‌ها
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
  
  ### 8. order_items (آیتم‌های سفارش)
    - `id` (uuid, primary key)
    - `order_id` (uuid, foreign key) - سفارش
    - `product_id` (uuid, foreign key) - محصول
    - `quantity` (integer) - تعداد
    - `price` (numeric) - قیمت در زمان خرید
    - `created_at` (timestamp)

  ## امنیت (Row Level Security)
  
  تمام جداول RLS فعال دارند با سیاست‌های امنیتی مناسب:
  - برندها، مدل‌ها، دسته‌بندی‌ها و محصولات: خواندن عمومی، نوشتن فقط ادمین
  - پروفایل: هر کاربر فقط پروفایل خود را می‌بیند/ویرایش می‌کند
  - سبد خرید: هر کاربر فقط سبد خرید خود
  - سفارشات: هر کاربر فقط سفارشات خود (ادمین همه را می‌بیند)
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create car_models table
CREATE TABLE IF NOT EXISTS car_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  name text NOT NULL,
  name_en text NOT NULL,
  year_from integer,
  year_to integer,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  icon text DEFAULT '📦',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  model_id uuid REFERENCES car_models(id) ON DELETE SET NULL,
  price numeric NOT NULL CHECK (price >= 0),
  stock integer DEFAULT 0 CHECK (stock >= 0),
  sku text UNIQUE,
  image_url text,
  images jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  specifications jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  shipping_address text NOT NULL,
  phone text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_car_models_brand ON car_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_model ON products(model_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brands (public read, admin write)
CREATE POLICY "Anyone can view brands"
  ON brands FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert brands"
  ON brands FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update brands"
  ON brands FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete brands"
  ON brands FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for car_models (public read, admin write)
CREATE POLICY "Anyone can view car models"
  ON car_models FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert car models"
  ON car_models FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update car models"
  ON car_models FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete car models"
  ON car_models FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated, anon
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ));

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      ))
    )
  );

CREATE POLICY "Users can insert order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();