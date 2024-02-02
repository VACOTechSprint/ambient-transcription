import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class ASRUploader extends React.Component {
  uploadAudio = async () => {
    const { audioBlob, timestamp } = this.props;
    const formData = new FormData();

    // Append the audio blob and any additional data you need
    formData.append('audio_file', audioBlob, `${timestamp}.wav`);

    try {
      console.log('Sending data')
      const response = await axios({
        method: 'post',
        url: 'http://34.86.191.55:9000/asr?task=transcribe&encode=true&output=json&diarize=true',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json',
        },
        timeout: 120000, // 2-minute timeout
      });

      console.log('ASR Response:', response.data);
      // Handle the response as needed
    } catch (error) {
      console.error('Error uploading audio:', error);
      // Handle the error as needed
    }
  };

  render() {
    return (
      <div>
        <button onClick={this.uploadAudio}>Upload Audio</button>
      </div>
    );
  }
}

ASRUploader.propTypes = {
  audioBlob: PropTypes.instanceOf(Blob).isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default ASRUploader;
