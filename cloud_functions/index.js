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