import type { USER_PROFILE } from "~/types/auth";

export const getUserProfiles = async (params: {
  search: string;
  account: USER_ROLES | USER_ROLES[];
}) =>
  useRequest<USER_PROFILE[]>(
    {
      url: `admin/user/fetchUsers`,
      method: HTTP_METHODS.POST,
      data: params,
    },
    USER_ROLES.ADMIN
  );

export const changeRole = async (params: {
  userId: string;
  type: USER_ROLES;
}) =>
  useRequest<USER_PROFILE>(
    {
      url: `admin/user/changeRole`,
      method: HTTP_METHODS.PUT,
      data: params,
    },
    USER_ROLES.ADMIN
  );
