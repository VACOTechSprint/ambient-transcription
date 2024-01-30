const AudioPlayer = (props) => {
  const playAudio = () => {
      if (props.audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }

  return props.audioBlob ? <button onClick={playAudio}>Play Recording</button> : null;

};

export default AudioPlayer;