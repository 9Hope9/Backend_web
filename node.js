const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// MongoDB setup

const mongoURI = 'mongodb+srv://ajadav1971:d82iTE5woXTm62NZ@cluster0.o5vlzvn.mongodb.net/assignment2?retryWrites=true&w=majority&appName=Cluster0'; 
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Models
const productSchema = new mongoose.Schema({
    description: String,
    image: String,
    pricing: Number,
    shippingCost: Number
  });
  const Product = mongoose.model('Product', productSchema);
  
  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    shippingAddress: String
  });
  const User = mongoose.model('User', userSchema);
  
  const commentSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    images: [String],
    text: String
  });
  const Comment = mongoose.model('Comment', commentSchema);
  
  const cartSchema = new mongoose.Schema({
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  const Cart = mongoose.model('Cart', cartSchema);
  
  const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    orderDate: { type: Date, default: Date.now }
  });
  const Order = mongoose.model('Order', orderSchema);
  

// Product Routes
app.post('/products', async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.get('/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send();
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // User Routes
  app.post('/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Comment Routes
  app.post('/comments', async (req, res) => {
    try {
      const comment = new Comment(req.body);
      await comment.save();
      res.status(201).send(comment);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get('/comments', async (req, res) => {
    try {
      const comments = await Comment.find().populate('product').populate('user');
      res.status(200).send(comments);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Cart Routes
  app.post('/carts', async (req, res) => {
    try {
      const cart = new Cart(req.body);
      await cart.save();
      res.status(201).send(cart);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get('/carts/user/:userId', async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.params.userId }).populate('products.product');
      if (!cart) {
        return res.status(404).send();
      }
      res.status(200).send(cart);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Order Routes
  app.post('/orders', async (req, res) => {
    try {
      const order = new Order(req.body);
      await order.save();
      res.status(201).send(order);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find().populate('user').populate('products.product');
      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send(error);
    }
  });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });