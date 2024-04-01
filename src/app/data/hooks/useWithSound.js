import { useRef, useEffect } from "react";

export const useWithSound = (audioSource) => {
  const soundRef = useRef();

  useEffect(() => {
    soundRef.current = new Audio(audioSource);
  }, []);

  const playSound = () => {
    soundRef.current.play();
  };

  const pauseSound = () => {
    soundRef.current.pause();
  };

  return {
    playSound,
    pauseSound,
  };
};
