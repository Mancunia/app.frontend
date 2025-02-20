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

export type Subscription = {
  id: string;
  name: string;
  active: boolean;
  visible: boolean;
  duration: number;
  users: number;
  autorenew: boolean;
  amount: number;
  accent: string;
  createdAt: string;
};

export type Metrics = {
  label: string;
  data: number;
};
