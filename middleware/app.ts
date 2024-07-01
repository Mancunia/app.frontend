import routes from "~/routes";
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore();
  if (to.path !== routes.app.login && !user.getUser.token) {
    return navigateTo(routes.app.login);
  } else if (to.path === routes.app.login && user.getUser.token) {
    return navigateTo(routes.app.home);
  }
});
