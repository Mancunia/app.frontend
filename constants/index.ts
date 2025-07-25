// This file should be used to define constants that are used throughout the application
import routes from "~/routes";
export const APP_BASE_URL = process.env.NUXT_APP_BASE;
export const APPS = {
  ADMIN: "admin",
  WEB: "web",
  CUSTOMER: "customer",
};
export enum USER_ROLES {
  USER = 0,
  ASSOCIATE,
  ADMIN,
}
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const adminNavigationItems: {
  title: string;
  url: string;
  icon: string;
  hasAccess: number[];
}[] = [
  {
    title: "Home",
    url: routes.admin.home,
    icon: "bx bx-home",
    hasAccess: [USER_ROLES.ADMIN, USER_ROLES.ASSOCIATE],
  },
  {
    title: "Users",
    url: routes.admin.users,
    icon: "bx bx-user",
    hasAccess: [USER_ROLES.ADMIN],
  },
  {
    title: "Periods",
    url: routes.admin.period,
    icon: "bx bx-time",
    hasAccess: [USER_ROLES.ADMIN],
  },
];
