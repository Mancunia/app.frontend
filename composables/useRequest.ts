import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { useAuthStore } from "~/stores";

function logout() {
  localStorage.clear();
  window.location.replace("/login");
}

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
  console.log({app})
  let token = "" ;
  if (store.getUser?.token !== null || store.getAdmin?.token !== null) {
    if (app === USER_ROLES.ADMIN) {
      console.log("admin", store.getAdmin.token);
      token = store.getAdmin.token;
    } else if (app === USER_ROLES.USER) {
      console.log("user");
      token = store.getUser.token;
    } else {
      console.log("none");
      token = "";
    }
    const authToken = `Bearer ${token}`;
    console.log({ authToken });
    client.defaults.headers.common["Authorization"] = authToken;
  }

  const onSuccess = (response: ExtendedAxiosResponse<T>) => {
    return response.data;
  };
  const onError = (error: any) => {
    if (error.response?.request?.responseURL?.includes(defaultBaseUrl)) {
      //handle app related errors
    }
    addError(error.response?.data?.message ?? 'An error occurred');
    return Promise.reject(Error(error));
  };
  // if (!internet) {
  //   throw notify("Connection lost");
  // }
  return client(options).then(onSuccess).catch(onError);
};
