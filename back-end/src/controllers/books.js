const multer = require('multer');
const fs = require('fs');
const { unlink } = require('fs/promises');
const { existsAsync, setAsync, incrAsync, getAsync, hSetAsync, hgetAsync, deleteAsync } = require('../redisClient');

const upload = multer({
  dest: './public/pdf',
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
      return;
    }

    cb(new Error('Wrong file type'));
  },
});

const books = (app) => {
  app.get('/rest/books', async (req, res) => {
    if (!req.user) return res.status(401).send('Unathorized');

    const userBookId = await getAsync(`userBooks:${req.user}`);

    console.log('userBookId', userBookId);

    return res.status(200).send(userBookId);
  });

  app.post(
    '/rest/books',
    upload.single('data'),
    async (req, res) => {
      if (!req.user) return res.status(401).send('Unathorized');
      if (!req.file) return res.status(400).send('File is empty');

      const prevBook = await existsAsync('books:');

      if (!prevBook) {
        await setAsync('books:', '10000');
      } else {
        await incrAsync('books:');
      }

      const currentBookId = await getAsync('books:');

      const oldUserBookId = await getAsync(`userBooks:${req.user}`);

      if (oldUserBookId) {
        const fileName = await hgetAsync(`books:${oldUserBookId}`, 'fileName');

        if (fs.existsSync(`./public/pdf/${fileName}`)) {
          await unlink(`./public/pdf/${fileName}`);
        }

        await deleteAsync(`books:${currentBookId}`);
      }

      await setAsync(`userBooks:${req.user}`, currentBookId);

      await hSetAsync(
        `books:${currentBookId}`,
        'originalName', req.file.originalname,
        'fileName', req.file.filename,
        'creationDate', new Date().valueOf(),
      );

      return res.status(200).send();
    },
  );

  app.delete(
    '/rest/books/:bookId',
    async (req, res) => {
      const { bookId } = req.params;

      if (!req.user) return res.status(401).send('Unathorized');
      if (!bookId) return res.status(400).send('Book id is empty');

      const currentUserBookId = await getAsync(`userBooks:${req.user}`);

      if (currentUserBookId !== bookId) {
        return res.status(400).send('Book id is not belongs to user');
      }

      if (currentUserBookId) {
        const fileName = await hgetAsync(`books:${currentUserBookId}`, 'fileName');

        if (fs.existsSync(`./public/pdf/${fileName}`)) {
          await unlink(`./public/pdf/${fileName}`);
        }

        await deleteAsync(`books:${currentUserBookId}`);
      }

      await setAsync(`userBooks:${req.user}`, '');

      return res.status(200).send();
    },
  );
};

module.exports = books;
