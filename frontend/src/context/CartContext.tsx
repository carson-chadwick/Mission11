import { useState, ReactNode, useContext, createContext } from "react";
import { CartItem } from "../types/CartItem";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
  getItemTotalPrice: (item: CartItem) => number; // Method to calculate total price dynamically
  getCartTotalPrice: () => number; // Method to calculate the total cart price
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Calculate the total price for an individual item (quantity * price)
  const getItemTotalPrice = (item: CartItem): number => {
    return item.quantity * item.price;
  };

  // Calculate the total cart price (sum of total price of all items in cart)
  const getCartTotalPrice = (): number => {
    return cart.reduce((total, item) => total + getItemTotalPrice(item), 0);
  };

  // Add item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookID === item.bookID);
      if (existingItem) {
        // If item exists, increase the quantity
        return prevCart.map((c) =>
          c.bookID === item.bookID
            ? { ...c, quantity: c.quantity + item.quantity } // Increase quantity
            : c
        );
      } else {
        // Add the new item if it doesn't exist
        return [...prevCart, item];
      }
    });
  };

  // Remove item from the cart
  const removeFromCart = (bookID: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookID !== bookID));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getItemTotalPrice,
        getCartTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
