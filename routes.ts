type ROUTES = {
    admin:{
        home: string;
        login: string;
    },
    app:{
        home: string;
        login: string;
        register: string;
    }
    web?:{
        home: string;
        about: string;
        contact: string;
    }
}

 const routes:ROUTES = {
    admin:{
        home: "/admin",
        login: "/admin/login",
       
    },
    app:{
        home: "/app",
        login: "/app/login",
        register: "/app/register",
    },
    web:{
        home: "/",
        about: "/about",
        contact: "/contact",
    }
} as const 

export default routes;
