export type BOOK = {
  id?: string;
  title: string;
  description: string;
  category: string[];
  languages: string[];
  authors: string[];
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
  type:'ebook'|'audio'|null;
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
export type PLAYER = {
  showDetails: boolean;
  playing: boolean;
  autoplay: boolean;
  loop: boolean;
  volume: number;
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
}

export type PdfFileData = {
  name: string;
  size: number;
  totalPages: number;
  pages: PdfPageData[];
}
