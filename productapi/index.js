const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoute = require("./routes/product.route");

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Node API hello");
});

// Routes
app.use("/api/products", productRoute);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Connection Failed!", error);
  });
