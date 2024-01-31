// src/App.jsx
import { useState } from 'react';

import AudioRecorder from './components/AudioRecorder';
import AudioPlayer from "./components/AudioPlayer.jsx";
import HelloWorld from "./components/HelloWorld.jsx";
import AudioUploader from "./components/AudioUploader.jsx";

function App() {
      const [audioBlob, setAudioBlob] = useState(null);

    return (
        <div className="App">
            <HelloWorld />
            <AudioRecorder setAudioBlob={setAudioBlob} />
            <AudioPlayer audioBlob={audioBlob} />
            <AudioUploader />

        </div>
    );
}

export default App;