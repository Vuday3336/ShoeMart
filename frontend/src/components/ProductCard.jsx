import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiHeart, HiOutlineHeart, HiOutlineShoppingBag, HiStar } from "react-icons/hi";
import toast from "react-hot-toast";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";
import { openCartDrawer } from "../store/slices/uiSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((w) => w.id === product.id);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to add items to your cart");
    dispatch(addToCart({ product_id: product.id, quantity: 1, size: (product.sizes || "9").split(",")[0] }));
    toast.success(`${product.name} added to bag`);
    dispatch(openCartDrawer());
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to use your wishlist");
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
      toast.success("Added to wishlist");
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/products/${product.id}`}
        className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          {product.hover_image_url && (
            <img
              src={product.hover_image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:scale-105"
            />
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {product.is_new && (
              <span className="bg-dark text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">New</span>
            )}
            {product.is_bestseller && (
              <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Bestseller</span>
            )}
            {discount > 0 && (
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">-{discount}%</span>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow z-10 hover:scale-110 transition-transform"
            title="Toggle wishlist"
          >
            {isWishlisted ? <HiHeart className="text-brand-500" size={16} /> : <HiOutlineHeart size={16} />}
          </button>

          {product.stock <= 0 && (
            <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
              Out of stock
            </span>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="absolute bottom-0 left-0 right-0 bg-dark text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 disabled:opacity-40 disabled:cursor-not-allowed z-10"
          >
            <HiOutlineShoppingBag size={14} /> Quick Add
          </button>
        </div>

        <div className="p-4">
          <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 text-sm truncate mt-0.5">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <HiStar className="text-amber-400" size={13} />
            <span className="text-xs text-gray-500">{Number(product.rating).toFixed(1)}{product.review_count ? ` (${product.review_count})` : ""}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-gray-900">₹{Number(product.price).toLocaleString()}</span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">₹{Number(product.original_price).toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
