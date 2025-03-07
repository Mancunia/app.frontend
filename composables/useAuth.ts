import { login, adminLogin, logout, register } from "~/services/auth";
import type { USER_LOGIN } from "~/types/auth";
import routes from "~/routes";

export const useAuth = () => {
  const resend = ref({
    retried: 0,
    retries: 1,
    disabled: false,
  });
  const loading = ref(false);

  const { addSuccess, addError } = useNotification();
  const user = useAuthStore();
  const { stopAudio } = usePlayer();
  const user_login = async (credentials: USER_LOGIN) => {
    try {
      loading.value = true;
      const { data } = await login(credentials);
      if (data) {
        user.setUser(data);
        addSuccess("Login successful");
        navigateTo(routes.app.home);
      }
    } finally {
      loading.value = false;
    }
  };
  const user_register = async (credentials: {
    email: string;
    password: string;
    username: string;
    account: USER_ROLES;
  }) => {
    try {
      loading.value = true;
      const { data } = await register(credentials);
      if (data) {
        addSuccess("Register successful");
        navigateTo(routes.app.home);
      }
    } finally {
      loading.value = false;
    }
  };

  const admin_login = async (credentials: USER_LOGIN) => {
    try {
      loading.value = true;
      const { data } = await adminLogin(credentials);
      if (data) {
        user.setAdmin(data);
        addSuccess("Login successful");
        navigateTo(routes.admin.home);
      }
    } finally {
      loading.value = false;
    }
  };

  const user_logout = async () => {
    try {
      await logout(USER_ROLES.USER);
      user.logout(USER_ROLES.USER);
      stopAudio();
      addSuccess("Logout successful");
      navigateTo(routes.app.login);
    } catch (error) {
      addError("Error logging out");
    }
  };
  const admin_logout = async () => {
    try {
      await logout(USER_ROLES.ADMIN);
      user.logout(USER_ROLES.ADMIN);
      addSuccess("Logout successful");
      navigateTo(routes.admin.login);
    } catch (error) {
      addError("Error logging out");
    }
  };

  return {
    user_login,
    user_register,
    admin_login,
    user_logout,
    admin_logout,
    loading,
  };
};
