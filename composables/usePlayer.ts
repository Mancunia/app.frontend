import type { PdfFileData, PLAY_CHAPTER, PLAYER } from "~/types/book";
import { playChapter } from "~/services/play";

export const usePlayer = (app: USER_ROLES) => {
  const audio = useState<HTMLAudioElement>("player", () => new Audio());
  const pdfFile = useState<PdfFileData | null>("pdfData", () => null);
  const audioFile = ref<PLAY_CHAPTER | null>(null);
  const validTime = ref(0);
  const duration = ref(0);
  const currentTime = ref(0);
  const loading = ref<boolean>(false);
  const { checkForOldFile } = useUtils();
  const store = useAuthStore();
  const { addError } = useToast();
  const { pdfData, loading: pdfLoading, error, readPdf } = usePdfReader();
  const fetchChapter = async (chapterId: string) => {
    try {
      loading.value = true;
      const res = await playChapter(chapterId, app);
      return res;
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

  if (audio.value) {
    const getCurrentTime = (): number => audio.value.currentTime;
    audio.value.addEventListener("timeupdate", () => {
      const time = getCurrentTime();
      currentTime.value = time;
    });

    audio.value.addEventListener("loadedmetadata", () => {
      duration.value = audio.value.duration;
    });
  }

  const calculateTime = async (chapter: PLAY_CHAPTER) => {
    if (!chapter) return;

    await new Promise<void>((resolve) => {
      const element = audio.value;

      if (element.readyState >= 1) {
        resolve();
        return;
      }

      const onLoaded = () => {
        element.removeEventListener("loadedmetadata", onLoaded);
        resolve();
      };

      element.addEventListener("loadedmetadata", onLoaded);
    });

    const d = audio.value.duration;
    console.log({ d });

    duration.value = d;

    const ratio = chapter.playTime === 0 ? 0 : d / chapter.playTime;

    validTime.value = ratio;
  };

  const initPDF = async (chapter: PLAY_CHAPTER) => {
    try{
      const data = await readPdf(
      chapter.chapter.content as string,
      chapter.chapter.password as string
    );
    if (data) {
      pdfFile.value = data;
    }
    }
    catch(error){
      console.error(error)
    }
    
  };

  const init = async (chapter: PLAY_CHAPTER) => {
    if (!chapter) return;
    let file = checkForOldFile(chapter.chapter.content ?? "");
    stopAudio();
    audio.value.src = file;
    audioFile.value = chapter;
    if (audio.value.src) {
      await audio.value.load();
      await playAudio();
      await calculateTime(chapter);
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
    audio.value.src = "";
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

 const seekAudio = (position: number): void => {
   const element = audio.value;
   const max = validTime.value;
   const target = position > duration.value ? duration.value : position
   element.currentTime = target;
 };


  const playerDetails = (details: Partial<PLAYER>) => {
    store.setPlayer({
      ...details,
    });
  };

  watch(
    () => audio.value.currentTime,
    () => {
      if (audio.value.currentTime >= validTime.value) {
        audio.value.currentTime = validTime.value;
        stopAudio();
      }
    }
  );

  return {
    init,
    initPDF,
    duration,
    currentTime,
    toggleAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    muteAudio,
    unmuteAudio,
    setVolume,
    fastForwardAudio,
    rewindAudio,
    seekAudio,
    playerDetails,
    player: audioFile,
    fetchChapter,
    loading: loading.value ?? pdfLoading.value,
    pdfData,
    error,
  };
};
