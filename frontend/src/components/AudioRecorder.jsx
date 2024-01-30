import React, { useState } from 'react';

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      };
      recorder.onstart = () => {
        console.log('Recording started'); // Debugging log
        setIsRecording(true);
      };
      recorder.onstop = () => {
        console.log('Recording stopped'); // Debugging log
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        props.setAudioBlob(audioBlob);
        setIsRecording(false);
      };
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
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




