import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { selectCartTotal, fetchCart } from "../store/slices/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const total = useSelector(selectCartTotal);

  const [form, setForm] = useState({
    shipping_name: user?.name || "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/orders", form);
      dispatch(fetchCart());
      navigate(`/order-confirmation/${res.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <h1 className="text-2xl font-bold mb-2">Shipping Details</h1>
        {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</p>}

        <input
          name="shipping_name" placeholder="Full Name" required value={form.shipping_name}
          onChange={handleChange} className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          name="shipping_phone" placeholder="Phone Number" required value={form.shipping_phone}
          onChange={handleChange} className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <textarea
          name="shipping_address" placeholder="Full Address" required value={form.shipping_address}
          onChange={handleChange} rows={3} className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="shipping_city" placeholder="City" required value={form.shipping_city}
            onChange={handleChange} className="border rounded-md px-3 py-2 text-sm"
          />
          <input
            name="shipping_pincode" placeholder="Pincode" required value={form.shipping_pincode}
            onChange={handleChange} className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="border rounded-md p-4 bg-gray-50">
          <p className="font-medium text-sm">Payment Method</p>
          <label className="flex items-center gap-2 mt-2 text-sm">
            <input type="radio" checked readOnly /> Cash on Delivery (COD)
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-dark text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item.cart_item_id} className="flex justify-between text-sm mb-2">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
