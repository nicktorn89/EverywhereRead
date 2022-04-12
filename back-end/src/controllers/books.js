const multer = require('multer');
const fs = require('fs');
const { unlink } = require('fs/promises');
const { existsAsync, setAsync, incrAsync, getAsync, hSetAsync, hgetAsync, deleteAsync } = require('../redisClient');

const upload = multer({
  dest: './public/',
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
      return;
    }

    cb(new Error('Wrong file type'));
  },
});

const books = (app) => {
  app.post(
    '/rest/books',
    upload.single('data'),
    async (req, res) => {
      if (!req.user) return res.status(401).send('Unathorized');

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
        console.log('fileName', fileName);

        if (fs.existsSync(`./public/${fileName}`)) {
          await unlink(`./public/${fileName}`);
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
};

module.exports = books;
