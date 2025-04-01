import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartSummary = () => {
  const navigate = useNavigate();
  const { getCartTotalPrice } = useCart(); // Destructure getCartTotalPrice from CartContext

  // Use getCartTotalPrice() to dynamically get the total amount
  const totalAmount = getCartTotalPrice();

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "20px",
        background: "#f8f9fa",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        fontSize: "16px",
      }}
      onClick={() => navigate("/cart")}
    >
      🛒 <strong>{totalAmount.toFixed(2)}</strong> {/* Display total amount */}
    </div>
  );
};

export default CartSummary;
