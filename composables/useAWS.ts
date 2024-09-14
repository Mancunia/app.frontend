import type { SignedUrlRequest } from "~/types/common";
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
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(signedUrl, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: HTTP_METHODS.PUT,
      body: formData,
    });
    return await response.json();
  };

  return {
    generateSignedUrl,
    uploadFile,
  };
};
