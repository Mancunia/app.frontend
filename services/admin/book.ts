import type { SignedUrlResponse, SignedUrlRequest } from "~/types/common";

export const getSignedUrl = async (
  file: SignedUrlRequest,
  app: USER_ROLES = USER_ROLES.USER
) =>
  useRequest<SignedUrlResponse>(
    {
      url: `admin/book/getSignedUrl`,
      method: HTTP_METHODS.POST,
      data: file,
    },
    app
  );
