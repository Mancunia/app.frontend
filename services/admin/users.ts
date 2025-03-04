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
