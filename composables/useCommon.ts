import { getActiveQuote } from "~/services/admin/quote";
import { getLanguages, getCategories } from "~/services/common";
export const useCommon = (env: USER_ROLES) => {
  const store = useAuthStore();
  const languages = computed(() => store.getLanguages);
  const categories = computed(() => store.getCategories);
  const quotes = computed(() => store.getQuotes);

  const setLanguages = async () => {
    try {
      const res = await getLanguages(env) as any;
      if (res?.data) {
        store.setLanguages(res.data.data ?? res.data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in settng languages: ${error.message}`);
      }
    }
  };
  const setCategories = async () => {
    try {
      const res = await getCategories(env) as any;
      if (res?.data) {
        store.setCategories(res.data.data ?? res.data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in Setting Categories: ${error.message}`);
      }
    }
  };
  const setQuotes = async () => {
    try {
      if(quotes.value.length > 0) return; // Avoid fetching if quotes are already set
      const res = await getActiveQuote();
      if (res?.data) {
        store.setQuotes(res.data);
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
    Promise.all([setCategories(), setLanguages(), setQuotes()]);

  return { languages, categories,quotes, setLanguages, setCategories, setCommon, getSingleQuote };
};
