import React, { useState } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.onstart = () => {
        console.log('Recording started'); // Debugging log
        setIsRecording(true);
      };
      recorder.onstop = () => {
        console.log('Recording stopped'); // Debugging log
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




