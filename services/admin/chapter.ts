import type { SignedUrlRequest } from "~/types/common";
import { getSignedUrl } from "./book";
import type { CHAPTER } from "~/types/book";

export const getChapterSignedUrl = async (
  file: SignedUrlRequest,
  app: USER_ROLES = USER_ROLES.USER
) => getSignedUrl(file, USER_ROLES.ADMIN);

export const createChapter = async (chapter: CHAPTER) =>
  useRequest<CHAPTER>(
    {
      url: "admin/book/createChapter",
      method: HTTP_METHODS.POST,
      data: chapter,
    },
    USER_ROLES.ADMIN
  );

  export const updateChapter = async (chapter: CHAPTER) =>
    useRequest<CHAPTER>(
      {
        url: `admin/book/updateChapter/${chapter.id}`,
        method: HTTP_METHODS.PUT,
        data: chapter,
      },
      USER_ROLES.ADMIN
    );

  export const deleteChapter = async (chapter:string) =>{
    useRequest({
      url:`admin/book/deleteChapter/${chapter}`,
      method:HTTP_METHODS.DELETE
    },
    USER_ROLES.ADMIN
  )
  }
