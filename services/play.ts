import type { CHAPTER } from "~/types/book";

export const playChapter = async (
  chapter: string,
  app: USER_ROLES = USER_ROLES.USER
) =>
  useRequest<CHAPTER>(
    {
      url: `/chapter/play/${chapter}`,
      method: HTTP_METHODS.GET,
      data: {
        app,
      },
    },
    app
  );
