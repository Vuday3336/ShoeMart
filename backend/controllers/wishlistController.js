const pool = require("../config/db");

// @route  GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.id AS wishlist_item_id, p.*
       FROM wishlist_items w
       JOIN products p ON p.id = w.product_id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GetWishlist error:", err.message);
    res.status(500).json({ message: "Server error fetching wishlist" });
  }
};

// @route  POST /api/wishlist   { product_id }
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: "product_id is required" });
    }

    const result = await pool.query(
      `INSERT INTO wishlist_items (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [req.user.id, product_id]
    );

    res.status(201).json(result.rows[0] || { message: "Already in wishlist" });
  } catch (err) {
    console.error("AddToWishlist error:", err.message);
    res.status(500).json({ message: "Server error adding to wishlist" });
  }
};

// @route  DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM wishlist_items WHERE product_id = $1 AND user_id = $2 RETURNING id",
      [req.params.productId, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("RemoveFromWishlist error:", err.message);
    res.status(500).json({ message: "Server error removing from wishlist" });
  }
};
