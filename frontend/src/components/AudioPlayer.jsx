import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ audioBlob }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;

      // Cleanup function to revoke the object URL
      return () => URL.revokeObjectURL(audioUrl);
    }
  }, [audioBlob]);

  return (
    <div>
      <audio ref={audioRef} controls />
    </div>
  );
};


export default AudioPlayer;