const express = require("express");
const router = express.Router();
const {
  getProducts,
  getCategories,
  getBrands,
  suggestProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/suggest", suggestProducts);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
