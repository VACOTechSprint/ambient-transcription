import React, { useState } from 'react';
import axios from 'axios';

const HelloWorld = () => {
  const [message, setMessage] = useState('');

  const fetchMessage = async () => {
    const config = {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_APP_GCF_BEARER_TOKEN}` }
    };

    try {
      const response = await axios.get('https://us-east4-vacotechsprint.cloudfunctions.net/hello-world-function', config);
      setMessage(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to fetch message');
    }
  };

  return (
    <div>
      <button onClick={fetchMessage}>Fetch Hello World</button>
      <p>{message}</p>
    </div>
  );
};

export default HelloWorld;
