import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { useAuthStore } from "~/stores";
import { USER_ROLES } from "~/constants";

const { internet } = useUtils();
const { notify } = useNotification();

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
) => {
  const config = useRuntimeConfig();
  const client = axios.create({});
  const defaultBaseUrl = config.public.apiBase;
  const store = useAuthStore();
  client.defaults.baseURL = defaultBaseUrl;
  let token = "";
  if (store.getUser?.token !== null || store.getAdmin?.token !== null) {
    if (app === USER_ROLES.ADMIN) {
      token = store.getAdmin?.token;
    } else if (app === USER_ROLES.USER) {
      token = store.getUser?.token;
    } else {
      token = "";
    }
    const authToken = `Bearer ${token}`;
    client.defaults.headers.common["Authorization"] = authToken;
  }

  try {
    const response = await client.request<Response<T>>(options);
    return response.data.data;
  } catch (error) {
    useHandleError(error, { canShowModal: true });
  }
};
