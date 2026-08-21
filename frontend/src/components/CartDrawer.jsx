import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineX, HiOutlineShoppingBag, HiOutlineMinus, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { closeCartDrawer } from "../store/slices/uiSlice";
import { updateCartItem, removeCartItem, selectCartTotal } from "../store/slices/cartSlice";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.cartDrawerOpen);
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);

  const close = () => dispatch(closeCartDrawer());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <HiOutlineShoppingBag /> Your Bag ({items.length})
              </h2>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full transition">
                <HiOutlineX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-3">
                  <HiOutlineShoppingBag size={48} className="text-gray-300" />
                  <p>Your bag is empty.</p>
                  <Link
                    to="/products"
                    onClick={close}
                    className="text-brand-600 font-medium hover:underline text-sm"
                  >
                    Start shopping →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Size {item.size}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => dispatch(updateCartItem({ cartItemId: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                              className="p-1.5 hover:bg-gray-100"
                            >
                              <HiOutlineMinus size={12} />
                            </button>
                            <span className="px-2.5 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateCartItem({ cartItemId: item.id, quantity: item.quantity + 1 }))}
                              className="p-1.5 hover:bg-gray-100"
                            >
                              <HiOutlinePlus size={12} />
                            </button>
                          </div>
                          <span className="font-semibold text-sm">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeCartItem(item.id))}
                        className="text-gray-400 hover:text-red-600 transition self-start p-1"
                        title="Remove"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total.toLocaleString()}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={close}
                  className="block text-center bg-dark text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
                >
                  Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={close}
                  className="block text-center text-sm text-gray-600 hover:text-dark transition"
                >
                  View full bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
