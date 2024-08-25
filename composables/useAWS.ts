import type { SignedUrlRequest} from "~/types/common";
import { getSignedUrl } from "~/services/admin/book";

export const useAWS = (app: USER_ROLES = USER_ROLES.USER) => {
  const generateSignedUrl = async (file: File) => {
    const request: SignedUrlRequest = {
      file: file.name,
      fileType: file.type,
    };
    const { data } = await getSignedUrl(request, app);
    return data;
  };

  const uploadFile = async (file: File, signedUrl: string) => {
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: file,
    });
    return await response.json();
  };

  return {
    generateSignedUrl,
    uploadFile,
  };
};
