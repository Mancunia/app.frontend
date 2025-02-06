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
    title: "About",
    url: "/about",
    icon: "bx bx-info-circle",
  },
  {
    title: "Services",
    url: "/services",
    icon: "bx bx-server",
  },
  {
    title: "Contact",
    url: "/contact",
    icon: "bx bx-envelope",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: "bx bx-user",
  },
];
