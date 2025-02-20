import type { PAYSTACK_SUBSCRIPTION } from "~/types/subscription";

export const postSubscripition = async (params: { subscription: string }) =>
  useRequest<PAYSTACK_SUBSCRIPTION>(
    {
      url: `/user/subscribe`,
      method: HTTP_METHODS.POST,
      data: params,
    },
    USER_ROLES.USER
  );
