const pool = require("../config/db");

// @route  GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id AS cart_item_id, c.quantity, c.size, p.*
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GetCart error:", err.message);
    res.status(500).json({ message: "Server error fetching cart" });
  }
};

// @route  POST /api/cart   { product_id, quantity, size }
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1, size = "9" } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: "product_id is required" });
    }

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [product_id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If item with same product+size already in cart, increase quantity instead of duplicating
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity, size)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, product_id, size)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [req.user.id, product_id, quantity, size]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("AddToCart error:", err.message);
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

// @route  PUT /api/cart/:cartItemId   { quantity }
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "quantity must be at least 1" });
    }

    const result = await pool.query(
      `UPDATE cart_items SET quantity = $1
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [quantity, req.params.cartItemId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("UpdateCartItem error:", err.message);
    res.status(500).json({ message: "Server error updating cart item" });
  }
};

// @route  DELETE /api/cart/:cartItemId
exports.removeCartItem = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.cartItemId, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("RemoveCartItem error:", err.message);
    res.status(500).json({ message: "Server error removing cart item" });
  }
};

// @route  DELETE /api/cart   (clear entire cart)
exports.clearCart = async (req, res) => {
  try {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("ClearCart error:", err.message);
    res.status(500).json({ message: "Server error clearing cart" });
  }
};
