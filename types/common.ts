export type Languages = {
  id: string;
  name: string;
};

export type Categories = {
  id: string;
  name: string;
};
export type SignedUrlRequest = {
  file: string;
  fileType: string;
};

export type SignedUrlResponse = {
  signedURL: string;
  time: number;
};
