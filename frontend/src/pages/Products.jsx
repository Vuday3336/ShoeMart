import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineFilter, HiOutlineX, HiChevronRight } from "react-icons/hi";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const selectedCategories = (searchParams.get("category") || "").split(",").filter(Boolean);
  const selectedBrands = (searchParams.get("brand") || "").split(",").filter(Boolean);
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const isNew = searchParams.get("isNew") || "";
  const isBestseller = searchParams.get("isBestseller") || "";

  useEffect(() => {
    api.get("/products/categories").then((res) => setCategories(res.data)).catch(() => {});
    api.get("/products/brands").then((res) => setBrands(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (q) params.q = q;
    if (selectedCategories.length) params.category = selectedCategories.join(",");
    if (selectedBrands.length) params.brand = selectedBrands.join(",");
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (isNew) params.isNew = isNew;
    if (isBestseller) params.isBestseller = isBestseller;

    api
      .get("/products", { params })
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, searchParams.toString()]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const toggleListParam = (key, value, list) => {
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    updateParam(key, next.join(","));
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => setSearchParams({});

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (isNew ? 1 : 0) + (isBestseller ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-brand-600 hover:underline font-medium">
            Clear all
          </button>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Category</p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
          {categories.map((c) => (
            <label key={c.category} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c.category)}
                onChange={() => toggleListParam("category", c.category, selectedCategories)}
                className="rounded accent-brand-500"
              />
              {c.category} <span className="text-gray-400 text-xs">({c.count})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Brand</p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleListParam("brand", b, selectedBrands)}
                className="rounded accent-brand-500"
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Price range (₹)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParam("minPrice", e.target.value)}
            className="border rounded-md px-2.5 py-1.5 text-sm w-full"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParam("maxPrice", e.target.value)}
            className="border rounded-md px-2.5 py-1.5 text-sm w-full"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isNew === "true"} onChange={() => updateParam("isNew", isNew ? "" : "true")} className="rounded accent-brand-500" />
          New arrivals only
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isBestseller === "true"} onChange={() => updateParam("isBestseller", isBestseller ? "" : "true")} className="rounded accent-brand-500" />
          Bestsellers only
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <Link to="/" className="hover:text-dark">Home</Link>
        <HiChevronRight size={12} />
        <span className="text-dark font-medium">
          {selectedCategories.length === 1 ? selectedCategories[0] : "Shop All"}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {q ? `Results for "${q}"` : selectedCategories.length === 1 ? selectedCategories[0] : "Shop All Shoes"}
        </h1>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-1.5 border rounded-md px-3 py-2 text-sm font-medium"
        >
          <HiOutlineFilter size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-xl border border-gray-100 p-5 h-fit sticky top-24">
          {FilterPanel}
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">{loading ? "Loading..." : `${total} products`}</p>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No products found. Try adjusting your filters.</p>
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                className="grid grid-cols-2 md:grid-cols-3 gap-5"
              >
                {products.map((p) => (
                  <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-md text-sm ${
                        p === page ? "bg-dark text-white" : "bg-white border hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-[70] shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <span className="font-display font-bold">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <HiOutlineX size={20} />
                </button>
              </div>
              <div className="p-5">{FilterPanel}</div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-dark text-white py-3 rounded-md font-semibold"
                >
                  Show {total} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
