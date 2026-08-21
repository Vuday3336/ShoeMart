import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/orders" className="text-sm text-brand-600 hover:underline">← Back to Orders</Link>
      <h1 className="text-2xl font-bold mt-2">Order #{order.id}</h1>
      <p className="text-sm text-gray-500">Status: <span className="font-medium">{order.status}</span></p>

      <div className="bg-white border rounded-lg p-6 mt-6">
        <h2 className="font-semibold mb-3">Shipping Details</h2>
        <p className="text-sm text-gray-600">{order.shipping_name} · {order.shipping_phone}</p>
        <p className="text-sm text-gray-600">{order.shipping_address}, {order.shipping_city} - {order.shipping_pincode}</p>

        <h2 className="font-semibold mt-6 mb-3">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2 border-b pb-2">
            <span>{item.product_name} × {item.quantity} (Size {item.size})</span>
            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>₹{Number(order.total_amount).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
