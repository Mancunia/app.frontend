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
  hasAccess?: number[];
}[] = [
  {
    title: "Home",
    url: routes.admin.home,
    icon: "bx bx-home",
  },
  {
    title: "Associates",
    url: routes.admin.associates,
    icon: "bx bx-user",
  },
];
