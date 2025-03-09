import routes from "~/routes";
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore();
  const { hasAccess } = useNavigation();
  const protectedRoutes = [routes.admin.users];

  if (to.path !== routes.admin.login && !user.getAdmin.token) {
    return navigateTo(routes.admin.login);
  } else if (protectedRoutes.includes(to.path) && !hasAccess()) {
    return navigateTo(routes.admin.home);
  } else if (to.path === routes.admin.login && user.getAdmin.token) {
    return navigateTo(routes.admin.home);
  }
});
