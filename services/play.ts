import type { CHAPTER, PLAY_CHAPTER } from "~/types/book";

export const playChapter = async (
  chapter: string,
  app: USER_ROLES = USER_ROLES.USER
) =>
  useRequest<PLAY_CHAPTER>(
    {
      url: `/chapter/play/${chapter}`,
      method: HTTP_METHODS.GET,
      data: {
        app,
      },
    },
    app
  );
