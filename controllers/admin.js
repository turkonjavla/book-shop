const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;

  Product.create({
    title,
    price,
    imageUrl,
    description,
  })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.error(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findByPk(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch(err => console.error(err));
};

exports.postEditProduct = (req, res) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(productId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;

      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.error(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('admin/admin-product-list', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.error(err));
  res.redirect('/admin/products');
};
