export type BOOK = {
  meta: {
    played: number;
    views: number;
    comments: number;
  };
  _id: string;
  status: number;
  authors: string[];
  cover: string;
  moment: string;
  title: string;
  description: string;
  folder: string;
  uploader: string;
  __v: number;
  collections: string[];
  createdAt: string;
  associates: string[];
  updatedAt: string;
};
export type CHAPTER = {
  createdAt: string;
  _id: string;
  title: string;
  moment: string;
  description: string;
  book: string;
  file: string;
  mimetype: string;
};
