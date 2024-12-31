import type { SignedUrlRequest } from "~/types/common";
import { getSignedUrl } from "./book";
import type { CHAPTER_REQUEST, CHAPTER } from "~/types/book";

export const getChapterSignedUrl = async (
  file: SignedUrlRequest,
  app: USER_ROLES = USER_ROLES.USER
) => getSignedUrl(file, USER_ROLES.ADMIN);

export const createChapter = async (chapter: CHAPTER_REQUEST) =>
  useRequest<CHAPTER>(
    {
      url: "admin/book/createChapter",
      method: HTTP_METHODS.POST,
      data: chapter,
    },
    USER_ROLES.ADMIN
  );
