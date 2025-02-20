import { type Subscription } from "~/types/common";

export const getSubscriptions = async () =>
  useRequest<Subscription[]>({
    url: "/subscription",
    method: HTTP_METHODS.GET,
  });
export const getSubscription = async (id: string) =>
  useRequest<Subscription>(
    {
      url: `/subscription/${id}`,
      method: HTTP_METHODS.GET,
    },
    USER_ROLES.USER
  );

export const linkSubscription = async (data: { ref: string }) =>
  useRequest<Subscription>(
    {
      url: `user/subscribe/link`,
      method: HTTP_METHODS.PUT,
      data,
    },
    USER_ROLES.USER
  );

export const activateSubscriptionByPayStack = async (params: { reference: string,trxref:string }) =>
  useRequest<Subscription>(
    {
      url: `whcb/paystack`,
      method: HTTP_METHODS.PUT,
      params,
    },
    USER_ROLES.USER
  );