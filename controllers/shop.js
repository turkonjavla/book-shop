const Product = require('../models/product');

exports.getIndex = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => console.error(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(err => console.error(err));
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;

  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => console.error(err));
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your cart',
            products,
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.error(err));
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } }); // return an array of products (which is going to be 1)
    })
    .then(products => {
      let product;

      if (products.length > 0) {
        product = products[0]; // gets one product returned from previous .then()
      }

      // increase quantity
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      // add new product to cart
      return Product.findByPk(productId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.error(err));
};

exports.postRemoveProductFromCart = (req, res) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];

      return product.cartItem.destroy();
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.error(err));
};

exports.postOrder = (req, res) => {
  let fetchCart;
  req.user
    .getCart()
    .then(cart => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      req.user
        .createOrder()
        .then(order => {
          order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product; // returns old product data with the quantity field
            })
          );
        })
        .catch(err => console.error(err));
    })
    .then(() => {
      return fetchCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.error(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] }) // eager loading __ fetches all related products per order
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders',
        orders,
      });
    })
    .catch(err => console.error(err));
};
