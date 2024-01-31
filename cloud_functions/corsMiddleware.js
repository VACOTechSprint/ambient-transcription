// corsMiddleware.js
const setCorsHeaders = (res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
};

const corsMiddleware = (req, res, next) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.status(204).send('');
  } else {
    next(req, res);
  }
};

module.exports = { corsMiddleware };
