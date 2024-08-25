import type { Categories, Languages } from "~/types/common";

export const getLanguages = async () =>
  useRequest<Languages[]>({
    url: "/book/languages",
    method: HTTP_METHODS.GET,
  });
export const getCategories = async () =>
  useRequest<Categories[]>({
    url: "/book/category",
    method: HTTP_METHODS.GET,
  });
