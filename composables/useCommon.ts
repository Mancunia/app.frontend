import { getActiveQuote } from "~/services/admin/quote";
import { getLanguages, getCategories } from "~/services/common";
import { getConsumerGenres } from "~/services/genre";

export const useCommon = (env: USER_ROLES) => {
  const store = useAuthStore();
  const languages = computed(() => store.getLanguages);
  const categories = computed(() => store.getCategories);
  const genres = computed(() => store.getGenres);
  const quotes = computed(() => store.getQuotes);

  const normalizeId = (data: any[]) => {
    return data.map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));
  };

  const setLanguages = async () => {
    try {
      const res = await getLanguages(env);
      if (res) {
        store.setLanguages(normalizeId(res));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in setting languages: ${error.message}`);
      }
    }
  };
  const setCategories = async () => {
    try {
      const res = await getCategories(env);
      if (res) {
        store.setCategories(normalizeId(res));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in Setting Categories: ${error.message}`);
      }
    }
  };
  const setGenres = async () => {
    try {
      const res = await getConsumerGenres();
      if (res) {
        store.setGenres(normalizeId(res));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in Setting Genres: ${error.message}`);
      }
    }
  };
  const setQuotes = async () => {
    try {
      if(quotes.value.length > 0) return; // Avoid fetching if quotes are already set
      const res = await getActiveQuote();
      if (res) {
        store.setQuotes(res);
      } else {
        store.setQuotes([]);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in Setting Quotes: ${error.message}`);
      }
    }
  };

  const getSingleQuote = async () => {
    try {
      const quotesSize = quotes.value.length;
      if (quotesSize === 0) return null;
      const randomIndex = Math.floor(Math.random() * quotesSize);
      const q = quotes.value[randomIndex];
      return {
        quote: q.quote,
        author: q.author,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in fetching active quote: ${error.message}`);
        return null;
      }
    }
  }

  const setCommon = () =>
    Promise.all([setCategories(), setLanguages(), setGenres(), setQuotes()]);

  return { languages, categories, genres, quotes, setLanguages, setCategories, setGenres, setCommon, getSingleQuote };
};
