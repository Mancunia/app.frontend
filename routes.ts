type ROUTES = {
  admin: {
    home: string;
    login: string;
    users: string;
    period: string;
    books: string;
    booksNew: string;
    subscriptions: string;
    storytellers: string;
    revenue: string;
    conversation: string;
  };
  app: {
    home: string;
    login: string;
    signup: string;
    forgotPassword: string;
    book: string;
  };
  web?: {
    home: string;
    about: string;
    contact: string;
  };
};

const routes: ROUTES = {
  admin: {
    home: '/admin',
    login: '/admin/login',
    users: '/admin/users',
    period: '/admin/period',
    books: '/admin/books',
    booksNew: '/admin/books/new',
    subscriptions: '/admin/subscriptions',
    storytellers: '/admin/storytellers',
    revenue: '/admin/revenue',
    conversation: '/admin/conversation',
  },
  app: {
    home: '/app',
    login: '/app/auth/login',
    signup: '/app/auth/signup',
    forgotPassword: '/app/auth/forgot-password',
    book: '/app/book/',
  },
  web: {
    home: '/',
    about: '/about',
    contact: '/contact',
  },
} as const;

export default routes;
