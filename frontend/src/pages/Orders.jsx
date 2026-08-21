import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    api.get("/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold mb-2">No orders yet</p>
        <Link to="/products" className="text-brand-600 font-medium hover:underline">Start shopping →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg p-5">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              {order.items.slice(0, 2).map((item) => (
                <p key={item.id}>{item.product_name} × {item.quantity}</p>
              ))}
              {order.items.length > 2 && <p>+ {order.items.length - 2} more item(s)</p>}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="font-bold">₹{Number(order.total_amount).toLocaleString()}</p>
              <div className="flex gap-3">
                <Link to={`/orders/${order.id}`} className="text-sm text-brand-600 font-medium hover:underline">
                  View Details
                </Link>
                {["Pending", "Processing"].includes(order.status) && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={cancellingId === order.id}
                    className="text-sm text-red-600 font-medium hover:underline disabled:opacity-50"
                  >
                    {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
