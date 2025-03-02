import type { PLAYER } from "~/types/book";

export const usePlayer = () => {
  const audio = useState<HTMLAudioElement>("player", () => new Audio());
  const { checkForOldFile } = useUtils();
  const store = useAuthStore();
  const { addError } = useToast();
  const init = async (audioFile: string) => {
    let file = checkForOldFile(audioFile);
    stopAudio();
    audio.value.src = file;
    if (audio.value.src) {
      await audio.value.load();
      await playAudio();
    }

    audio.value.addEventListener("ended", async () => {
      await playerDetails({ playing: false });
    });
    audio.value.addEventListener("pause", async () => {
      await playerDetails({ playing: false });
    });
    audio.value.addEventListener("play", async () => {
      await playerDetails({ playing: true });
    });
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
    try {
      audio.value.play();
      playerDetails({ playing: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        addError(error.message);
      } else {
        addError("An error occurred while playing the audio");
      }
    }
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
    playerDetails({ volume: 0 });
  };

  const unmuteAudio = () => {
    audio.value.muted = false;
    playerDetails({ volume: audio.value.volume });
  };

  const setVolume = (volume: number) => {
    if (!audio.value) return; // Check for null audio element
    const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
    audio.value.volume = normalizedVolume;
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
    player: audio,
  };
};
