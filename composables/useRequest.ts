import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { useAuthStore } from "~/stores/user";

function logout() {
  localStorage.clear();
  window.location.replace("/login");
}
const authErrors = { code: [412], message: ["inspector not found"] };

const { internet } = useUtils();
const { addError, notify } = useNotification();

export interface Response<T> {
  code: number;
  data: T;
  errors: null;
  message: string;
  subCode: string;
}
export interface PaginatedResponse<T> {
  page: number;
  records: number;
  results: T;
}
export interface ExtendedAxiosResponse<T = any, D = any>
  extends AxiosResponse<Response<T>, D> {}

export const useRequest = async <T>(
  options: AxiosRequestConfig,
  app: USER_ROLES = USER_ROLES.USER,
  toast: boolean = false,
  baseUrl?: string
): Promise<Response<T>> => {
  const config = useRuntimeConfig();
  const client = axios.create({});
  const defaultBaseUrl = config.public.apiBase;
  const store = useAuthStore();
  client.defaults.baseURL = defaultBaseUrl;

  const token = ref<string | null>(null);
  if (store.getUser?.token !== null || store.getAdmin?.token !== null) {
    if (app === USER_ROLES.ADMIN) {
      token.value = store.getAdmin.token;
    } else if (app === USER_ROLES.USER) {
      token.value = store.getUser.token;
    } else {
      token.value = "";
    }
    const authToken = `Bearer ${token.value}`;
    client.defaults.headers.common["Authorization"] = authToken;
  }

  const onSuccess = (response: ExtendedAxiosResponse<T>) => {
    return response.data;
  };
  const onError = (error: any) => {
    if (error.response?.request?.responseURL?.includes(defaultBaseUrl)) {
      //handle app related errors
    }
    addError(error.response.data.message);
    return Promise.reject(Error(error));
  };
  if (!internet) {
    throw notify("noWifi");
  }
  return client(options).then(onSuccess).catch(onError);
};
