import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

const categories = ["Running", "Casual", "Formal", "Sneakers", "Sports", "Basketball", "Training", "Slides"];

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2">
            <Link to="/" className="text-2xl font-display font-extrabold tracking-tight text-white">
              Shoe<span className="text-brand-500">Mart</span>
            </Link>
            <p className="mt-3 max-w-xs text-gray-400">
              Premium footwear for every step — running, sport, and street. Fast checkout, cash on delivery, and easy 7-day returns.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[FaInstagram, FaFacebookF, FaTwitter, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((c) => (
                <li key={c}>
                  <Link to={`/products?category=${encodeURIComponent(c)}`} className="hover:text-white transition">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Login / Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Get in touch</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <HiOutlineMail className="mt-0.5 flex-shrink-0" size={15} />
                <a href="mailto:support@shoemart.example" className="hover:text-white transition">support@shoemart.example</a>
              </li>
              <li className="flex items-start gap-2">
                <HiOutlinePhone className="mt-0.5 flex-shrink-0" size={15} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <HiOutlineLocationMarker className="mt-0.5 flex-shrink-0" size={15} />
                <span>Hyderabad, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <p>&copy; {new Date().getFullYear()} ShoeMart. All rights reserved.</p>
          <p>Built with React, Redux Toolkit, Node.js, Express &amp; Supabase (PostgreSQL)</p>
        </div>
      </div>
    </footer>
  );
}
