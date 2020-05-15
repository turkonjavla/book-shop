const chalk = require('chalk');
const { validationResult } = require('express-validator');
const fileHelper = require('../utils/fileUtil');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const userId = req.user;
  const image = req.file;
  const imageUrl = image ? image.path : null;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: 'Attached file is not an image',
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  const product = new Product({
    ...req.body,
    imageUrl,
    userId,
  });

  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.error(chalk.redBright(err.message));
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/admin-product-list', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
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
        hasError: false,
        errorMessage: null,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: productId,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then(() => res.redirect('/admin/products'));
    })
    .catch(err => {
      console.error(
        chalk.redBright('Error when editing a product', err.message)
      );
      const error = new Error(err);
      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found'));
      }

      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json({ message: 'success' });
    })
    .catch(err => res.status(500).json({ message: `Deleting failed, ${err}` }));
};
