type ROUTES = {
  admin: {
    home: string
    login: string
    users: string
    usersDetail: string
    period: string
    books: string
    booksNew: string
    subscriptions: string
    storytellers: string
    revenue: string
    languages: string
    organizations: string
    authors: string
    narrators: string
    origins: string
    email: string
    quotes: string
  }
  app: {
    home: string
    login: string
    signup: string
    forgotPassword: string
    book: string
    author: string
    narrator: string
    library: string
    search: string
    profile: string
  }
  web?: {
    home: string
    about: string
    contact: string
  }
}

const routes: ROUTES = {
  admin: {
    home:          '/admin',
    login:         '/admin/login',
    users:         '/admin/users',
    usersDetail:   '/admin/users/',
    period:        '/admin/period',
    books:         '/admin/books',
    booksNew:      '/admin/books/new',
    subscriptions: '/admin/subscriptions',
    storytellers:  '/admin/storytellers',
    revenue:       '/admin/revenue',
    languages:     '/admin/languages',
    organizations: '/admin/organizations',
    authors:       '/admin/authors',
    narrators:     '/admin/narrators',
    origins:       '/admin/origins',
    email:         '/admin/email',
    quotes:        '/admin/quotes',
  },
  app: {
    home:           '/app',
    login:          '/app/auth/login',
    signup:         '/app/auth/signup',
    forgotPassword: '/app/auth/forgot-password',
    book:           '/app/book/',
    author:         '/app/author/',
    narrator:       '/app/narrator/',
    library:        '/app/library',
    search:         '/app/search',
    profile:        '/app/profile',
  },
  web: {
    home:    '/',
    about:   '/about',
    contact: '/contact',
  },
} as const

export default routes
