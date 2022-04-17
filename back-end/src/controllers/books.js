const multer = require('multer');
const fs = require('fs');

const { promisify } = require('util');
const { mkdirsSync } = require('fs-extra');
const { unlink } = require('fs/promises');

const { PDFDocument } = require('pdf-lib');
const { fromPath } = require('pdf2pic');

const readFile = promisify(fs.readFile);

const { existsAsync, setAsync, incrAsync, getAsync, hSetAsync, hgetAsync, deleteAsync, rpushAsync, lrangeAsync } = require('../redisClient');
const { promiseAllWithConcurrency } = require('../promiseAllWithConcurrency');

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
    const userImages = await lrangeAsync(`images:${userBookId}`, 0, -1);
    const fileName = await hgetAsync(`books:${userBookId}`, 'fileName');
    const isFormatted = await hgetAsync(`books:${userBookId}`, 'isFormatted') === 'true';

    return res.status(200).send({
      userBookId,
      userImages,
      fileName,
      isFormatted,
    });
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

        if (fs.existsSync(`./public/images/${fileName}`)) {
          fs.rmSync(`./public/images/${fileName}`, { recursive: true, force: true });
        }

        await deleteAsync(`books:${currentBookId}`);
        await deleteAsync(`images:${currentBookId}`);
      }

      await setAsync(`userBooks:${req.user}`, currentBookId);

      await hSetAsync(
        `books:${currentBookId}`,
        'originalName', req.file.originalname,
        'fileName', req.file.filename,
        'creationDate', new Date().valueOf(),
        'isFormatted', false,
      );

      res.status(200).send();

      const imagesOutputDir = `./public/images/${req.file.filename}`;
      const pdfFilePath = `./public/pdf/${req.file.filename}`;

      const pdfFileAsBuffer = await readFile(pdfFilePath);

      const pdfDoc = await PDFDocument.load(pdfFileAsBuffer);
      const pageCount = pdfDoc.getPageCount();

      const options = {
        density: 100,
        saveFilename: req.file.filename,
        savePath: imagesOutputDir,
        format: 'webp',
        width: 1240,
        height: 1748,
      };

      const storeAsImage = fromPath(pdfFilePath, options);

      mkdirsSync(imagesOutputDir);

      const pagesArray = new Array(pageCount).fill(null).map((_, index) => index + 1);

      const savePageAsImage = (pageNumber) => async () => {
        const { path: imagePath } = await storeAsImage(pageNumber);

        return imagePath;
      };

      const imagesPaths = await promiseAllWithConcurrency(pagesArray.map((pageNumber) => savePageAsImage(pageNumber)), 5);

      await rpushAsync(`images:${currentBookId}`, ...imagesPaths);
      await hSetAsync(`books:${currentBookId}`, 'isFormatted', true);
    },
  );

  app.delete(
    '/rest/books/:bookId',
    async (req, res) => {
      try {
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

          if (fs.existsSync(`./public/images/${fileName}`)) {
            fs.rmSync(`./public/images/${fileName}`, { recursive: true, force: true });
          }

          await deleteAsync(`books:${currentUserBookId}`);
          console.log('delete async books');
          await deleteAsync(`images:${currentUserBookId}`);
          console.log('delete async images');
        }

        await deleteAsync(`userBooks:${req.user}`);

        return res.status(200).send();
      } catch (error) {
        console.error('Error while deleting book');

        return res.status(500).send(error);
      }
    },
  );
};

module.exports = books;
