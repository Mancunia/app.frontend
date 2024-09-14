export type BOOK = {
  meta: {
    played: number;
    views: number;
    comments: number;
  };
  _id?: string | null;
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
  languages: string[];
  category: string[];
  createdAt: string;
  associates: string[];
  updatedAt: string;
};
export type CHAPTER = {
  id: string;
  title: string;
  content: string;
  book: BOOK;
  createdAt: string;
};
