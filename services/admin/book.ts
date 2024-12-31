import type { SignedUrlResponse, SignedUrlRequest } from "~/types/common";
import type { BOOK } from "~/types/book";

export const getSignedUrl = async (
  file: SignedUrlRequest,
  app: USER_ROLES = USER_ROLES.USER
) =>
  useRequest<SignedUrlResponse>(
    {
      url: `admin/book/getSignedUrl`,
      method: HTTP_METHODS.POST,
      data: file,
    },
    app
  );

export const createBook = async (book: BOOK) =>
  useRequest<BOOK>(
    {
      url: "admin/book/createBook",
      method: HTTP_METHODS.POST,
      data: book,
    },
    USER_ROLES.ADMIN
  );

export const updateBook = async (book: BOOK) =>
  useRequest<BOOK>(
    {
      url: "admin/book/updateBook",
      method: HTTP_METHODS.PUT,
      data: book,
    },
    USER_ROLES.ADMIN
  );

 
