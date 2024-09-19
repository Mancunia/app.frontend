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
    try {

    const response = await fetch(signedUrl, {
      headers: {
        "Content-Type": file.type,
      },
      method: HTTP_METHODS.PUT,
      body: file,
    });
    if(!response.ok)
      return null

    return signedUrl.split('?')[0];
  }catch(error){
    console.error('Error during file upload:', error);
    return null
  }
  };

  return {
    generateSignedUrl,
    uploadFile,
  };
};
