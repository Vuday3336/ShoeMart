import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineTruck, HiOutlineCash, HiOutlineRefresh, HiOutlineShieldCheck, HiArrowRight,
} from "react-icons/hi";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const BRANDS = ["Nova", "SkyJump", "EaseWear", "Kicks Co", "Regalio", "PeakGear", "Zenith", "Apex", "Vantage", "Stridewell"];

const FEATURES = [
  { icon: HiOutlineTruck, title: "Free Shipping", desc: "On orders over ₹2,999" },
  { icon: HiOutlineCash, title: "Cash on Delivery", desc: "Pay when it arrives" },
  { icon: HiOutlineRefresh, title: "Easy Returns", desc: "7-day return window" },
  { icon: HiOutlineShieldCheck, title: "Secure Checkout", desc: "Your data stays safe" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/products/categories"),
      api.get("/products", { params: { isNew: true, limit: 8, sort: "newest" } }),
      api.get("/products", { params: { isBestseller: true, limit: 8, sort: "rating" } }),
    ])
      .then(([cats, arrivals, best]) => {
        setCategories(cats.data);
        setNewArrivals(arrivals.data.products);
        setBestsellers(best.data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed! Watch your inbox for drops.");
    setEmail("");
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10 relative z-10">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex-1">
            <span className="inline-block bg-brand-500/15 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
              New Season Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              Step Into <span className="text-brand-500">Style</span> &amp; Comfort
            </h1>
            <p className="mt-5 text-gray-300 max-w-md text-lg">
              Discover running, casual, formal, and sport shoes from top brands — all in one place.
              Fast checkout, cash on delivery, and easy returns.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 transition px-7 py-3.5 rounded-full font-semibold"
              >
                Shop Now <HiArrowRight />
              </Link>
              <Link
                to="/products?isBestseller=true"
                className="inline-flex items-center gap-2 border border-gray-600 hover:border-white transition px-7 py-3.5 rounded-full font-semibold"
              >
                Bestsellers
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <motion.img
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop"
              alt="Featured shoe"
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </motion.div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <f.icon className="text-brand-500 flex-shrink-0" size={28} />
              <div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Shop by Category</h2>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c, i) => (
              <motion.div
                key={c.category}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(c.category)}`}
                  className="group relative block aspect-square rounded-xl overflow-hidden"
                >
                  <img
                    src={c.image_url}
                    alt={c.category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-display font-bold text-lg">{c.category}</p>
                    <p className="text-white/70 text-xs">{c.count} styles</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      {bestsellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Best Sellers</h2>
            <Link to="/products?isBestseller=true" className="text-brand-600 font-medium hover:underline text-sm flex items-center gap-1">
              View all <HiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Brand strip */}
      <section className="py-8 border-y border-gray-100 bg-white overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="mx-8 text-xl font-display font-bold text-gray-300 select-none">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold">New Arrivals</h2>
            <Link to="/products?isNew=true" className="text-brand-600 font-medium hover:underline text-sm flex items-center gap-1">
              View all <HiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-dark text-white mt-6">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Never miss a drop</h2>
          <p className="text-gray-400 mt-2">Subscribe for early access to new arrivals and member-only offers.</p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-gray-800 border border-gray-700 text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" className="bg-brand-500 hover:bg-brand-600 transition px-6 py-3 rounded-full font-semibold text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
