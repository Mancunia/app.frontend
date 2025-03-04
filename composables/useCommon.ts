import { getLanguages, getCategories } from "~/services/common";
export const useCommon = (env: USER_ROLES) => {
  const store = useAuthStore();
  const languages = computed(() => store.getLanguages);
  const categories = computed(() => store.getCategories);

  const setLanguages = async () => {
    try {
      const { data } = await getLanguages(env);
      if (data) {
        store.setLanguages(data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in settng languages: ${error.message}`);
      }
    }
  };
  const setCategories = async () => {
    try {
      const { data } = await getCategories(env);
      if (data) {
        store.setCategories(data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error in Setting Categories: ${error.message}`);
      }
    }
  };

  const setCommon = () => Promise.all([setCategories(), setLanguages()]);

  return { languages, categories, setLanguages, setCategories, setCommon };
};
