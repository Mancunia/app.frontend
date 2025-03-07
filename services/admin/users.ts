import type { USER_PROFILE } from "~/types/auth";

export const getUserProfiles = async (params: {
  search: string;
  account: number;
}) =>
  useRequest<USER_PROFILE[]>(
    {
      url: `admin/user/fetchUsers`,
      method: HTTP_METHODS.POST,
      data: params,
    },
    USER_ROLES.ADMIN
  );

export const makeUserAssociate = async (params: { userId: string }) =>
  useRequest<USER_PROFILE[]>(
    {
      url: `admin/user/makeAssociate`,
      method: HTTP_METHODS.PUT,
      data: params,
    },
    USER_ROLES.ADMIN
  );
