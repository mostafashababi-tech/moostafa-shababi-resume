import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            stock
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert('لطفا ابتدا وارد حساب کاربری خود شوید');
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          });

        if (error) throw error;
      }

      await fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('خطا در افزودن به سبد خرید');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.products?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    cartTotal,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
