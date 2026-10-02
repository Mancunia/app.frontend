import type { PdfFileData, PLAY_CHAPTER, PLAYER, CHAPTER } from "~/types/book";
import { playChapter } from "~/services/play";

export const usePlayer = (app?: USER_ROLES) => {
  const audio = useState<HTMLAudioElement>("player", () => new Audio());
  const pdfFile = useState<PdfFileData | null>("pdfData", () => null);
  const audioFile = ref<PLAY_CHAPTER | null>(null);
  const duration = useState<number>("playerDuration", () => 0);
  const currentTime = useState<number>("playerCurrentTime", () => 0);
  const listenersBound = useState<boolean>("playerListenersBound", () => false);
  const advancing = useState<boolean>("playerAdvancing", () => false);
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

  // Bind audio element listeners once for the whole app. Every component
  // calling usePlayer() shares the same Audio element, so per-instance
  // listeners would stack up and advance the queue multiple times.
  if (import.meta.client && audio.value && !listenersBound.value) {
    listenersBound.value = true;
    const el = audio.value;
    el.addEventListener("timeupdate", () => {
      currentTime.value = el.currentTime;
    });
    el.addEventListener("loadedmetadata", () => {
      duration.value = el.duration;
    });
    el.addEventListener("pause", () => playerDetails({ playing: false }));
    el.addEventListener("play", () => playerDetails({ playing: true }));
    el.addEventListener("ended", async () => {
      if (store.getQueueIndex + 1 < store.getQueue.length) {
        await playNextInQueue();
      } else {
        playerDetails({ playing: false });
      }
    });
  }

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
    if (!res) return;
    if (res.chapter.type === "ebook") {
      await stopAudio();
      await initPDF(res);
    } else {
      await init(res);
    }
  };

  const playNextInQueue = async () => {
    if (advancing.value) return;
    const nextIdx = store.getQueueIndex + 1;
    if (nextIdx >= store.getQueue.length) return;
    advancing.value = true;
    try {
      store.setQueueIndex(nextIdx);
      await loadAndPlayChapter(store.getQueue[nextIdx].chapter);
    } finally {
      advancing.value = false;
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
