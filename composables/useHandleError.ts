import { AxiosError } from "axios";

const AUTH_ERRORS = { code: [412, 401], message: ["inspector not found"] };
const API_ERRORS = ["validation errors", "provided auth token is invalid"];

function logout(loginLink: string) {
  localStorage.clear();
  window.location.replace(loginLink);
}
export const useHandleError = (
  error: any,
  {
    canShowModal = true,
    callback = (message: string) => {},
  }: { canShowModal: boolean; callback?: (message: string) => void }
) => {
  type ValidationError = {
    field: string;
    errorMessage: string;
  };
  // const errorMessage = useState<string | null>(errorModal, () => null);
  const tempMessage: Ref<string | null> = ref(null);
  const { addError } = useToast();
  const route = useRoute();

  const setError = (message: string | null): void => {
    addError(message ?? "Unexpected Error occured");
    callback(message ?? "");
  };

  if (error instanceof AxiosError) {
    const statusCode = (error as AxiosError).response?.status;
    if (AUTH_ERRORS.code.includes(statusCode ?? 0)) {
      let link = "/app/auth/login";
      if (route.path.includes("admin")) {
        link = "/admin/login";
      }
      logout(link);
      return;
    }
    tempMessage.value = error.response?.data?.message;
    if (API_ERRORS.includes(tempMessage.value?.toLowerCase() ?? "")) {
      const errors = error?.response?.data?.errors || [];
      tempMessage.value = errors
        .map((errorObj: ValidationError) => errorObj.errorMessage)
        .join(", ");
    }
  } else if (error instanceof Error) {
    tempMessage.value = error.message;
  } else {
    tempMessage.value = "Something went wrong, try again";
  }

  setError(tempMessage.value);
};
