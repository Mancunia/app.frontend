import type { Categories, Languages } from "./common";
import type { GenreType } from "./admin/genre";

export type AuthorObject = {
  id: string;
  name: string;
  bio?: string;
  active: boolean;
};

export type NarratorObject = {
  id: string;
  name: string;
  bio?: string;
  active: boolean;
};

export type BOOK = {
  id?: string;
  title: string;
  description: string;
  category: (Categories | string)[];
  genres: (GenreType | string)[];
  languages: (Languages | string)[];
  authors: (AuthorObject | string)[];
  narrators: (NarratorObject | string)[];
  associates: string[];
  cover: string;
  meta: {
    played: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
};
export type CHAPTER = {
  id?: string;
  bookId: string;
  title: string;
  content: string | null;
  book: BOOK | null;
  createdAt?: string;
  password: string | null;
  type: "ebook" | "audio" | null;
  page: number | null;
  seek: number | null;
};
// export type CHAPTER_REQUEST = {
//   title: string | null;
//   password:string|null;
//   content: string | null;
//   bookId: string;
// };

export type PLAY_CHAPTER = {
  chapter: CHAPTER;
  playTime: number;
  status: string;
};
export type QUEUE_ITEM = {
  chapter: CHAPTER;
};

export type PLAYER = {
  showDetails: boolean;
  playing: boolean;
  autoplay: boolean;
  loop: boolean;
  volume: number;
  playbackRate: number;
  showDrawer: boolean;
};

export type Comment = {
  id: string;
  user: {
    id: string;
    name: string;
    picture: string;
    email: string;
  };
  comment: string;
};

export type PdfPageData = {
  pageNumber: number;
  textContent: string;
};

export type PdfFileData = {
  name: string;
  size: number;
  totalPages: number;
  pages?: PdfPageData[];
  data: Uint8Array | string | null;
  password?: string;
};
