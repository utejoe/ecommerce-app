require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { type } = require("os");

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
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
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

// Create schema and model for User

const User = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating Endpoint for registering the user
app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "Existing user found with same email address",
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Creating endpoint for user login
app.post('/login', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    const passCompare = req.body.password === user.password;

    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      };

      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }

  } else {
    res.json({ success: false, errors: "Wrong Email address" });
  }
});

//Creating endpoint for newcollections data
app.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 }); // Optional: sort by ID
    const newcollection = products.slice(-8); // Get last 8 items
    console.log(
      "✅ [GET] /newcollections - Returned",
      newcollection.length,
      "items"
    );
    res.json({ success: true, products: newcollection });
  } catch (error) {
    console.error("❌ Error fetching new collections:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch new collections" });
  }
});

// ✅ Creating endpoint for popular in women
app.get('/popularinwomen', async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });

    res.status(200).json({
      success: true,
      products,
    });

    console.log("[GET] /popularinwomen - Returned", products.length, "products");
  } catch (error) {
    console.error("❌ Error fetching popular women products:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch popular products for women",
      error: error.message,
    });
  }
});

// Creating endpoint for adding products in cartdata

// Start server
app.listen(PORT, (error) => {
  if (error) {
    console.error("❌ Failed to start server:", error);
  } else {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  }
});
