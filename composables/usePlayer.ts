import type { PdfFileData, PLAY_CHAPTER, PLAYER, CHAPTER } from "~/types/book";
import { playChapter } from "~/services/play";

export const usePlayer = (app?: USER_ROLES) => {
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

  const queue = computed(() => store.getQueue);
  const queueIndex = computed(() => store.getQueueIndex);
  const hasNext = computed(() => queueIndex.value < queue.value.length - 1);
  const hasPrev = computed(() => queueIndex.value > 0);
  const playPromise = useState<Promise<void> | null>("playPromise", () => null);

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
      store.setPlaying(chapter.chapter);
      const data = await readPdf(
      chapter.chapter.content as string,
      chapter.chapter.password ?? undefined
    );
    if (data) {
      pdfFile.value = data;
    }
    }
    catch(error){
      console.error(error)
    }
    
  };

  const onEnded = async () => {
    if (hasNext.value) {
      await playNextInQueue();
    } else {
      await playerDetails({ playing: false });
    }
  };
  const onPause = async () => {
    await playerDetails({ playing: false });
  };
  const onPlay = async () => {
    await playerDetails({ playing: true });
  };

  const init = async (chapter: PLAY_CHAPTER, autoPlay = true) => {
    if (!chapter) return;
    store.setPlaying(chapter.chapter);
    let file = checkForOldFile(chapter.chapter.content ?? "");
    await stopAudio();
    audio.value.src = file;
    audioFile.value = chapter;
    if (audio.value.src) {
      await audio.value.load();
      audio.value.playbackRate = store.getPlayer.playbackRate ?? 1;
      audio.value.volume = store.getPlayer.volume ?? 1;
      if (autoPlay) {
        await playAudio();
      } else {
        playerDetails({ playing: false });
      }
      await calculateTime(chapter);
    }

    audio.value.removeEventListener("ended", onEnded);
    audio.value.removeEventListener("pause", onPause);
    audio.value.removeEventListener("play", onPlay);
    audio.value.addEventListener("ended", onEnded);
    audio.value.addEventListener("pause", onPause);
    audio.value.addEventListener("play", onPlay);
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
  const playAudio = async () => {
    try {
      const promise = audio.value.play();
      playPromise.value = promise;
      await promise;
      playerDetails({ playing: true });
    } catch (error: any) {
      if (error.name === "AbortError") {
        return;
      }
      if (error instanceof Error) {
        addError(error.message);
      } else {
        addError("An error occurred while playing the audio");
      }
    } finally {
      playPromise.value = null;
    }
  };

  const pauseAudio = async () => {
    if (playPromise.value) {
      try {
        await playPromise.value;
      } catch (e) {
        // ignore
      }
    }
    audio.value.pause();
  };

  const stopAudio = async () => {
    if (playPromise.value) {
      try {
        await playPromise.value;
      } catch (e) {
        // ignore
      }
    }
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
    if (!audio.value) return;
    const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
    audio.value.volume = normalizedVolume;
  };

  const SPEED_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const playbackRate = ref(1);
  const setPlaybackRate = (rate: number) => {
    const clamped = Math.max(0.25, Math.min(4, rate));
    audio.value.playbackRate = clamped;
    playbackRate.value = clamped;
    playerDetails({ playbackRate: clamped });
  };
  const increaseSpeed = () => {
    const current = audio.value.playbackRate;
    const next = SPEED_PRESETS.find(s => s > current) ?? SPEED_PRESETS[SPEED_PRESETS.length - 1];
    setPlaybackRate(next);
  };
  const decreaseSpeed = () => {
    const current = audio.value.playbackRate;
    const prev = [...SPEED_PRESETS].reverse().find(s => s < current) ?? SPEED_PRESETS[0];
    setPlaybackRate(prev);
  };
  const cycleSpeed = () => {
    const current = audio.value.playbackRate;
    const idx = SPEED_PRESETS.indexOf(current);
    const next = SPEED_PRESETS[(idx + 1) % SPEED_PRESETS.length];
    setPlaybackRate(next);
  };

  const fastForwardAudio = (seconds: number) => {
    audio.value.currentTime += seconds;
  };

  const rewindAudio = (seconds: number) => {
    audio.value.currentTime -= seconds;
  };

 const seekAudio = (position: number): void => {
   const element = audio.value;
   if (!element || duration.value <= 0) return;
   const target = Math.min(position, duration.value);
   element.currentTime = target;
 };


  const playerDetails = (details: Partial<PLAYER>) => {
    store.setPlayer({
      ...details,
    });
  };

  const loadAndPlayChapter = async (chapter: CHAPTER) => {
    store.setPlaying(chapter);
    const res = await fetchChapter(chapter.id ?? '');
    if (res) {
      await init(res.chapter);
    }
  };

  const playNextInQueue = async () => {
    const nextIdx = queueIndex.value + 1;
    if (nextIdx < queue.value.length) {
      store.setQueueIndex(nextIdx);
      await loadAndPlayChapter(queue.value[nextIdx].chapter);
    }
  };

  const playPrevInQueue = async () => {
    const prevIdx = queueIndex.value - 1;
    if (prevIdx >= 0) {
      store.setQueueIndex(prevIdx);
      await loadAndPlayChapter(queue.value[prevIdx].chapter);
    }
  };

  const playChapterAt = async (index: number) => {
    if (index >= 0 && index < queue.value.length) {
      store.setQueueIndex(index);
      await loadAndPlayChapter(queue.value[index].chapter);
    }
  };

  watch(
    () => audio.value.currentTime,
    async () => {
      if (audio.value.currentTime >= validTime.value && validTime.value > 0) {
        audio.value.currentTime = validTime.value;
        await stopAudio();
        if (hasNext.value) {
          playNextInQueue();
        } else {
          playerDetails({ playing: false });
        }
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
    playbackRate,
    setPlaybackRate,
    increaseSpeed,
    decreaseSpeed,
    cycleSpeed,
    fastForwardAudio,
    rewindAudio,
    seekAudio,
    playerDetails,
    player: audioFile,
    fetchChapter,
    loading: computed(() => loading.value || pdfLoading.value),
    pdfData,
    error,
    queue,
    queueIndex,
    hasNext,
    hasPrev,
    playNextInQueue,
    playPrevInQueue,
    playChapterAt,
  };
};
