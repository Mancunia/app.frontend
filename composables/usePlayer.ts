import type { PLAYER } from "~/types/book";

export const usePlayer = () => {
  const audio = useState<HTMLAudioElement>("player", () => new Audio());

  const store = useAuthStore();
  const init = async (audioFile: string) => {
    let file = audioFile;
     stopAudio();
    if (!file.includes("s3")) {
      if (file.startsWith("//")) {
        file = file.replace("//", "/");
      }
      file = `https://anansesemfie.com${file}`;
      console.log("has AWS:", audioFile.includes("aws"), file);
    }
    audio.value.src = file;
    if (audio.value.src) {
      await audio.value.load();
      await playAudio();
    }
  };
  const toggleAudio = async () => {
    if (store.getPlayer.playing) {
      await pauseAudio();
      await playerDetails({ playing: false });
    } else {
      await playAudio();
      await playerDetails({ playing: true });
    }
  };
  const playAudio = () => {
    audio.value.play();
    playerDetails({ playing: true });
  };

  const pauseAudio = () => {
    audio.value.pause();
  };

  const stopAudio = () => {
    audio.value.pause();
    audio.value.currentTime = 0;
  };

  const muteAudio = () => {
    audio.value.muted = true;
  };

  const unmuteAudio = () => {
    audio.value.muted = false;
  };

  const setVolume = (volume: number) => {
    audio.value.volume = volume;
  };

  const fastForwardAudio = (seconds: number) => {
    audio.value.currentTime += seconds;
  };

  const rewindAudio = (seconds: number) => {
    audio.value.currentTime -= seconds;
  };

  const playerDetails = (details: Partial<PLAYER>) => {
    store.setPlayer({
      ...details,
    });
  };

  return {
    init,
    toggleAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    muteAudio,
    unmuteAudio,
    setVolume,
    fastForwardAudio,
    rewindAudio,
    playerDetails,
  };
};
