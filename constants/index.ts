// This file should be used to define constants that are used throughout the application
export const APP_BASE_URL = "http://localhost:3000";
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
