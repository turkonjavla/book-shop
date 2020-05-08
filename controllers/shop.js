const chalk = require('chalk');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  Product.find().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.error(err.message));
};

exports.getProductDetails = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.error(err.message));
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.error(err));
};

exports.postRemoveProductFromCart = (req, res) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.error(err.message));
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id }).then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Orders',
      orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }, // gives access to all the data when using _doc
        };
      });

      const order = new Order({
        user: {
          email: req.session.user.email,
          userId: req.session.user, // mongoose will automatically pick the id
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => res.redirect('/orders'))
    .catch(err =>
      console.error(
        chalk.redBright('Error wehn creating an order. ', err.message)
      )
    );
};
