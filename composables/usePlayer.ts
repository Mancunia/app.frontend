import type { PLAY_CHAPTER, PLAYER } from "~/types/book";
import { playChapter } from "~/services/play";

export const usePlayer = (chapterId: string, app: USER_ROLES) => {
  const audio = useState<HTMLAudioElement>("player", () => new Audio());
  const audioFile = ref<PLAY_CHAPTER | null>(null);
  const validTime = ref(0);
  const loading = ref<boolean>(false);
  const { checkForOldFile } = useUtils();
  const store = useAuthStore();
  const { addError } = useToast();

  const fetchChapter = async () => {
    try {
      loading.value = true;
      const res = await playChapter(chapterId, app);
      if (res) {
        audioFile.value = res.data;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        addError(error.message);
      } else {
        addError("An error occurred while fetching the chapter");
      }
    } finally {
      loading.value = false;
    }
  };

  const calculateTime = async () => {
    if (!audioFile.value) return;
    const duration = audio.value.duration;
    const playable = duration / audioFile.value.playTime;
    validTime.value = playable;
  };

  const init = async () => {
    if (!audioFile.value) return;
    let file = checkForOldFile(audioFile.value.chapter.content);
    stopAudio();
    audio.value.src = file;
    if (audio.value.src) {
      await audio.value.load();
      await playAudio();
      await calculateTime();
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

  watch(()=>audio.value.currentTime, () => {
    console.log("audio changed", audio.value.currentTime, validTime.value);
    if (audio.value.currentTime >= validTime.value) {
      audio.value.currentTime = validTime.value;
      stopAudio();
    }
  });

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
    player: audioFile,
    fetchChapter,
    loading,
  };
};
