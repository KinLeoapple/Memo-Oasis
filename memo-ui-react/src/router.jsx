import {
    createBrowserRouter,

} from "react-router-dom";

import {Home} from "@/components/home/Home.jsx";
import {Admin} from "@/components/admin/Admin.jsx";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/admin",
        element: <Admin />,
    }
]);

export default routers;