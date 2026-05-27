import type { USER_PROFILE } from "~/types/auth";

export const getProfile = async () =>
  useRequest<USER_PROFILE>(
    { url: `/user/profile`, method: HTTP_METHODS.GET },
    USER_ROLES.USER
  );

export const updateProfile = async (params: {
  username?: string;
  bio?: string;
  dp?: string;
  whatsappNumber?: string;
}) =>
  useRequest<USER_PROFILE>(
    {
      url: `/user/profile`,
      method: HTTP_METHODS.PATCH,
      data: params,
    },
    USER_ROLES.USER
  );
