function routes(app) {
  app.get('/', (req, res) => {
    if (req.user) {
      res.redirect('/reader');
    } else {
      res.render('index.html');
    }
  });

  app.get('/reader', (req, res) => {
    if (req.user) {
      res.render('index.html');
    } else {
      res.redirect('/');
    }
  });

  app.get('/signup', (req, res) => {
    res.render('index.html');
  });
}

module.exports = {
  routes,
};
