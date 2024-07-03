import { login, adminLogin } from "~/services/auth";
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
  const user_login = async (credentials: USER_LOGIN) => {
    try {
      loading.value = true;
      const { data } = await login(credentials);
      if (data) {
        user.setUser(data);
        addSuccess("Login successful");
        navigateTo(routes.app.home);
      }
    }finally{
      loading.value = false;
    }
  };

  const admin_login = async (credentials: USER_LOGIN) => {
    try {
      loading.value = true;
      const {data} = await adminLogin(credentials);
      if (data) {
        user.setAdmin(data);
        addSuccess("Login successful");
        navigateTo(routes.admin.home);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    user_login,
    admin_login,
    loading,
  };
};
