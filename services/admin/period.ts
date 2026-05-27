import type { AppConfig, periodReq, periodRes } from '~/types/admin/period';

/** POST /admin/period/create — pass no args for auto (current month), or supply dates for manual */
export const postPeriod = async (data?: periodReq) =>
  useRequest<periodRes>(
    { url: 'admin/period/create', method: HTTP_METHODS.POST, data: data ?? {} },
    USER_ROLES.ADMIN
  );

/** GET /admin/period/all — all periods, newest first */
export const getPeriods = async () =>
  useRequest<periodRes[]>(
    { url: 'admin/period/all', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  );

/** GET /admin/period/ — latest active period (null when none exists) */
export const getActivePeriod = async () =>
  useRequest<periodRes | null>(
    { url: 'admin/period/', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  );

/** PUT /admin/period/:id/deactivate — close a period early, no body needed */
export const deactivatePeriod = async (id: string) =>
  useRequest<void>(
    { url: `admin/period/${id}/deactivate`, method: HTTP_METHODS.PUT },
    USER_ROLES.ADMIN
  );

/** GET /admin/settings — read the singleton AppConfig (includes autoPeriodCreation) */
export const getAppConfig = async () =>
  useRequest<AppConfig>(
    { url: 'admin/settings', method: HTTP_METHODS.GET },
    USER_ROLES.ADMIN
  );

/** PUT /admin/settings — partial update; e.g. { autoPeriodCreation: false } */
export const updateAppConfig = async (data: Partial<AppConfig>) =>
  useRequest<AppConfig>(
    { url: 'admin/settings', method: HTTP_METHODS.PUT, data },
    USER_ROLES.ADMIN
  );
