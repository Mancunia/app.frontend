import routes from "~/routes";
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore();
  if (to.path !== routes.admin.login && !user.getAdmin.token) {
    return navigateTo(routes.admin.login);
  } else if (to.path === routes.admin.login && user.getAdmin.token) {
    return navigateTo(routes.admin.home);
  }
});
