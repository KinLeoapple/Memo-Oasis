import {
    createBrowserRouter,

} from "react-router-dom";

import {Blog} from "@/components/blog/Blog.jsx";
import {DashBoard} from "@/components/dashboard/DashBoard.jsx";
import {Login} from "@/components/login/Login.jsx";
import {SignUp} from "@/components/signup/SignUp.jsx";
import {Home} from "@/components/home/Home.jsx";
import {Writer} from "@/components/writer/Writer.jsx";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/blog",
        element: <Blog/>,
    },
    {
        path: "/blog/:id",
        element: <Blog/>,
    },
    {
        path: "/writeblog",
        element: <Writer/>
    },
    {
        path: "/writeblog/:id",
        element: <Writer/>
    },
    {
        path: "/dashboard",
        element: <DashBoard/>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/signup",
        element: <SignUp/>,
    }
]);

export default routers;