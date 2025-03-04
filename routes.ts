type ROUTES = {
  admin: {
    home: string;
    login: string;
    associates: string;
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
    home: "/admin",
    login: "/admin/login",
    associates: "/admin/associates",
  },
  app: {
    home: "/app",
    login: "/app/auth/login",
    signup: "/app/auth/signup",
    forgotPassword: "/app/auth/forgot-password",
    book: "/app/book/",
  },
  web: {
    home: "/",
    about: "/about",
    contact: "/contact",
  },
} as const;

export default routes;
