type ROUTES = {
  admin: {
    home: string;
    login: string;
  };
  app: {
    home: string;
    login: string;
    register: string;
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
  },
  app: {
    home: "/app",
    login: "/app/login",
    register: "/app/register",
    book: "/app/book/",
  },
  web: {
    home: "/",
    about: "/about",
    contact: "/contact",
  },
} as const;

export default routes;
