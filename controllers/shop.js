const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  Product.find().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
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
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.getProductDetails = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.postRemoveProductFromCart = (req, res) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join('data', 'invoices', invoiceName);

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found'));
      }

      console.log(order.user.userId.toString());
      console.log(req.user._id.toString());

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Error when comapring'));
      }

      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'inline; filename="' + invoiceName + '"'
        );
        res.send(data);
      });
    })
    .catch(err => console.error('Error when getting invoice. ', err.message));
};
