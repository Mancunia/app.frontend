import type { USER_ROLES } from "~/constants";

export type USER = {
  email: string;
  username: string;
  dp: string;
  bio: string;
  token: string;
  role:number;
  subscription: {
    active: boolean;
    id: string;
  };
};

export type USER_LOGIN = {
  email: string;
  password: string;
};

export type USER_REGISTER = {
  email: string;
  password: string;
  username: string;
  account: USER_ROLES;
};
