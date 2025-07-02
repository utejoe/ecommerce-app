require("dotenv").config();
const port = 3300;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Ensure upload directory exists
const uploadPath = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Base API route
app.get("/", (req, res) => {
  res.send("UyiJ is here");
});

// Multer storage config
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

// Serve static images
app.use("/images", express.static("upload/images"));

// Schema for Creating Products
const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // Avoid duplicate IDs
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);

// ✅ POST Route to Add Product
app.post("/addproduct", async (req, res) => {
  try {
    // Efficiently get last product to auto-increment ID
    const last_product = await Product.findOne().sort({ id: -1 });
    const id = last_product ? last_product.id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      available: req.body.available ?? true,
    });

    await product.save();
    console.log("Product saved:", product);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Upload image endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Creating API  for deleting products

app.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    console.log("Product removed:", deletedProduct);

    res.json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
});

// ✅ GET Route to Fetch All Products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 }); // Sorted by ID (ascending)

    console.log(`[GET] /allproducts - Returned ${products} products`);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

// Start server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});
