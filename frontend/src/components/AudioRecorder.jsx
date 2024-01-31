// src/components/AudioRecorder.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  let audioChunks = [];

  const startRecording = async () => {
    audioChunks = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {mimeType: "audio/webm"});

      recorder.ondataavailable = (event) => {
        console.info('Recorder data available', event);
        audioChunks.push(event.data); // Collect chunks into the local array
      };
      recorder.onstart = () => {
        console.log('Recording started'); // Debugging log
        setIsRecording(true);
      };
      recorder.onstop = () => {
        console.log('Recording stopped'); // Debugging log
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        console.log("Blob created", audioBlob)
        props.setAudioBlob(audioBlob);
        setIsRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  AudioRecorder.propTypes = {
  setAudioBlob: PropTypes.func.isRequired,
};

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
  <div>
    {isRecording ? (
      <button onClick={stopRecording}>Stop Recording</button>
    ) : (
      <button onClick={startRecording}>Start Recording</button>
    )}

    {isRecording && <p>Recording...</p>}

  </div>
  );
};




export default AudioRecorder;




