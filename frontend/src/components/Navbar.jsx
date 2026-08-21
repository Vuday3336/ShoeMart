import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineSearch, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineUser,
  HiOutlineMenu, HiOutlineX, HiChevronDown,
} from "react-icons/hi";
import api from "../api/axios";
import { logout } from "../store/slices/authSlice";
import { resetCartState, selectCartCount } from "../store/slices/cartSlice";
import { resetWishlistState } from "../store/slices/wishlistSlice";
import { openCartDrawer } from "../store/slices/uiSlice";

const STATIC_LINKS = ["Running", "Casual", "Formal", "Sneakers", "Sports", "Basketball", "Training", "Slides"];

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      api.get("/products/suggest", { params: { q: query } }).then((res) => setSuggestions(res.data)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCartState());
    dispatch(resetWishlistState());
    navigate("/");
    setUserMenuOpen(false);
  };

  const submitSearch = (q) => {
    if (!q.trim()) return;
    navigate(`/products?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Announcement bar */}
      <div className="bg-brand-600 text-white text-xs font-medium text-center py-1.5 px-4">
        Free shipping over ₹2,999 &nbsp;•&nbsp; Cash on Delivery available &nbsp;•&nbsp; Easy 7-day returns
      </div>

      <div className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button className="md:hidden p-1" onClick={() => setMobileOpen(true)}>
            <HiOutlineMenu size={24} />
          </button>

          <Link to="/" className="text-2xl font-display font-extrabold tracking-tight flex-shrink-0">
            Shoe<span className="text-brand-500">Mart</span>
          </Link>

          {/* Desktop nav with mega menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-4">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link to="/products" className="flex items-center gap-1 hover:text-brand-500 transition py-2">
                Shop <HiChevronDown size={14} />
              </Link>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-0 bg-white text-dark rounded-lg shadow-xl border border-gray-100 p-5 grid grid-cols-4 gap-x-8 gap-y-3 w-[520px]"
                  >
                    {STATIC_LINKS.map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${encodeURIComponent(cat)}`}
                        className="text-sm hover:text-brand-600 transition whitespace-nowrap"
                      >
                        {cat}
                      </Link>
                    ))}
                    <Link
                      to="/products"
                      className="col-span-4 mt-2 pt-3 border-t text-brand-600 font-semibold text-sm hover:underline"
                    >
                      View all products →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {user && <Link to="/orders" className="hover:text-brand-500 transition">My Orders</Link>}
          </nav>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-md mx-auto hidden sm:block">
            <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
              <HiOutlineSearch size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch(query)}
                placeholder="Search shoes, brands, categories..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 ml-2 w-full"
              />
            </div>
            <AnimatePresence>
              {searchOpen && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full mt-2 w-full bg-white text-dark rounded-lg shadow-xl border border-gray-100 overflow-hidden"
                >
                  {suggestions.map((s) => (
                    <Link
                      key={s.id}
                      to={`/products/${s.id}`}
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition"
                    >
                      <img src={s.image_url} alt="" className="w-9 h-9 rounded object-cover bg-gray-100" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.brand} · ₹{Number(s.price).toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => submitSearch(query)}
                    className="w-full text-left px-4 py-2.5 text-sm text-brand-600 font-medium hover:bg-gray-50 border-t"
                  >
                    See all results for "{query}" →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 ml-auto md:ml-0 flex-shrink-0">
            <button className="sm:hidden p-1" onClick={() => setSearchOpen((v) => !v)}>
              <HiOutlineSearch size={20} />
            </button>

            {user && (
              <Link to="/wishlist" className="relative hover:text-brand-500 transition" title="Wishlist">
                <HiOutlineHeart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <button
                onClick={() => dispatch(openCartDrawer())}
                className="relative hover:text-brand-500 transition"
                title="Cart"
              >
                <HiOutlineShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-sm bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-700 transition"
                >
                  <HiOutlineUser size={16} /> {user.name.split(" ")[0]} <HiChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-44 bg-white text-dark rounded-lg shadow-xl overflow-hidden border border-gray-100"
                    >
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">
                        My Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-red-600 border-t"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="text-sm bg-brand-500 px-4 py-1.5 rounded-full hover:bg-brand-600 transition font-medium">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="sm:hidden px-4 pb-3">
            <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
              <HiOutlineSearch size={16} className="text-gray-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch(query)}
                placeholder="Search shoes..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 ml-2 w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <span className="font-display font-bold text-lg">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <HiOutlineX size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <p className="px-5 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Shop by category</p>
                {STATIC_LINKS.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-2.5 text-sm hover:bg-gray-50"
                  >
                    {cat}
                  </Link>
                ))}
                <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-5 py-2.5 text-sm font-semibold text-brand-600 border-t mt-2 pt-3">
                  View all products
                </Link>
                {user && (
                  <>
                    <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-5 py-2.5 text-sm hover:bg-gray-50 border-t mt-2 pt-3">
                      My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-5 py-2.5 text-sm hover:bg-gray-50">
                      Wishlist
                    </Link>
                    <Link to="/cart" onClick={() => setMobileOpen(false)} className="block px-5 py-2.5 text-sm hover:bg-gray-50">
                      Cart
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="block w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                )}
                {!user && (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-5 py-2.5 text-sm font-semibold text-brand-600 border-t mt-2 pt-3">
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
