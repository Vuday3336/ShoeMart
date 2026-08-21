import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import { openCartDrawer } from "../store/slices/uiSlice";
import Loader from "../components/Loader";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold mb-2">Your wishlist is empty 🤍</p>
        <Link to="/products" className="text-brand-600 font-medium hover:underline">Browse products →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Link to={`/products/${product.id}`}>
              <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover" />
            </Link>
            <div className="p-4">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-brand-600 font-bold">₹{Number(product.price).toLocaleString()}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    dispatch(addToCart({ product_id: product.id, quantity: 1, size: "9" }));
                    toast.success(`${product.name} added to bag`);
                    dispatch(openCartDrawer());
                  }}
                  className="flex-1 bg-dark text-white text-xs py-2 rounded-md"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="text-xs border px-3 rounded-md text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
