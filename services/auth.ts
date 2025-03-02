import { HTTP_METHODS } from "~/constants";
import type { USER_LOGIN, USER_REGISTER, USER } from "~/types/auth";

export const login = async (crendentials: USER_LOGIN) =>
  useRequest<USER>({
    url: "/user/login",
    method: HTTP_METHODS.POST,
    data: crendentials,
  });

export const adminLogin = async (crendentials: USER_LOGIN) =>
  useRequest<USER>({
    url: "/admin/user/login",
    method: HTTP_METHODS.POST,
    data: crendentials,
  });

export const register = async (crendentials: USER_REGISTER) =>
  useRequest({
    url: "/user/add",
    method: HTTP_METHODS.POST,
    data: crendentials,
  });

export const logout = async (app: USER_ROLES = USER_ROLES.USER) =>
  useRequest(
    {
      url: `/user/logout/`,
      method: HTTP_METHODS.GET,
    },
    app
  );

export const verify = async (token: string) =>
  useRequest<USER>({
    url: `/user/verify/${token}`,
    method: HTTP_METHODS.GET,
  });

export const forgotPassword = async (email: string) =>
  useRequest<USER>({
    url: `/user/forgot-password`,
    method: HTTP_METHODS.POST,
    data: { email },
  });

export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}) =>
  useRequest<USER>({
    url: `/user/reset-password`,
    method: HTTP_METHODS.PUT,
    data,
  });
