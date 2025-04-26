const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Sample product data
const products = [
  {
    name: 'Product 1',
    description: 'Description for product 1',
    price: 29.99,
    image: '/images/product1.jpg',
    category: 'Electronics',
    countInStock: 10
  },
  // Add more sample products
];

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Import data
const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();