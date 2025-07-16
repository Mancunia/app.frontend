import type { periodReq, periodRes } from "~/types/admin/period";

export const postPeriod = async (file: periodReq) =>
  useRequest<periodRes>(
    {
      url: `admin/period/create`,
      method: HTTP_METHODS.POST,
      data: file,
    },
    USER_ROLES.ADMIN
  );

export const getPeriods = async () =>
  useRequest<periodRes[]>(
    {
      url: `admin/period/all`,
      method: HTTP_METHODS.GET,
    },
    USER_ROLES.ADMIN
  );
