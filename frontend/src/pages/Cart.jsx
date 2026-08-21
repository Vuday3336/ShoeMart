import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, removeCartItem, selectCartTotal } from "../store/slices/cartSlice";
import Loader from "../components/Loader";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);

  if (loading) return <Loader />;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold mb-2">Your cart is empty 🛒</p>
        <p className="text-gray-500 mb-6">Looks like you haven't added any shoes yet.</p>
        <Link to="/products" className="bg-dark text-white px-6 py-3 rounded-md font-semibold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {items.map((item) => (
          <div key={item.cart_item_id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">Size: {item.size} · Brand: {item.brand}</p>
              <p className="font-bold text-brand-600 mt-1">₹{Number(item.price).toLocaleString()}</p>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() =>
                      dispatch(updateCartItem({ cartItemId: item.cart_item_id, quantity: Math.max(1, item.quantity - 1) }))
                    }
                    className="px-3 py-1"
                  >
                    −
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(updateCartItem({ cartItemId: item.cart_item_id, quantity: item.quantity + 1 }))
                    }
                    className="px-3 py-1"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeCartItem(item.cart_item_id))}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span>Delivery</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-3 mb-4">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-brand-500 hover:bg-brand-600 transition text-white py-3 rounded-md font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
