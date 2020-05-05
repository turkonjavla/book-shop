const chalk = require('chalk');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = async (req, res) => {
  const product = new Product({ ...req.body });

  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.error(chalk.redBright(err.message)));
};

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('admin/admin-product-list', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.error(chalk.redBright(err.message)));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(productId)
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
    .catch(err => console.error(calk.redBright(err.message)));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, price, imageUrl, description } = req.body;

  Product.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        title,
        imageUrl,
        price,
        description,
      },
    },
    { new: true }
  )
    .then(() => res.redirect('/admin/products'))
    .catch(err =>
      console.error(
        chalk.redBright('Error when updating product: ', err.message)
      )
    );
};

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteById(productId).then(() => res.redirect('/admin/products'));
};
