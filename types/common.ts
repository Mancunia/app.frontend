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
  status: string;
  active: boolean;
  visible: boolean;
  duration: number;
  users: number;
  autorenew: boolean;
  amount: number;
  origin: string;
  accent: string;
  createdAt: string;
  books?: string[];
};

export type Metrics = {
  label: string;
  data: number;
};

export type QUOTE = {
  id: string;
  quote: string;
  author: string;
  active: boolean;
  createdAt: string;
};
