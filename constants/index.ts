// This file should be used to define constants that are used throughout the application
import routes from '~/routes';
export const APP_BASE_URL = process.env.NUXT_APP_BASE;
export const APPS = {
  ADMIN: 'admin',
  WEB: 'web',
  CUSTOMER: 'customer',
};
export enum USER_ROLES {
  USER = 0,
  ASSOCIATE,
  ADMIN,
}
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const adminNavigationItems: {
  title: string;
  url: string;
  hasAccess: number[];
}[] = [
  { title: 'Hearth',        url: routes.admin.home,          hasAccess: [USER_ROLES.ADMIN, USER_ROLES.ASSOCIATE] },
  { title: 'Stories',       url: routes.admin.books,         hasAccess: [USER_ROLES.ADMIN, USER_ROLES.ASSOCIATE] },
  { title: 'Storytellers',  url: routes.admin.storytellers,  hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Listeners',     url: routes.admin.users,         hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Subscriptions',         url: routes.admin.subscriptions, hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Periods',       url: routes.admin.period,        hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Languages',      url: routes.admin.languages,      hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Organisations',  url: routes.admin.organizations,  hasAccess: [USER_ROLES.ADMIN] },
  { title: 'Quotes',         url: routes.admin.quotes,         hasAccess: [USER_ROLES.ADMIN] },
];
