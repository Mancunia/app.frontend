import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { useAuthStore } from "~/stores/user";

function logout() {
  localStorage.clear();
  window.location.replace("/login");
}
const authErrors = { code: [412], message: ["inspector not found"] };

const { isInternetAvailable } = useUtils();
const { addError,notify } = useNotification();

export interface Response<T> {
  code: number;
  data: T;
  errors: null;
  message: string;
  subCode: string;
}
export interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  results: T;
}
export interface ExtendedAxiosResponse<T = any, D = any>
  extends AxiosResponse<Response<T>, D> {}

export const useRequest = async <T>(
  options: AxiosRequestConfig,
  toast:boolean = false,
  baseUrl?: string
): Promise<Response<T>> => {
  const config = useRuntimeConfig();
  const client = axios.create({});
  const defaultBaseUrl = config.public.apiBase;
  // const user = useAuthStore().getUser;
  client.defaults.baseURL = defaultBaseUrl;
  // const token = user?.token;
  // const authToken = `Bearer ${token}`;

  // client.defaults.headers.common["Authorization"] = authToken;

  const onSuccess = (response: ExtendedAxiosResponse<T>) => {
    console.log({axiosResponse:response});
    return response.data;
  };
  const onError = (error: any) => {
 
    if (error.response?.request?.responseURL?.includes(defaultBaseUrl)) {
     //handle app related errors
    }
    addError(error.response.data.message);
    return Promise.reject(Error(error));
  };
  if (!isInternetAvailable()) {
    throw notify("noWifi");
  }
  return client(options).then(onSuccess).catch(onError);
};
