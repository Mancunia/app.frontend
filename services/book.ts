import type { BOOK, CHAPTER } from "~/types/book";

export const getBooks = async (app: USER_ROLES = USER_ROLES.USER, page: {}) =>
  useRequest<PaginatedResponse<BOOK[]>>(
    {
      url: `/book?${new URLSearchParams(page).toString()}`,
      method: HTTP_METHODS.GET,
      data: {
        app,
      },
    },
    app
  );

export const getBook = async (id: string, app: USER_ROLES = USER_ROLES.USER) =>
  useRequest<BOOK>(
    {
      url: `/book/${id}`,
      method: HTTP_METHODS.GET,
    },
    app
  );

export const updateBook = async (id: string, book: BOOK) =>
  useRequest<BOOK>({
    url: `/book/${id}`,
    method: HTTP_METHODS.PUT,
    data: book,
  });

export const deleteBook = async (id: string) =>
  useRequest<BOOK>({
    url: `/book/${id}`,
    method: HTTP_METHODS.DELETE,
  });
export const getChapters = async (
  book: string,
  app: USER_ROLES = USER_ROLES.USER
) =>
  useRequest<CHAPTER[]>(
    {
      url: `/book/chapter/all/${book}`,
      method: HTTP_METHODS.GET,
    },
    app
  );
export const getChapter = async (id: string) =>
  useRequest<CHAPTER>({
    url: `/chapter/${id}`,
    method: HTTP_METHODS.GET,
  });
export const createChapter = async (chapter: CHAPTER) =>
  useRequest<CHAPTER>({
    url: "/chapter",
    method: HTTP_METHODS.POST,
    data: chapter,
  });
export const updateChapter = async (id: string, chapter: CHAPTER) =>
  useRequest<CHAPTER>({
    url: `/chapter/${id}`,
    method: HTTP_METHODS.PUT,
    data: chapter,
  });
