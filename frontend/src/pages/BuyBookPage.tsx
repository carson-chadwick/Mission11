import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { CartItem } from "../types/CartItem";

function BuyBookPage() {
  const navigate = useNavigate();
  const { title, bookID, price } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(0);



  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookID: Number(bookID),
      title: title || "No Project Found",
      quantity,
      price: Number(price)
    };
    addToCart(newItem);
    navigate("/cart");
  };

  return (
    <>
      <WelcomeBand />

      <div>
        <h1>{title}</h1>
        <p>Price: {price}</p>
        <input
          type="number"
          placeholder="enter quantity"
          value={Number(quantity)}
          onChange={(x) => setQuantity(Number(x.target.value))}
        />
        <button onClick={handleAddToCart}>Select Quantity</button>
      </div>

      <button onClick={() => navigate(-1)}>Go back</button>
    </>
  );
}
export default BuyBookPage;
