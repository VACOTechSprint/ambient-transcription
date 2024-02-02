import React, {useState} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const ASRUploader = ({ audioBlob, timestamp }) => {
  const [uploadStatus, setUploadStatus] = useState(''); // To keep track of the upload status
  const [responseData, setResponseData] = useState(null); // To store the response data

  const uploadAudio = async () => {
    const formData = new FormData();

    // Append the audio blob and any additional data you need
    formData.append('audio_file', audioBlob, `${timestamp}.wav`);

    try {
      setUploadStatus('Sending data...');
      const response = await axios({
        method: 'post',
        url: 'https://34.86.191.55:9000/asr?task=transcribe&encode=true&output=json&diarize=true',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json',
        },
        timeout: 120000, // 2-minute timeout
      });
      setUploadStatus('Data sent successfully!');
      setResponseData(response.data);
      console.log('ASR Response:', response.data);
      // Handle the response as needed
    } catch (error) {
      setUploadStatus('Error uploading audio');
      console.error('Error uploading audio:', error);
      // Handle the error as needed
    }
  };

  return (
    <div>
      <button onClick={uploadAudio}>Upload Audio</button>
      <p>{uploadStatus}</p>
      {responseData && (
        <div>
          <p>Response:</p>
          {/* Assuming the response data has a 'segment' object with text attributes */}
          {responseData.segments.map((segment, index) => (
            <p key={index}>{segment.text}</p>
          ))}
        </div>
      )}
    </div>
  );
};

ASRUploader.propTypes = {
  audioBlob: PropTypes.instanceOf(Blob).isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default ASRUploader;