import routes from "~/routes";

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore();
  
  const publicRoutes = [
    routes.app.login,
    routes.app.signup,
    routes.app.forgotPassword
  ];

  if (!publicRoutes.includes(to.path) && !user.getUser.token) {
    return navigateTo(routes.app.login);
  } else if (to.path === routes.app.login && user.getUser.token) {
    return navigateTo(routes.app.home);
  }
});
