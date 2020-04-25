const products = [];

exports.getAddProduct = (req, res) => {
  res.render('add-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
  });
};

exports.postNewProduct = (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
};

exports.getProducts = (req, res) => {
  res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });
};
