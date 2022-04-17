// collection is array of functions that return promise
// each function will fire when it will be in thread
const promiseAllWithConcurrency = (collection, n = 6) => {
  let i = 0;
  let jobsList = collection.length;
  const resultData = [];
  let rejected = false;

  // create a new promise and capture reference to resolve and reject to avoid nesting of code
  let resolve;
  let reject;

  const resultPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  if (collection.length === 0) {
    resolve([]);

    return [];
  }

  const runJob = (j) => {
    collection[j]()
      .then((result) => {
        if (rejected) {
          return;
        }

        jobsList--;
        resultData[j] = result;

        if (jobsList <= 0) {
          resolve(resultData);
        } else if (i < collection.length) {
          runJob(i);
          i++;
        }
      })
      .catch((e) => {
        console.error(`[promiseAllWithConcurrency][runJob] Error: ${e}`);
        if (rejected) {
          return;
        }

        rejected = true;
        reject(e);
      });
  };

  while (i < Math.min(collection.length, n)) {
    runJob(i);
    i++;
  }

  return resultPromise;
};

module.exports = {
  promiseAllWithConcurrency,
};
