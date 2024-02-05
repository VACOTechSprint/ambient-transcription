const axios = require('axios');
const {GoogleAuth} = require('google-auth-library');

const { corsMiddleware } = require('./corsMiddleware');

exports.helloWorld = (req, res) => {
  corsMiddleware(req, res, () => {
    res.send('Hello, World!');
  });
};

const {Storage} = require('@google-cloud/storage');
const {createReadStream} = require("fs");
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

const { Readable } = require('stream'); // Node.js built-in module

// Function to convert ArrayBuffer to Stream
function bufferToStream(buffer) {
  return new Readable({
    read() {
      this.push(buffer);
      this.push(null); // Signifies the end of the stream
    },
  });
}

exports.asrPipelineFunction = async (event, context) => {
  let fileResponse; // Define outside to ensure availability throughout the function scope
  console.log('Event', event)
  try {
    const { mediaLink, name } = event;

    console.log(`Processing file: ${name}`);

    // Test the /docs endpoint to ensure it's working
    try {
      const testResponse = await axios.get('http://34.86.191.55:9000/docs');
      console.log("Testing /docs endpoint: Success", testResponse.status);
    } catch (testError) {
      console.error("Testing /docs endpoint: Failed", testError);
      // Optionally, handle the error (e.g., retry, skip the next steps, etc.)
    }

    // Create a Google Auth client with the Cloud Function's credentials
    const auth = new GoogleAuth();
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    // Get the file from the Cloud Storage bucket
    fileResponse = await axios({
      method: 'get',
      url: mediaLink,
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Include the access token in the request
      },
    });

    // Assuming you've obtained fileResponse.data as an ArrayBuffer
    const fileBuffer = Buffer.from(fileResponse.data);
    const fileStream = bufferToStream(fileBuffer);

    const formData = new FormData();
    formData.append('audio_file', fileStream, name);

    const asrResponse = await axios({
      method: 'post',
      url: 'http://34.86.191.55:9000/asr?task=transcribe&encode=true&output=json&diarize=true', // Replace with your ASR endpoint URL
      data: formData,
      timeout: 120000,  // 2-minute timeout
      headers: {
        ...formData.getHeaders(), // Include the headers from FormData, which contain the Content-Type with boundary
        'accept': 'application/json',
      },
    });

    console.log(`ASR Response: ${JSON.stringify(asrResponse.data)}`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
};