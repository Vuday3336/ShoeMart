import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Order not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
      <p className="text-gray-500 mt-2">
        Order #{order.id} · Pay ₹{Number(order.total_amount).toLocaleString()} on delivery
      </p>

      <div className="bg-white border rounded-lg p-6 mt-8 text-left">
        <h2 className="font-semibold mb-3">Shipping to</h2>
        <p className="text-sm text-gray-600">{order.shipping_name}</p>
        <p className="text-sm text-gray-600">{order.shipping_address}, {order.shipping_city} - {order.shipping_pincode}</p>
        <p className="text-sm text-gray-600">Phone: {order.shipping_phone}</p>

        <h2 className="font-semibold mt-5 mb-3">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span>{item.product_name} × {item.quantity} (Size {item.size})</span>
            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center mt-8">
        <Link to="/orders" className="bg-dark text-white px-6 py-3 rounded-md font-semibold">View My Orders</Link>
        <Link to="/products" className="border px-6 py-3 rounded-md font-semibold">Continue Shopping</Link>
      </div>
    </div>
  );
}
