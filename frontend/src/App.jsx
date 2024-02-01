// src/App.jsx
import { useState } from 'react';

import AudioRecorder from './components/AudioRecorder';
import AudioPlayer from "./components/AudioPlayer.jsx";
import HelloWorld from "./components/HelloWorld.jsx";
import AudioUploader from "./components/AudioUploader.jsx";

function App() {
      const [audioBlob, setAudioBlob] = useState(null);
      const [timestamp, setTimestamp] = useState(null);

    return (
        <div className="App">
            <HelloWorld />
            <AudioRecorder setAudioBlob={setAudioBlob}  setTimestamp={setTimestamp} />
            <AudioPlayer audioBlob={audioBlob} />
            <AudioUploader audioBlob={audioBlob} timestamp={timestamp}/>

        </div>
    );
}

export default App;