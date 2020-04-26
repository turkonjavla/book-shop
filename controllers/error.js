exports.get404 = (req, res) => {
  res.render('404', { pageTitle: '404 | Not Found', path: '' });
};
