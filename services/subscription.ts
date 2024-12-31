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
