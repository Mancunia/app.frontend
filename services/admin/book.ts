import type {
  SignedUrlResponse,
  SignedUrlRequest,
  Metrics,
} from "~/types/common";
import type { BOOK } from "~/types/book";

export const getSignedUrl = async (
  file: SignedUrlRequest,
  app: USER_ROLES = USER_ROLES.ADMIN
) =>
  useRequest<SignedUrlResponse>(
    {
      url: `admin/book/getSignedUrl`,
      method: HTTP_METHODS.POST,
      data: file,
    },
    USER_ROLES.ADMIN
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

export const deleteBook = async (id: string) =>
  useRequest(
    {
      url: `admin/book/deleteBook/${id}`,
      method: HTTP_METHODS.DELETE,
    },
    USER_ROLES.ADMIN
  );

export const updateBook = async (id: string, book: BOOK) =>
  useRequest<BOOK>(
    {
      url: `admin/book/updateBook/${id}`,
      method: HTTP_METHODS.PUT,
      data: book,
    },
    USER_ROLES.ADMIN
  );

export const getMetrics = async (id: string, params: {}) =>
  useRequest<Metrics[]>(
    {
      url: `admin/book/metrics/${id}`,
      method: HTTP_METHODS.GET,
      params,
    },
    USER_ROLES.ADMIN
  );
