import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to ShoeMart</h1>

      {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
        <input
          type="email" placeholder="Email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          type="password" placeholder="Password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <button
          type="submit" disabled={loading}
          className="w-full bg-dark text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-600 font-medium hover:underline">Register</Link>
      </p>
    </div>
  );
}
