// src/App.jsx
import React, { useState } from 'react';

import AudioRecorder from './components/AudioRecorder';
import AudioPlayer from "./components/AudioPlayer.jsx";

function App() {
      const [audioBlob, setAudioBlob] = useState(null);

      return (
        <div className="App">
          <AudioRecorder setAudioBlob={setAudioBlob} />
          <AudioPlayer audioBlob={audioBlob} />
        </div>
      );
}

export default App;