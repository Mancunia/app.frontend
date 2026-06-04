import type { QUOTE } from "~/types/admin/quote";

export const getQuotes = async (page: { page: number; limit: number }) =>
  useRequest<PaginatedResponse<QUOTE[]>>(
    {
      url: "admin/quotes",
      method: HTTP_METHODS.GET,
    },
    USER_ROLES.ADMIN
  );

export const getQuote = async (id: string) =>
  useRequest<QUOTE>(
    {
      url: `admin/quotes/${id}`,
      method: HTTP_METHODS.GET,
    },
    USER_ROLES.ADMIN
  );

export const createQuote = async (quote: Partial<QUOTE>) =>
  useRequest<QUOTE>(
    {
      url: "admin/quotes",
      method: HTTP_METHODS.POST,
      data: quote,
    },
    USER_ROLES.ADMIN
  );

export const updateQuote = async (id: string, quote: Partial<QUOTE>) =>
  useRequest<QUOTE>(
    {
      url: `admin/quotes/${id}`,
      method: HTTP_METHODS.PUT,
      data: quote,
    },
    USER_ROLES.ADMIN
  );

export const deleteQuote = async (id: string) =>
  useRequest<void>(
    {
      url: `admin/quotes/${id}`,
      method: HTTP_METHODS.DELETE,
    },
    USER_ROLES.ADMIN
  );

