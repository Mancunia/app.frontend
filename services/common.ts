import type { Categories, Languages } from "~/types/common";

export const getLanguages = async (app: USER_ROLES) =>
  useRequest<Languages[]>(
    {
      url: "/book/languages",
      method: HTTP_METHODS.GET,
    },
    app
  );
export const getCategories = async (app: USER_ROLES) =>
  useRequest<Categories[]>(
    {
      url: "/book/category",
      method: HTTP_METHODS.GET,
    },
    app
  );
