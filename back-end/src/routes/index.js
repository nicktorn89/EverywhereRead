function routes(app) {
  app.get('/', (req, res) => {
    res.render('index.html');
  });

  app.get('/reader', (req, res) => {
    res.render('index.html');
  });

  app.get('/signup', (req, res) => {
    res.render('index.html');
  });
}

module.exports = {
  routes,
};
