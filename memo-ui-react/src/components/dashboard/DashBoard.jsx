import {Layout} from "@/components/layout/Layout.jsx";
import {useSelector} from "react-redux";
import {selectLoginState} from "@/assets/js/data/reducer/login_state_slice.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const DashBoard = () => {
    const isLogin = useSelector(selectLoginState);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin)
            navigate("/login", {replace: true});
    }, [isLogin, navigate]);

    return (
        <>
            <Layout/>
        </>
    )
}