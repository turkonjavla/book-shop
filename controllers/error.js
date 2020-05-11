exports.get404 = (req, res) => {
  res.render('404', {
    pageTitle: '404 | Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res) => {
  res.render('500', {
    pageTitle: '500 | Internal Server error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
};
