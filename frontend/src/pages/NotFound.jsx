import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-gray-300">404</h1>
      <p className="text-lg font-semibold mt-4">Page not found</p>
      <Link to="/" className="text-brand-600 font-medium hover:underline mt-2 inline-block">
        Go back home
      </Link>
    </div>
  );
}
