const { corsMiddleware } = require('./corsMiddleware');

exports.helloWorld = (req, res) => {
  corsMiddleware(req, res, () => {
    res.send('Hello, World!');
  });
};

const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'vaco-upload-bucket';


exports.generateSignedUrl = async (req, res) => {
  corsMiddleware(req, res, async () => {
    const fileName = req.query.fileName; // or passed via POST body

    if (!fileName) {
      return res.status(500).send({error: 'fileName is required'});
    }

    try {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(fileName);

      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
        contentType: 'audio/webm',
      });

      res.send({url});
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  });
};

exports.asrPipelineFunction = (event, callback) => {
  const file = event.data; // The Cloud Functions event data will contain the file metadata.

  if (file.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
  } else if (file.metageneration === '1') {
    // The metageneration attribute is incremented each time the metadata of an existing object changes.
    // For newly created objects, this is 1.
    console.log(`New file: ${file.name}`);
  } else {
    console.log(`File updated: ${file.name}`);
  }

  callback(); // Complete the function execution
};