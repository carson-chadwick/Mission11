import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, getCartTotalPrice, getItemTotalPrice } =
    useCart();

  return (
    <div>
      <h2>Your Cart</h2>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart.map((item: CartItem) => (
              <li key={item.bookID}>
                <div>
                  <h5>{item.title}</h5>
                  <p>Price per item: ${item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  {/* Calculate total price per item dynamically */}
                  <p>Total: ${getItemTotalPrice(item).toFixed(2)}</p>{" "}
                  {/* Dynamically calculate total for this item */}
                  <button onClick={() => removeFromCart(item.bookID)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Calculate total cart price dynamically */}
      <h3>Total Cart Price: ${getCartTotalPrice().toFixed(2)}</h3>

      <button>Checkout</button>
      <button onClick={() => navigate("/books")}>Continue Browsing</button>
    </div>
  );
}

export default CartPage;
