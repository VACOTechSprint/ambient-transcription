exports.helloWorld = (req, res) => {
  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Response header
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    // Set CORS headers for the main request
    res.set('Access-Control-Allow-Origin', '*');
    res.send('Hello, World!');
  }
};