const { corsMiddleware } = require('./corsMiddleware');
const axios = require('axios');

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

exports.asrPipelineFunction = async (event, context) => {
  let fileResponse; // Define outside to ensure availability throughout the function scope

  try {
    const { mediaLink, name } = event;
    console.log(`Processing file: ${name}`);

    // Get the file from the Cloud Storage bucket
    fileResponse = await axios({
      method: 'get',
      url: mediaLink,
      responseType: 'arraybuffer'
    });

    // Upload the file to the ASR endpoint
    const asrResponse = await axios({
      method: 'post',
      url: 'http://34.86.191.55:9000', // Replace with your ASR endpoint URL
      data: fileResponse.data,
      headers: {
        'Content-Type': 'audio/webm', // Adjust the content type if necessary
      }
    });

    console.log(`ASR Response: ${JSON.stringify(asrResponse.data)}`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
};