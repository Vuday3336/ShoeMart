const pool = require("../config/db");

// @route  GET /api/products
// Supports: ?q=search&category=Running,Sports&brand=Nova,Apex&minPrice=0&maxPrice=5000
//           &sort=price_asc|price_desc|newest|rating&page=1&limit=12&isNew=true&isBestseller=true
exports.getProducts = async (req, res) => {
  try {
    const { q, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12, isNew, isBestseller } = req.query;

    const conditions = [];
    const values = [];
    let idx = 1;

    if (q) {
      conditions.push(`(name ILIKE $${idx} OR brand ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${q}%`);
      idx++;
    }
    if (category) {
      const categories = category.split(",").map((c) => c.trim()).filter(Boolean);
      conditions.push(`category = ANY($${idx})`);
      values.push(categories);
      idx++;
    }
    if (brand) {
      const brands = brand.split(",").map((b) => b.trim()).filter(Boolean);
      conditions.push(`brand = ANY($${idx})`);
      values.push(brands);
      idx++;
    }
    if (minPrice) {
      conditions.push(`price >= $${idx}`);
      values.push(minPrice);
      idx++;
    }
    if (maxPrice) {
      conditions.push(`price <= $${idx}`);
      values.push(maxPrice);
      idx++;
    }
    if (isNew === "true") {
      conditions.push(`is_new = true`);
    }
    if (isBestseller === "true") {
      conditions.push(`is_bestseller = true`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    let orderBy = "created_at DESC";
    if (sort === "price_asc") orderBy = "price ASC";
    else if (sort === "price_desc") orderBy = "price DESC";
    else if (sort === "newest") orderBy = "created_at DESC";
    else if (sort === "rating") orderBy = "rating DESC";

    const offset = (Number(page) - 1) * Number(limit);

    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataQuery = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
    const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

    res.json({
      products: dataResult.rows,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("GetProducts error:", err.message);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// @route  GET /api/products/categories
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, COUNT(*)::int AS count,
              (ARRAY_AGG(image_url ORDER BY id))[1] AS image_url
       FROM products GROUP BY category ORDER BY category`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GetCategories error:", err.message);
    res.status(500).json({ message: "Server error fetching categories" });
  }
};

// @route  GET /api/products/brands
exports.getBrands = async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL ORDER BY brand");
    res.json(result.rows.map((r) => r.brand));
  } catch (err) {
    console.error("GetBrands error:", err.message);
    res.status(500).json({ message: "Server error fetching brands" });
  }
};

// @route  GET /api/products/suggest?q=
// Lightweight endpoint for navbar live-search suggestions.
exports.suggestProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json([]);
    const result = await pool.query(
      `SELECT id, name, brand, category, price, image_url FROM products
       WHERE name ILIKE $1 OR brand ILIKE $1 OR category ILIKE $1
       ORDER BY name LIMIT 6`,
      [`%${q.trim()}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("SuggestProducts error:", err.message);
    res.status(500).json({ message: "Server error fetching suggestions" });
  }
};

// @route  GET /api/products/:id/related
exports.getRelatedProducts = async (req, res) => {
  try {
    const current = await pool.query("SELECT category FROM products WHERE id = $1", [req.params.id]);
    if (current.rows.length === 0) return res.json([]);
    const result = await pool.query(
      `SELECT * FROM products WHERE category = $1 AND id != $2 ORDER BY RANDOM() LIMIT 4`,
      [current.rows[0].category, req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GetRelatedProducts error:", err.message);
    res.status(500).json({ message: "Server error fetching related products" });
  }
};

// @route  GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("GetProductById error:", err.message);
    res.status(500).json({ message: "Server error fetching product" });
  }
};

// @route  POST /api/products  (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, brand, category, price, stock, image_url, sizes } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ message: "name, category and price are required" });
    }
    const result = await pool.query(
      `INSERT INTO products (name, description, brand, category, price, stock, image_url, sizes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, description, brand, category, price, stock || 0, image_url, sizes || "6,7,8,9,10,11"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CreateProduct error:", err.message);
    res.status(500).json({ message: "Server error creating product" });
  }
};

// @route  PUT /api/products/:id  (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, brand, category, price, stock, image_url, sizes } = req.body;
    const result = await pool.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        brand = COALESCE($3, brand),
        category = COALESCE($4, category),
        price = COALESCE($5, price),
        stock = COALESCE($6, stock),
        image_url = COALESCE($7, image_url),
        sizes = COALESCE($8, sizes)
       WHERE id = $9 RETURNING *`,
      [name, description, brand, category, price, stock, image_url, sizes, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("UpdateProduct error:", err.message);
    res.status(500).json({ message: "Server error updating product" });
  }
};

// @route  DELETE /api/products/:id  (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DeleteProduct error:", err.message);
    res.status(500).json({ message: "Server error deleting product" });
  }
};
