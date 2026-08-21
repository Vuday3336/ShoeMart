const pool = require("../config/db");

// @route  POST /api/orders
// body: { shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode }
// Creates an order (COD) from the user's current cart, then clears the cart.
exports.createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode } = req.body;

    if (!shipping_name || !shipping_phone || !shipping_address || !shipping_city || !shipping_pincode) {
      return res.status(400).json({ message: "All shipping details are required" });
    }

    await client.query("BEGIN");

    const cartResult = await client.query(
      `SELECT c.id AS cart_item_id, c.quantity, c.size, p.id AS product_id, p.name, p.price, p.image_url, p.stock
       FROM cart_items c JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    const cartItems = cartResult.rows;
    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const orderResult = await client.query(
      `INSERT INTO orders
        (user_id, total_amount, payment_method, status, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode)
       VALUES ($1,$2,'COD','Pending',$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.id, totalAmount, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode]
    );
    const order = orderResult.rows[0];

    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, size)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [order.id, item.product_id, item.name, item.image_url, item.price, item.quantity, item.size]
      );
      await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.product_id]);
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

    await client.query("COMMIT");

    res.status(201).json({ order, message: "Order placed successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CreateOrder error:", err.message);
    res.status(500).json({ message: "Server error placing order" });
  } finally {
    client.release();
  }
};

// @route  GET /api/orders  (order history for logged-in user)
exports.getOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
        return { ...order, items: items.rows };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error("GetOrders error:", err.message);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// @route  GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    const items = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [req.params.id]);
    res.json({ ...orderResult.rows[0], items: items.rows });
  } catch (err) {
    console.error("GetOrderById error:", err.message);
    res.status(500).json({ message: "Server error fetching order" });
  }
};

// @route  PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];
    if (!["Pending", "Processing"].includes(order.status)) {
      return res.status(400).json({ message: `Order cannot be cancelled once it is ${order.status}` });
    }

    const updated = await pool.query(
      "UPDATE orders SET status = 'Cancelled' WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    // Restock items since order was cancelled
    const items = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [req.params.id]);
    for (const item of items.rows) {
      if (item.product_id) {
        await pool.query("UPDATE products SET stock = stock + $1 WHERE id = $2", [item.quantity, item.product_id]);
      }
    }

    res.json({ order: updated.rows[0], message: "Order cancelled successfully" });
  } catch (err) {
    console.error("CancelOrder error:", err.message);
    res.status(500).json({ message: "Server error cancelling order" });
  }
};
