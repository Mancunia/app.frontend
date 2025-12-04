import { computed } from "vue";
import { useRoute } from "nuxt/app";
import { useAuthStore } from "~/stores";

export function useNavigation() {
  const store = useAuthStore();

  const activeRoute = computed(() => {
    return useRoute().path;
  });

  const navItems = computed(() => {
    return adminNavigationItems.filter((item) => {
      return item.hasAccess.includes(store.getAdmin.role);
    });
  });

  const hasAccess = () => {
    return store.getAdmin.role === USER_ROLES.ADMIN;
  };
  const updateSearchParams = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }): void => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    searchParams.set(key, value);
    url.search = searchParams.toString();
    window.history.replaceState({}, "", url.toString());
  };

  return {
    activeRoute,
    updateSearchParams,
    navItems,
    hasAccess,
  };
}
