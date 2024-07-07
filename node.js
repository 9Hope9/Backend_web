const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// MongoDB setup
const mongoURI = 'mongodb+srv://ajadav1971:d82iTE5woXTm62NZ@cluster0.o5vlzvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
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
  


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });