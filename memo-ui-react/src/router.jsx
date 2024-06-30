import {
    createBrowserRouter,

} from "react-router-dom";

import {Home} from "@/components/home/Home.jsx";
import {Admin} from "@/components/admin/Admin.jsx";
import {Login} from "@/components/login/Login.jsx";
import {SignUp} from "@/components/signup/SignUp.jsx";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/admin",
        element: <Admin />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    }
]);

export default routers;