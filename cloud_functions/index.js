exports.helloWorld = (req, res) => {
  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Response header

  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    // Set CORS headers for the main request
    res.send('Hello, World!');
  }
};

const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'vaco-upload-bucket';


exports.generateSignedUrl = async (req, res) => {
  const fileName = req.query.fileName; // or passed via POST body

  if (!fileName) {
    return res.status(500).send({ error: 'fileName is required' });
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

    res.send({ url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};