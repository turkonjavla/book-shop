const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
  Product.fetchAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
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
      });
    })
    .catch(err => console.error(err.message));
};

exports.getCart = (req, res) => {
  req.user.getCart().then(products => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    });
  });
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => console.error(err));
};

exports.postRemoveProductFromCart = (req, res) => {
  const productId = req.body.productId;
  req.user
    .deleteItemFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.error(err.message));
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', { path: '/orders', pageTitle: 'Orders' });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.error(err.message));
};
