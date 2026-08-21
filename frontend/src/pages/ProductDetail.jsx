import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiHeart, HiOutlineHeart, HiStar, HiChevronRight, HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import api from "../api/axios";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";
import { openCartDrawer } from "../store/slices/uiSlice";

const TABS = ["Description", "Details", "Shipping & Returns"];

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState(TABS[0]);

  useEffect(() => {
    setLoading(true);
    setTab(TABS[0]);
    setActiveImage(0);
    setQuantity(1);
    window.scrollTo({ top: 0 });
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSize(res.data.sizes.split(",")[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    api.get(`/products/${id}/related`).then((res) => setRelated(res.data)).catch(() => {});
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-20">Product not found.</p>;

  const gallery = [product.image_url, product.hover_image_url].filter(Boolean);
  const isWishlisted = wishlistItems.some((w) => w.id === product.id);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!user) return toast.error("Please login to add items to your cart");
    dispatch(addToCart({ product_id: product.id, quantity, size }));
    toast.success(`${product.name} added to bag`);
    dispatch(openCartDrawer());
  };

  const handleWishlist = () => {
    if (!user) return toast.error("Please login to use your wishlist");
    if (isWishlisted) dispatch(removeFromWishlist(product.id));
    else {
      dispatch(addToWishlist(product.id));
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-dark">Home</Link>
        <HiChevronRight size={12} />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-dark">{product.category}</Link>
        <HiChevronRight size={12} />
        <span className="text-dark font-medium truncate">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative">
            {(product.is_new || product.is_bestseller || discount > 0) && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.is_new && <span className="bg-dark text-white text-[10px] font-bold px-2 py-1 rounded uppercase">New</span>}
                {product.is_bestseller && <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Bestseller</span>}
                {discount > 0 && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">-{discount}%</span>}
              </div>
            )}
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              src={gallery[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 mt-3">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    activeImage === i ? "border-dark" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-1.5 mt-2">
            <HiStar className="text-amber-400" size={16} />
            <span className="text-sm font-medium">{Number(product.rating).toFixed(1)}</span>
            <span className="text-sm text-gray-400">({product.review_count || 0} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <p className="text-3xl font-bold text-gray-900">₹{Number(product.price).toLocaleString()}</p>
            {product.original_price && (
              <p className="text-lg text-gray-400 line-through">₹{Number(product.original_price).toLocaleString()}</p>
            )}
            {discount > 0 && <span className="text-sm font-semibold text-green-600">Save {discount}%</span>}
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Select Size (UK)</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.split(",").map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-11 h-11 rounded-md border text-sm transition ${
                    size === s ? "bg-dark text-white border-dark" : "hover:border-dark"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center border rounded-md">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-gray-50"><HiOutlineMinus size={13} /></button>
              <span className="px-4 text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-2.5 hover:bg-gray-50"><HiOutlinePlus size={13} /></button>
            </div>
          </div>

          <p className="text-sm mt-4">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">In stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600 font-medium">Out of stock</span>
            )}
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-dark text-white py-3.5 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="px-5 py-3.5 border rounded-full font-semibold hover:bg-gray-50 transition flex items-center gap-2"
            >
              {isWishlisted ? <HiHeart className="text-brand-500" size={18} /> : <HiOutlineHeart size={18} />}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-t pt-6">
            <div className="flex gap-6 border-b">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-3 text-sm font-medium transition border-b-2 -mb-px ${
                    tab === t ? "border-dark text-dark" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="py-5 text-sm text-gray-600 leading-relaxed">
              {tab === "Description" && <p>{product.description}</p>}
              {tab === "Details" && (
                <ul className="space-y-1.5">
                  <li><span className="font-medium text-gray-900">Brand:</span> {product.brand}</li>
                  <li><span className="font-medium text-gray-900">Category:</span> {product.category}</li>
                  <li><span className="font-medium text-gray-900">Available sizes (UK):</span> {product.sizes}</li>
                  <li><span className="font-medium text-gray-900">SKU:</span> SM-{String(product.id).padStart(5, "0")}</li>
                </ul>
              )}
              {tab === "Shipping & Returns" && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Free shipping on orders over ₹2,999 — usually delivered in 3–6 business days.</li>
                  <li>Cash on Delivery available at checkout.</li>
                  <li>7-day easy returns on unworn items in original packaging.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
