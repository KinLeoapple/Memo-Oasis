import {Layout} from "@/components/layout/Layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginState} from "@/assets/js/data/reducer/login_state_slice.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {SideBar} from "@/components/dashboard/SideBar.jsx";
import {Writing} from "@/components/dashboard/Writing.jsx";
import {selectSideBar, setSideBarValue, SideBarIndex} from "@/assets/js/data/reducer/dashboard/side_bar_slice.js";

export const DashBoard = () => {
    const dispatch = useDispatch();
    const sideBar = useSelector(selectSideBar);
    const isLogin = useSelector(selectLoginState);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin)
            navigate("/login", {replace: true});
    }, [isLogin, navigate]);

    useEffect(() => {
        dispatch(setSideBarValue(0));
    }, []);

    return (
        <>
            <Layout
                left={{
                    el: <SideBar/>,
                    fixed: true,
                }}
                content={{
                    el: <>{(sideBar === SideBarIndex.Blogs || sideBar === SideBarIndex.Drafts) &&
                        <Writing/>
                    }</>,
                }}/>
        </>
    )
}