const express = require("express");
const Product = require("../models/product.model.js");
const router = express.Router();
//connects to the controller.js file
const {
  getProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
} = require('../controllers/product.controller.js');

//calls the function in the product controller to get all the products
router.get("/", getProducts);
//calls the function in the product controller to get a single product by id
router.get("/:id", getProduct);
//calls the function in the product controller to  create a product
router.post("/", createProduct);
//calls the function in the product controller to edit a single product by id
router.put("/:id", editProduct);
//calls the function in the product controller to delete a single product by id
router.delete("/:id", deleteProduct);

module.exports = router;
