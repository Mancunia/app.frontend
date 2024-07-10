export const usePlayer = () => {
    const playerProps = ref({
        playing: false,
        autoplay: false,
        loop: false,
        muted: false,
        volume: 1,
    });
    const toggleAudio = (audio: HTMLAudioElement) => {
      if (playerProps.value.playing) {
        pauseAudio(audio);
        playerProps.value.playing = false;
      } else {
        playAudio(audio);
        playerProps.value.playing = true;
      }
    };
  const playAudio = (audio: HTMLAudioElement) => {
    audio.play();
    return playerProps.value.playing = true;
  };

  const pauseAudio = (audio: HTMLAudioElement) => {
    audio.pause();
  };

  const stopAudio = (audio: HTMLAudioElement) => {
    audio.pause();
    audio.currentTime = 0;
  };

  const muteAudio = (audio: HTMLAudioElement) => {
    audio.muted = true;
  };

  const unmuteAudio = (audio: HTMLAudioElement) => {
    audio.muted = false;
  };

  const setVolume = (audio: HTMLAudioElement, volume: number) => {
    audio.volume = volume;
  };

const fastForwardAudio = (audio: HTMLAudioElement, seconds: number) => {
    audio.currentTime += seconds;
};

const rewindAudio = (audio: HTMLAudioElement, seconds: number) => {
    audio.currentTime -= seconds;
};


  return {
    toggleAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    muteAudio,
    unmuteAudio,
    setVolume,
    fastForwardAudio,
    rewindAudio,
    playerProps
  };
};
